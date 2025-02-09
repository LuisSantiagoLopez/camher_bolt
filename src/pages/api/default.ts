// src/pages/api/database.ts
import { NextApiRequest, NextApiResponse } from 'next';
// Use our custom server client utility that we created in src/utils/supabase/server.ts.
// This replaces the deprecated createServerSupabaseClient from @supabase/auth-helpers-nextjs.
import { createClient } from '@/utils/supabase/server';

/**
 * API handler to submit a role request.
 * This endpoint accepts only POST requests.
 *
 * Flow:
 * 1. Create an authenticated Supabase client (handles cookies via Next.js headers).
 * 2. Retrieve the current session using supabase.auth.getSession().
 * 3. Validate the request body (must include email and role).
 * 4. Compare the provided email to the authenticated user's email.
 * 5. Insert a new record into the "role_requests" table.
 * 6. Return success or appropriate error messages.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Step 1: Only allow POST requests.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Step 2: Create an authenticated Supabase client using our custom utility.
    const supabase = createClient();

    // Retrieve the current session from Supabase.
    const { data: { session } } = await supabase.auth.getSession();

    // If no session exists, return an Unauthorized response.
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Step 3: Extract email and role from the request body.
    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    // Step 4: Ensure the email provided matches the email in the session.
    if (email !== session.user.email) {
      return res.status(403).json({ error: 'Email does not match authenticated user' });
    }

    // Step 5: Insert the new role request into the "role_requests" table.
    const { data, error } = await supabase
      .from('role_requests')
      .insert([
        {
          email,
          requested_role: role,
          status: 'pending',
        },
      ])
      .select()
      .single();

    // Handle insertion errors.
    if (error) {
      console.error('Database error:', error);
      return res.status(400).json({
        error: 'Failed to submit role request',
        details: error.message,
      });
    }

    // Step 6: If successful, return a success message along with the inserted data.
    return res.status(200).json({
      message: 'Request submitted successfully',
      data,
    });
  } catch (error: any) {
    // Log unexpected errors and return a 500 Internal Server Error.
    console.error('Error processing request:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
}
