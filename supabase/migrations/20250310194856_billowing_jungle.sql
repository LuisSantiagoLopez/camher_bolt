/*
  # Add RLS policies for verification requests

  1. Security
    - Enable RLS on verification_requests table
    - Add policy for authenticated users to create their own verification requests
    - Add policy for administrators to read and update all verification requests
*/

-- Enable RLS
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to create their own verification request
CREATE POLICY "Users can create their own verification requests"
ON verification_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = profile_id);

-- Allow administrators to read all verification requests
CREATE POLICY "Administrators can read all verification requests"
ON verification_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'administrador'
    AND profiles.is_verified = true
  )
);

-- Allow administrators to update verification requests
CREATE POLICY "Administrators can update verification requests"
ON verification_requests
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'administrador'
    AND profiles.is_verified = true
  )
);