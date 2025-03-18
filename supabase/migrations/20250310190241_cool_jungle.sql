/*
  # Add pending profiles table

  1. New Tables
    - `pending_profiles`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `role` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `pending_profiles` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS pending_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pending_profiles ENABLE ROW LEVEL SECURITY;

-- Allow admins to read all pending profiles
CREATE POLICY "Admins can read all pending profiles"
  ON pending_profiles
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'administrador');

-- Allow admins to update pending profiles
CREATE POLICY "Admins can update pending profiles"
  ON pending_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'administrador');

-- Allow users to create their own pending profile
CREATE POLICY "Users can create their own pending profile"
  ON pending_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);