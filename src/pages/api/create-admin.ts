// src/pages/api/create-admin.ts

import type { NextApiRequest, NextApiResponse } from 'next';
// Import our custom server client utility which handles cookies and uses @supabase/ssr.
import { createClient } from '@/utils/supabase/server';

/**
 * API Endpoint to create a new admin role for a target user.
 *
 * Workflow:
 * 1. Only accepts POST requests.
 * 2. Creates a server-side Supabase client.
 * 3. Retrieves the current session (must be authenticated).
 * 4. Verifies that the current session's user already has an admin role.
 *    - This prevents unauthorized users from creating an admin.
 * 5. Extracts the target user's email from the request body.
 * 6. Looks up the target user in the auth.users table.
 * 7. Inserts a new record in the user_roles table with role 'admin' for the target user.
 * 8. Returns a success message along with the newly created role record.
 *
 * Note:
 * - Ensure that your JWT (and session) includes the user id and that RLS policies on the
 *   auth.users and user_roles tables are set up appropriately.
 * - This endpoint should be secured so that only an existing admin can call it.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Enforce POST-only requests.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Create a Supabase server client using our custom utility.
    const supabase = createClient();

    // 3. Retrieve the current session.
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    // 4. Verify that the current user is already an admin.
    // This query checks if a record exists in user_roles for the current user with role 'admin'.
    const { data: currentAdminRole, error: adminRoleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .single();

    if (adminRoleError || !currentAdminRole) {
      // If the current user is not an admin, return a 403 Forbidden error.
      return res.status(403).json({ error: 'Forbidden. Only an admin can create a new admin.' });
    }

    // 5. Extract the target user's email from the request body.
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required to create an admin.' });
    }

    // 6. Look up the target user in the auth.users table.
    // Note: The auth.users table is part of the Supabase authentication schema.
    const { data: targetUser, error: targetUserError } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (targetUserError || !targetUser) {
      console.error('Error fetching target user:', targetUserError);
      return res.status(400).json({ error: 'Failed to find user with provided email.' });
    }

    // 7. Insert a new record into the user_roles table for the target user with role 'admin'.
    const { data: newAdminRole, error: insertError } = await supabase
      .from('user_roles')
      .insert([{ user_id: targetUser.id, role: 'admin' }])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating admin role:', insertError);
      return res.status(400).json({ error: 'Failed to create admin role.', details: insertError.message });
    }

    // 8. Return a success response.
    return res.status(200).json({
      message: 'Admin role created successfully.',
      data: newAdminRole,
    });

  } catch (error: any) {
    console.error('Unhandled error in create-admin:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
