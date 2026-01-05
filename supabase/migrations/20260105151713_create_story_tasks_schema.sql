/*
  # Story Tasks Schema

  ## Overview
  Adds task management capabilities to design stories:
  - Tasks can be created within story phases
  - Tasks have start and end dates within the phase timeline
  - Tasks support drag-to-create interaction
  - Users can track task status and assignees

  ## New Tables

  ### `story_tasks`
  Individual tasks within story phases
  - `id` (uuid, primary key)
  - `phase_id` (uuid, references story_phases)
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
  - Enable RLS on story_tasks
  - Users can only access tasks in their own projects
  - Cascade deletes: story_phases -> story_tasks

  ## Indexes
  - Index on phase_id for fast task lookup
  - Index on dates for timeline queries
*/

-- Create story_tasks table
CREATE TABLE IF NOT EXISTS story_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id uuid NOT NULL REFERENCES story_phases(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'activity' CHECK (type IN ('activity', 'meeting')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  assignee text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_task_date_range CHECK (end_date >= start_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_story_tasks_phase_id ON story_tasks(phase_id);
CREATE INDEX IF NOT EXISTS idx_story_tasks_start_date ON story_tasks(start_date);
CREATE INDEX IF NOT EXISTS idx_story_tasks_end_date ON story_tasks(end_date);

-- Enable Row Level Security
ALTER TABLE story_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for story_tasks
CREATE POLICY "Users can view tasks in own stories"
  ON story_tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM story_phases
      JOIN design_stories ON design_stories.id = story_phases.story_id
      JOIN projects ON projects.id = design_stories.project_id
      WHERE story_phases.id = story_tasks.phase_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks in own stories"
  ON story_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM story_phases
      JOIN design_stories ON design_stories.id = story_phases.story_id
      JOIN projects ON projects.id = design_stories.project_id
      WHERE story_phases.id = story_tasks.phase_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in own stories"
  ON story_tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM story_phases
      JOIN design_stories ON design_stories.id = story_phases.story_id
      JOIN projects ON projects.id = design_stories.project_id
      WHERE story_phases.id = story_tasks.phase_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM story_phases
      JOIN design_stories ON design_stories.id = story_phases.story_id
      JOIN projects ON projects.id = design_stories.project_id
      WHERE story_phases.id = story_tasks.phase_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks in own stories"
  ON story_tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM story_phases
      JOIN design_stories ON design_stories.id = story_phases.story_id
      JOIN projects ON projects.id = design_stories.project_id
      WHERE story_phases.id = story_tasks.phase_id
      AND projects.user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_story_tasks_updated_at
  BEFORE UPDATE ON story_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();