/*
  # Create providers table

  1. New Tables
    - `providers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `profile_id` (uuid, references profiles)
      - `email` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `providers` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  profile_id uuid REFERENCES profiles(id) NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read providers
CREATE POLICY "Anyone can read providers"
  ON providers
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow admins to create/update providers
CREATE POLICY "Admins can create providers"
  ON providers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'administrador'
  ));

CREATE POLICY "Admins can update providers"
  ON providers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'administrador'
  ));

-- Providers can update their own records
CREATE POLICY "Providers can update own record"
  ON providers
  FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid());