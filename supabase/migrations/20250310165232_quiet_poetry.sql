/*
  # Weekly Tables Schema

  1. New Tables
    - `weekly_tables`
      - `id` (uuid, primary key)
      - `week_start` (date)
      - `week_end` (date) 
      - `status` (integer)
      - `table_url` (text, nullable)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `weekly_table_items`
      - `id` (uuid, primary key)
      - `weekly_table_id` (uuid, references weekly_tables)
      - `part_request_id` (uuid, references part_requests)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create weekly_tables table
CREATE TABLE IF NOT EXISTS weekly_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date NOT NULL,
  week_end date NOT NULL,
  status integer NOT NULL DEFAULT 0,
  table_url text,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create weekly_table_items table
CREATE TABLE IF NOT EXISTS weekly_table_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_table_id uuid REFERENCES weekly_tables(id) ON DELETE CASCADE NOT NULL,
  part_request_id uuid REFERENCES part_requests(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE weekly_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_table_items ENABLE ROW LEVEL SECURITY;

-- Create policies for weekly_tables
CREATE POLICY "Authenticated users can read weekly tables"
  ON weekly_tables
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Contador can create weekly tables"
  ON weekly_tables
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('contador', 'contador_jr')
  ));

CREATE POLICY "Contador can update weekly tables"
  ON weekly_tables
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('contador', 'contador_jr')
  ));

-- Create policies for weekly_table_items
CREATE POLICY "Authenticated users can read weekly table items"
  ON weekly_table_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Contador can create weekly table items"
  ON weekly_table_items
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('contador', 'contador_jr')
  ));

CREATE POLICY "Contador can update weekly table items"
  ON weekly_table_items
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('contador', 'contador_jr')
  ));

CREATE POLICY "Contador can delete weekly table items"
  ON weekly_table_items
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('contador', 'contador_jr')
  ));