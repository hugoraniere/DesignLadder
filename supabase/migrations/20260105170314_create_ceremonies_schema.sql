/*
  # Create ceremonies schema

  1. New Tables
    - `ceremonies`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `name` (text)
      - `frequency` (text: daily, weekly, biweekly, monthly)
      - `duration_minutes` (integer)
      - `objective` (text)
      - `agenda` (text)
      - `participants` (text array)
      - `meeting_link` (text)
      - `position` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `ceremonies` table
    - Add policies for authenticated users to manage ceremonies in their projects
*/

CREATE TABLE IF NOT EXISTS ceremonies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  frequency text NOT NULL DEFAULT 'weekly',
  duration_minutes integer NOT NULL DEFAULT 60,
  objective text,
  agenda text,
  participants text[],
  meeting_link text,
  position integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT frequency_check CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly'))
);

ALTER TABLE ceremonies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ceremonies in their projects"
  ON ceremonies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = ceremonies.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert ceremonies in their projects"
  ON ceremonies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = ceremonies.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update ceremonies in their projects"
  ON ceremonies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = ceremonies.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = ceremonies.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete ceremonies in their projects"
  ON ceremonies FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = ceremonies.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_ceremonies_project_id ON ceremonies(project_id);