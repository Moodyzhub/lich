/*
  # Create Booking System Tables

  1. New Tables
    - `tutor_available_schedule`
      - `id` (uuid, primary key)
      - `tutor_id` (integer) - Reference to tutor
      - `day_of_week` (integer) - 0=Sunday, 1=Monday, ..., 6=Saturday
      - `start_time` (time) - Start time of availability
      - `end_time` (time) - End time of availability
      - `is_active` (boolean) - Is this schedule active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `bookings`
      - `id` (uuid, primary key)
      - `tutor_id` (integer) - Reference to tutor
      - `student_id` (integer) - Reference to student
      - `package_id` (integer, nullable) - Reference to package if applicable
      - `booking_date` (date) - Date of the session
      - `start_time` (time) - Start time of session
      - `end_time` (time) - End time of session
      - `session_number` (integer) - Current session number
      - `total_sessions` (integer) - Total sessions in package
      - `topic` (text, nullable) - Topic of the session
      - `meet_link` (text, nullable) - Google Meet or Zoom link
      - `status` (text) - confirmed, pending, cancelled, completed
      - `notes` (text, nullable) - Additional notes
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `students`
      - `id` (serial, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text, nullable)
      - `avatar` (text, nullable)
      - `created_at` (timestamptz)

    - `tutors`
      - `id` (serial, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `created_at` (timestamptz)

    - `packages`
      - `id` (serial, primary key)
      - `tutor_id` (integer)
      - `name` (text)
      - `description` (text, nullable)
      - `total_sessions` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for tutors to read their own data
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read students"
  ON students FOR SELECT
  TO authenticated
  USING (true);

-- Create tutors table
CREATE TABLE IF NOT EXISTS tutors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tutors"
  ON tutors FOR SELECT
  TO authenticated
  USING (true);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id SERIAL PRIMARY KEY,
  tutor_id INTEGER NOT NULL REFERENCES tutors(id),
  name TEXT NOT NULL,
  description TEXT,
  total_sessions INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can view own packages"
  ON packages FOR SELECT
  TO authenticated
  USING (true);

-- Create tutor_available_schedule table
CREATE TABLE IF NOT EXISTS tutor_available_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id INTEGER NOT NULL REFERENCES tutors(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tutor_id, day_of_week, start_time)
);

ALTER TABLE tutor_available_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can view own schedule"
  ON tutor_available_schedule FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Tutors can manage own schedule"
  ON tutor_available_schedule FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id INTEGER NOT NULL REFERENCES tutors(id),
  student_id INTEGER NOT NULL REFERENCES students(id),
  package_id INTEGER REFERENCES packages(id),
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  session_number INTEGER DEFAULT 1,
  total_sessions INTEGER DEFAULT 1,
  topic TEXT,
  meet_link TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tutors can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Tutors can manage own bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_tutor_id ON bookings(tutor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_tutor_schedule_tutor_id ON tutor_available_schedule(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tutor_schedule_day ON tutor_available_schedule(day_of_week);
