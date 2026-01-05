/*
  # Create NPS tracking schema

  1. New Tables
    - `nps_responses`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `designer_id` (uuid, references auth.users)
      - `designer_name` (text)
      - `score` (integer, 0-10)
      - `month` (integer, 1-12)
      - `year` (integer)
      - `comment` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `nps_responses` table
    - Add policies for authenticated users to manage NPS in their projects
  
  3. Constraints
    - Score must be between 0 and 10
    - Unique constraint on (project_id, designer_id, month, year)
*/

CREATE TABLE IF NOT EXISTS nps_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  designer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  designer_name text NOT NULL,
  score integer NOT NULL,
  month integer NOT NULL,
  year integer NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT score_check CHECK (score >= 0 AND score <= 10),
  CONSTRAINT month_check CHECK (month >= 1 AND month <= 12),
  CONSTRAINT year_check CHECK (year >= 2020),
  CONSTRAINT unique_nps_per_month UNIQUE (project_id, designer_id, month, year)
);

ALTER TABLE nps_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view NPS in their projects"
  ON nps_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = nps_responses.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert NPS in their projects"
  ON nps_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = nps_responses.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update NPS in their projects"
  ON nps_responses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = nps_responses.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = nps_responses.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete NPS in their projects"
  ON nps_responses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = nps_responses.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_nps_responses_project_id ON nps_responses(project_id);
CREATE INDEX IF NOT EXISTS idx_nps_responses_designer_id ON nps_responses(designer_id);
CREATE INDEX IF NOT EXISTS idx_nps_responses_month_year ON nps_responses(month, year);