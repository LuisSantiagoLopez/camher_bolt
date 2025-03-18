/*
  # Update RLS policies for verification requests

  1. Changes
    - Drop existing policies
    - Add new permissive policies for all operations
    - Enable RLS but allow all authenticated users full access

  2. Security Note
    - These policies are intentionally permissive for development
    - In production, you may want to add more restrictive policies
*/

-- Enable RLS
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Users can create their own verification requests" ON verification_requests;
DROP POLICY IF EXISTS "Administrators can read all verification requests" ON verification_requests;
DROP POLICY IF EXISTS "Administrators can update verification requests" ON verification_requests;

-- Allow all authenticated users to perform all operations
CREATE POLICY "Enable all operations for authenticated users"
ON verification_requests
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow insert with any profile_id
CREATE POLICY "Allow insert with any profile_id"
ON verification_requests
FOR INSERT
TO authenticated
WITH CHECK (true);