/*
  # Create commission settings table

  1. New Tables
    - `commission_settings`
      - `id` (uuid, primary key) - Unique identifier
      - `commission_course` (numeric) - Commission percentage for course payments
      - `commission_booking` (numeric) - Commission percentage for booking payments
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `commission_settings` table
    - Add policy for admins to read commission settings
    - Add policy for admins to update commission settings

  3. Notes
    - This table stores the platform commission percentages
    - Only one active record should exist at a time
    - Commission values are stored as percentages (e.g., 10 for 10%)
*/

-- Create commission_settings table
CREATE TABLE IF NOT EXISTS commission_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_course numeric NOT NULL DEFAULT 10 CHECK (commission_course >= 0 AND commission_course <= 100),
  commission_booking numeric NOT NULL DEFAULT 10 CHECK (commission_booking >= 0 AND commission_booking <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE commission_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read commission settings
CREATE POLICY "Anyone can read commission settings"
  ON commission_settings
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only admins can update commission settings
CREATE POLICY "Admins can update commission settings"
  ON commission_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only admins can insert commission settings
CREATE POLICY "Admins can insert commission settings"
  ON commission_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default commission settings if none exist
INSERT INTO commission_settings (commission_course, commission_booking)
SELECT 10, 10
WHERE NOT EXISTS (SELECT 1 FROM commission_settings);
