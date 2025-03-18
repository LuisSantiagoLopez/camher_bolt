/*
  # Complaints Schema

  1. New Tables
    - `complaints`
      - `id` (uuid, primary key)
      - `part_request_id` (uuid, references part_requests)
      - `description` (text)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_request_id uuid REFERENCES part_requests(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can read complaints"
  ON complaints
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Taller can create complaints"
  ON complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('taller', 'taller_jr')
  ));