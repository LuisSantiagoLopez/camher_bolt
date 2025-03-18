/*
  # Add Verification System

  1. Updates
    - Add is_verified column to profiles table
    - Create verification_requests table for tracking verification status
    - Add policies for verification system

  2. Security
    - Only admins can view and manage verification requests
    - Users can only see their own verification status
*/

-- Add is_verified column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;

-- Create verification_requests table
CREATE TABLE IF NOT EXISTS verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Policies for verification_requests
CREATE POLICY "Admins can do everything with verification requests"
  ON verification_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'administrador'
      AND profiles.is_verified = true
    )
  );

CREATE POLICY "Users can view their own verification requests"
  ON verification_requests
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- Update profiles policies
CREATE POLICY "Users can view verified profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_verified = true OR id = auth.uid());

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_verification_requests_updated_at
  BEFORE UPDATE ON verification_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();