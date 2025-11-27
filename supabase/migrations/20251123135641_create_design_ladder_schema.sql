/*
  # Design Ladder Schema

  1. New Tables
    - `responses`
      - `id` (uuid, primary key)
      - `problem` (text) - The main problem described
      - `desired_outcome` (text) - What outcome they want
      - `frequency` (text) - How often the problem occurs
      - `team_size` (text) - Size of their team
      - `role` (text) - Their role
      - `company_size` (text) - Size of company
      - `budget` (text) - Budget range
      - `urgency` (text) - When they need it solved
      - `early_tester` (boolean) - Open to early testing
      - `company_name` (text) - Company name
      - `email` (text) - Contact email
      - `created_at` (timestamptz) - Submission timestamp

    - `analytics_events`
      - `id` (uuid, primary key)
      - `event_type` (text) - Type of event (scroll, click, form_field_focus, etc.)
      - `event_data` (jsonb) - Additional event metadata
      - `session_id` (text) - Session identifier
      - `created_at` (timestamptz) - Event timestamp

    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique) - Admin email
      - `password_hash` (text) - Hashed password
      - `created_at` (timestamptz) - Account creation timestamp

  2. Security
    - Enable RLS on all tables
    - Responses: Public can insert, only authenticated admins can read
    - Analytics events: Public can insert, only authenticated admins can read
    - Admin users: Only authenticated admins can read their own data
*/

-- Create responses table
CREATE TABLE IF NOT EXISTS responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem text NOT NULL,
  desired_outcome text NOT NULL,
  frequency text NOT NULL,
  team_size text NOT NULL,
  role text NOT NULL,
  company_size text NOT NULL,
  budget text NOT NULL,
  urgency text NOT NULL,
  early_tester boolean DEFAULT false,
  company_name text NOT NULL,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Responses policies
CREATE POLICY "Anyone can submit responses"
  ON responses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can view all responses"
  ON responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Analytics events policies
CREATE POLICY "Anyone can track events"
  ON analytics_events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can view analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admin users policies
CREATE POLICY "Admins can view own data"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS responses_created_at_idx ON responses(created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_session_idx ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS analytics_events_created_at_idx ON analytics_events(created_at DESC);