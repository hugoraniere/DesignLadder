/*
  # Design Stories Roadmap Schema

  ## Overview
  This migration transforms the roadmap into a Design Stories system where:
  - Each project can have multiple design stories
  - Stories are horizontal timelines with internal phases
  - Phases are sequential segments within a story
  - Users can adjust phase durations and configure sprint settings
  - Timeline supports zoom levels for better visualization

  ## Changes to Existing Tables

  ### 1. `projects` - Add new columns
  - `zoom_level` (integer, default 100) - Timeline zoom: 50, 75, 100, 150, 200
  - Keep existing fields

  ## New Tables

  ### 2. `design_stories`
  Stories are the main planning units in the roadmap
  - `id` (uuid, primary key)
  - `project_id` (uuid, references projects)
  - `name` (text) - Story name
  - `color` (text) - Hex color for visual identification (e.g., "#3B82F6")
  - `start_date` (date) - Story start date
  - `end_date` (date) - Story end date (calculated from phases)
  - `handoff_date` (date, optional) - Delivery/handoff marker
  - `position` (integer) - Vertical order in roadmap
  - `collapsed` (boolean, default false) - Whether story is collapsed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `story_phases`
  Phases are sequential segments within a story
  - `id` (uuid, primary key)
  - `story_id` (uuid, references design_stories)
  - `name` (text) - Phase name (e.g., "Discovery", "Ideação", "Prototipação")
  - `duration_days` (integer) - Duration in business days
  - `order` (integer) - Sequential order (1, 2, 3...)
  - `color` (text, optional) - Custom color (inherits from story if null)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Important Notes

  1. **Phase Start/End Dates**: Calculated dynamically based on story start_date and phase durations
  2. **Phase Continuity**: Each phase starts where the previous one ends (no gaps)
  3. **Story End Date**: Automatically updated when phases change
  4. **Sprint Configuration**: Stored in project.sprint_duration_weeks (1-4)
  5. **Zoom Levels**: 50%, 75%, 100%, 150%, 200% (stored as integers)

  ## Migration Strategy

  - Existing `phases` and `tasks` tables remain unchanged for backward compatibility
  - New design_stories system is independent
  - Projects can migrate to new system gradually

  ## Security
  - Enable RLS on all new tables
  - Users can only access stories in their own projects
  - Cascade deletes: project -> stories -> phases

  ## Indexes
  - Index on project_id for fast story lookup
  - Index on story_id for phase lookup
  - Index on position for ordering
*/

-- Add zoom_level to projects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'zoom_level'
  ) THEN
    ALTER TABLE projects ADD COLUMN zoom_level integer NOT NULL DEFAULT 100 CHECK (zoom_level IN (50, 75, 100, 150, 200));
  END IF;
END $$;

-- Create design_stories table
CREATE TABLE IF NOT EXISTS design_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#3B82F6',
  start_date date NOT NULL,
  end_date date NOT NULL,
  handoff_date date,
  position integer NOT NULL DEFAULT 1,
  collapsed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_story_date_range CHECK (end_date >= start_date),
  CONSTRAINT valid_handoff_date CHECK (handoff_date IS NULL OR handoff_date >= end_date)
);

-- Create story_phases table
CREATE TABLE IF NOT EXISTS story_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES design_stories(id) ON DELETE CASCADE,
  name text NOT NULL,
  duration_days integer NOT NULL CHECK (duration_days > 0),
  "order" integer NOT NULL DEFAULT 1,
  color text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_phase_order_per_story UNIQUE (story_id, "order")
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_design_stories_project_id ON design_stories(project_id);
CREATE INDEX IF NOT EXISTS idx_design_stories_position ON design_stories(project_id, position);
CREATE INDEX IF NOT EXISTS idx_story_phases_story_id ON story_phases(story_id);
CREATE INDEX IF NOT EXISTS idx_story_phases_order ON story_phases(story_id, "order");

-- Enable Row Level Security
ALTER TABLE design_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_phases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for design_stories
CREATE POLICY "Users can view stories in own projects"
  ON design_stories FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = design_stories.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create stories in own projects"
  ON design_stories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = design_stories.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update stories in own projects"
  ON design_stories FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = design_stories.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = design_stories.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete stories in own projects"
  ON design_stories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = design_stories.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for story_phases
CREATE POLICY "Users can view phases in own stories"
  ON story_phases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM design_stories
      JOIN projects ON projects.id = design_stories.project_id
      WHERE design_stories.id = story_phases.story_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create phases in own stories"
  ON story_phases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM design_stories
      JOIN projects ON projects.id = design_stories.project_id
      WHERE design_stories.id = story_phases.story_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update phases in own stories"
  ON story_phases FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM design_stories
      JOIN projects ON projects.id = design_stories.project_id
      WHERE design_stories.id = story_phases.story_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM design_stories
      JOIN projects ON projects.id = design_stories.project_id
      WHERE design_stories.id = story_phases.story_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete phases in own stories"
  ON story_phases FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM design_stories
      JOIN projects ON projects.id = design_stories.project_id
      WHERE design_stories.id = story_phases.story_id
      AND projects.user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_design_stories_updated_at
  BEFORE UPDATE ON design_stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_story_phases_updated_at
  BEFORE UPDATE ON story_phases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update story end_date when phases change
CREATE OR REPLACE FUNCTION update_story_end_date()
RETURNS TRIGGER AS $$
DECLARE
  story_start_date date;
  total_duration integer;
  new_end_date date;
BEGIN
  -- Get story start date
  SELECT start_date INTO story_start_date
  FROM design_stories
  WHERE id = COALESCE(NEW.story_id, OLD.story_id);

  -- Calculate total duration from all phases
  SELECT COALESCE(SUM(duration_days), 0) INTO total_duration
  FROM story_phases
  WHERE story_id = COALESCE(NEW.story_id, OLD.story_id);

  -- Calculate new end date (adding business days)
  new_end_date := story_start_date + (total_duration || ' days')::interval;

  -- Update story end_date
  UPDATE design_stories
  SET end_date = new_end_date,
      updated_at = now()
  WHERE id = COALESCE(NEW.story_id, OLD.story_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update story end_date when phases change
CREATE TRIGGER update_story_end_date_on_phase_change
  AFTER INSERT OR UPDATE OR DELETE ON story_phases
  FOR EACH ROW
  EXECUTE FUNCTION update_story_end_date();

-- Function to reorder story positions
CREATE OR REPLACE FUNCTION reorder_story_positions()
RETURNS TRIGGER AS $$
BEGIN
  -- Reorder all stories in the project
  WITH ordered_stories AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY position, created_at) as new_position
    FROM design_stories
    WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
  )
  UPDATE design_stories
  SET position = ordered_stories.new_position
  FROM ordered_stories
  WHERE design_stories.id = ordered_stories.id
    AND design_stories.position != ordered_stories.new_position;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain story positions
CREATE TRIGGER maintain_story_positions
  AFTER INSERT OR DELETE ON design_stories
  FOR EACH ROW
  EXECUTE FUNCTION reorder_story_positions();
