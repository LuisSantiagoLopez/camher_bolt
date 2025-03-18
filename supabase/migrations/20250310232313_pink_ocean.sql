/*
  # Fix email columns in profiles and providers tables

  1. Changes
    - Add email column to profiles table with NULL allowed initially
    - Add email column to providers table with NULL allowed initially
    - Update existing profiles with emails from auth.users
    - Add unique constraints after data is populated
    - Finally make columns NOT NULL
*/

-- Add email columns as nullable first
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'providers' AND column_name = 'email'
  ) THEN
    ALTER TABLE providers ADD COLUMN email text;
  END IF;
END $$;

-- Update existing profiles with emails from auth.users
DO $$
BEGIN
  UPDATE profiles p
  SET email = u.email
  FROM auth.users u
  WHERE p.id = u.id
  AND p.email IS NULL;
END $$;

-- Update providers with emails from profiles
DO $$
BEGIN
  UPDATE providers pr
  SET email = p.email
  FROM profiles p
  WHERE pr.profile_id = p.id
  AND pr.email IS NULL;
END $$;

-- Add unique constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_email_unique'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'providers_email_unique'
  ) THEN
    ALTER TABLE providers ADD CONSTRAINT providers_email_unique UNIQUE (email);
  END IF;
END $$;

-- Make columns NOT NULL after data is populated
DO $$
BEGIN
  ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;
  ALTER TABLE providers ALTER COLUMN email SET NOT NULL;
END $$;