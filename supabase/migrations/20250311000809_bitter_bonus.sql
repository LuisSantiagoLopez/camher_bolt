/*
  # Create storage buckets

  1. New Storage Buckets
    - `damage_photos` for storing damage photos
    - `invoices` for storing invoice files
    - `counter_receipts` for storing counter receipt files

  2. Security
    - Enable public access for all buckets
*/

-- Create damage_photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('damage_photos', 'damage_photos', true);

-- Create invoices bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', true);

-- Create counter_receipts bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('counter_receipts', 'counter_receipts', true);

-- Create policies for public access
CREATE POLICY "Give public access to damage_photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'damage_photos');

CREATE POLICY "Give public access to invoices"
ON storage.objects FOR SELECT
USING (bucket_id = 'invoices');

CREATE POLICY "Give public access to counter_receipts"
ON storage.objects FOR SELECT
USING (bucket_id = 'counter_receipts');

-- Create policies for authenticated uploads
CREATE POLICY "Allow authenticated uploads to damage_photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'damage_photos');

CREATE POLICY "Allow authenticated uploads to invoices"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Allow authenticated uploads to counter_receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'counter_receipts');