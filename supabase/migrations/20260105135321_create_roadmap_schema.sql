/*
  # Design Roadmap Platform - Complete Schema

  ## Overview
  This migration creates the complete database schema for a logged-in Design Roadmap platform
  with Gantt chart visualization, supporting project management for designers.

  ## New Tables

  ### 1. `projects`
  Stores design projects for authenticated users
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users) - Owner of the project
  - `name` (text) - Project name
  - `description` (text, optional) - Project description
  - `start_date` (date) - Project start date (business day)
  - `handoff_date` (date, optional) - Delivery/handoff date (business day)
  - `sprint_duration_weeks` (integer, default 2) - Sprint duration in weeks
  - `status` (text) - Project status: 'active', 'archived', 'completed'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `phases`
  Stores project phases (Discovery, Ideation, Prototyping, etc.)
  - `id` (uuid, primary key)
  - `project_id` (uuid, references projects)
  - `name` (text) - Phase name (e.g., "Discovery", "Ideação")
  - `order` (integer) - Display order (1, 2, 3...)
  - `color` (text, optional) - Custom color for phase
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `tasks`
  Stores tasks/activities within phases
  - `id` (uuid, primary key)
  - `phase_id` (uuid, references phases)
  - `name` (text) - Task name
  - `type` (text) - 'activity' or 'meeting'
  - `start_date` (date) - Start date (business day)
  - `end_date` (date) - End date (business day)
  - `status` (text) - 'planned', 'in_progress', 'completed'
  - `assignee` (text, optional) - Responsible person
  - `notes` (text, optional) - Additional notes
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own projects and related data
  - Cascade deletes: project -> phases -> tasks

  ## Indexes
  - Index on user_id for fast project lookup
  - Index on project_id for phases and tasks
  - Index on dates for timeline queries
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  handoff_date date,
  sprint_duration_weeks integer NOT NULL DEFAULT 2,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create phases table
CREATE TABLE IF NOT EXISTS phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  "order" integer NOT NULL DEFAULT 1,
  color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id uuid NOT NULL REFERENCES phases(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'activity' CHECK (type IN ('activity', 'meeting')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  assignee text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_phases_project_id ON phases(project_id);
CREATE INDEX IF NOT EXISTS idx_phases_order ON phases(project_id, "order");
CREATE INDEX IF NOT EXISTS idx_tasks_phase_id ON tasks(phase_id);
CREATE INDEX IF NOT EXISTS idx_tasks_dates ON tasks(start_date, end_date);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for phases
CREATE POLICY "Users can view phases of own projects"
  ON phases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create phases in own projects"
  ON phases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update phases in own projects"
  ON phases FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete phases in own projects"
  ON phases FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = phases.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for tasks
CREATE POLICY "Users can view tasks in own projects"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = tasks.phase_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks in own projects"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = tasks.phase_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in own projects"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = tasks.phase_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = tasks.phase_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks in own projects"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM phases
      JOIN projects ON projects.id = phases.project_id
      WHERE phases.id = tasks.phase_id
      AND projects.user_id = auth.uid()
    )
  );

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phases_updated_at
  BEFORE UPDATE ON phases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
