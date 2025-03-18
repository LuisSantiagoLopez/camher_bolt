/*
  # Initial Schema for Part Tracking System

  1. New Tables
    - `profiles` - User profiles with role-based access
    - `units` - Truck units
    - `part_requests` - Part requests with status tracking
    - `parts` - Individual parts within requests
    - `providers` - Parts providers
    - `weekly_tables` - Weekly summary tables
    - `complaints` - Complaint records

  2. Security
    - Enable RLS on all tables
    - Add permissive policies for internal use
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM (
  'taller', 
  'taller_jr', 
  'proveedor', 
  'administrador', 
  'contador', 
  'contador_jr'
);

-- Create enum for part request status
CREATE TYPE request_status AS ENUM (
  'status_minus_1',
  'status_0_1',
  'status_0_2',
  'status_0_3',
  'status_0_4',
  'status_1',
  'status_2',
  'status_3',
  'status_4',
  'status_5',
  'status_6',
  'status_7',
  'status_8',
  'status_9',
  'status_10',
  'status_11',
  'status_12',
  'status_13'
);

-- Create enum for repair types
CREATE TYPE repair_type AS ENUM (
  'llantas',
  'motor_tren_motriz',
  'aceite_motor',
  'suspension_acoplamiento',
  'electrico',
  'frenos',
  'hojalateria_pintura',
  'medidoras_bombas',
  'otro'
);

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create units table
CREATE TABLE units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create providers table
CREATE TABLE providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  profile_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create part requests table
CREATE TABLE part_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  short_id text GENERATED ALWAYS AS (substring(id::text, 1, 5)) STORED,
  status request_status NOT NULL DEFAULT 'status_1',
  unit_id uuid REFERENCES units(id),
  created_by uuid REFERENCES profiles(id),
  provider_id uuid REFERENCES providers(id),
  problem_location text,
  operator_detected text,
  problem_description text,
  damaged_parts_location text,
  mechanic_work text,
  assigned_mechanic text,
  repair_type repair_type,
  repair_type_other text,
  observations text,
  is_important boolean DEFAULT false,
  is_cash_payment boolean DEFAULT false,
  damage_photo_url text,
  invoice_number text,
  invoice_url text,
  counter_receipt_url text,
  edit_message text,
  total_amount decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create parts table
CREATE TABLE parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_request_id uuid REFERENCES part_requests(id),
  name text NOT NULL,
  description text,
  cost decimal(10,2) NOT NULL,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create complaints table
CREATE TABLE complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_request_id uuid REFERENCES part_requests(id),
  description text NOT NULL,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create weekly tables
CREATE TABLE weekly_tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start date NOT NULL,
  week_end date NOT NULL,
  status smallint DEFAULT 0,
  table_url text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create weekly table items
CREATE TABLE weekly_table_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_table_id uuid REFERENCES weekly_tables(id),
  part_request_id uuid REFERENCES part_requests(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE part_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_table_items ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Allow all access to profiles" ON profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to units" ON units FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to providers" ON providers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to part_requests" ON part_requests FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to parts" ON parts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to complaints" ON complaints FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to weekly_tables" ON weekly_tables FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all access to weekly_table_items" ON weekly_table_items FOR ALL TO authenticated USING (true);