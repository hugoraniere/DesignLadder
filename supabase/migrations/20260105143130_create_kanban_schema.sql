/*
  # Kanban Board Schema

  ## Overview
  This migration creates the complete Kanban board functionality for project task management.
  Kanban boards are project-specific and serve for smaller, operational, fast tasks that complement
  the macro roadmap (Gantt chart).

  ## New Tables

  ### 1. `kanban_columns`
  Stores Kanban board columns (customizable per project)
  - `id` (uuid, primary key)
  - `project_id` (uuid, references projects) - Parent project
  - `name` (text) - Column name (e.g., "Backlog", "Em andamento", "Concluído")
  - `position` (integer) - Display order (1, 2, 3...)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `kanban_cards`
  Stores individual Kanban cards (tasks)
  - `id` (uuid, primary key)
  - `column_id` (uuid, references kanban_columns) - Parent column
  - `title` (text) - Card title (required)
  - `description` (text, optional) - Card description
  - `priority` (text) - Priority: 'low', 'medium', 'high' (default 'medium')
  - `due_date` (date, optional) - Due date
  - `tags` (text array, optional) - Array of tags
  - `position` (integer) - Display order within column
  - `linked_roadmap_task_id` (uuid, optional, references tasks) - Optional link to roadmap task
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Features
  - Full drag-and-drop support via position fields
  - Customizable columns (rename, reorder, create, delete)
  - Optional integration with roadmap tasks
  - Tags for flexible categorization
  - Priority and due date for task management

  ## Security
  - Enable RLS on all tables
  - Users can only access Kanban boards in their own projects
  - Cascade deletes: project -> columns -> cards

  ## Indexes
  - Index on project_id for fast column lookup
  - Index on column_id for card lookup
  - Index on position for ordering
  - Index on linked_roadmap_task_id for integration queries
*/

-- Create kanban_columns table
CREATE TABLE IF NOT EXISTS kanban_columns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  position integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_column_position_per_project UNIQUE (project_id, position)
);

-- Create kanban_cards table
CREATE TABLE IF NOT EXISTS kanban_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  column_id uuid NOT NULL REFERENCES kanban_columns(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date date,
  tags text[],
  position integer NOT NULL DEFAULT 1,
  linked_roadmap_task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_card_position_per_column UNIQUE (column_id, position)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_kanban_columns_project_id ON kanban_columns(project_id);
CREATE INDEX IF NOT EXISTS idx_kanban_columns_position ON kanban_columns(project_id, position);
CREATE INDEX IF NOT EXISTS idx_kanban_cards_column_id ON kanban_cards(column_id);
CREATE INDEX IF NOT EXISTS idx_kanban_cards_position ON kanban_cards(column_id, position);
CREATE INDEX IF NOT EXISTS idx_kanban_cards_linked_task ON kanban_cards(linked_roadmap_task_id);
CREATE INDEX IF NOT EXISTS idx_kanban_cards_due_date ON kanban_cards(due_date) WHERE due_date IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for kanban_columns
CREATE POLICY "Users can view columns in own projects"
  ON kanban_columns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = kanban_columns.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create columns in own projects"
  ON kanban_columns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = kanban_columns.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update columns in own projects"
  ON kanban_columns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = kanban_columns.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = kanban_columns.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete columns in own projects"
  ON kanban_columns FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = kanban_columns.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for kanban_cards
CREATE POLICY "Users can view cards in own projects"
  ON kanban_cards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM kanban_columns
      JOIN projects ON projects.id = kanban_columns.project_id
      WHERE kanban_columns.id = kanban_cards.column_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create cards in own projects"
  ON kanban_cards FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM kanban_columns
      JOIN projects ON projects.id = kanban_columns.project_id
      WHERE kanban_columns.id = kanban_cards.column_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update cards in own projects"
  ON kanban_cards FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM kanban_columns
      JOIN projects ON projects.id = kanban_columns.project_id
      WHERE kanban_columns.id = kanban_cards.column_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM kanban_columns
      JOIN projects ON projects.id = kanban_columns.project_id
      WHERE kanban_columns.id = kanban_cards.column_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete cards in own projects"
  ON kanban_cards FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM kanban_columns
      JOIN projects ON projects.id = kanban_columns.project_id
      WHERE kanban_columns.id = kanban_cards.column_id
      AND projects.user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_kanban_columns_updated_at
  BEFORE UPDATE ON kanban_columns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kanban_cards_updated_at
  BEFORE UPDATE ON kanban_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to reorder positions after insert/delete/update
-- This ensures positions are sequential (1, 2, 3...) without gaps
CREATE OR REPLACE FUNCTION reorder_kanban_column_positions()
RETURNS TRIGGER AS $$
BEGIN
  -- Reorder all columns in the project
  WITH ordered_columns AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY position, created_at) as new_position
    FROM kanban_columns
    WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
  )
  UPDATE kanban_columns
  SET position = ordered_columns.new_position
  FROM ordered_columns
  WHERE kanban_columns.id = ordered_columns.id
    AND kanban_columns.position != ordered_columns.new_position;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION reorder_kanban_card_positions()
RETURNS TRIGGER AS $$
BEGIN
  -- Reorder all cards in the column
  WITH ordered_cards AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY position, created_at) as new_position
    FROM kanban_cards
    WHERE column_id = COALESCE(NEW.column_id, OLD.column_id)
  )
  UPDATE kanban_cards
  SET position = ordered_cards.new_position
  FROM ordered_cards
  WHERE kanban_cards.id = ordered_cards.id
    AND kanban_cards.position != ordered_cards.new_position;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers to maintain position order
CREATE TRIGGER maintain_kanban_column_positions
  AFTER INSERT OR DELETE ON kanban_columns
  FOR EACH ROW
  EXECUTE FUNCTION reorder_kanban_column_positions();

CREATE TRIGGER maintain_kanban_card_positions
  AFTER INSERT OR DELETE OR UPDATE OF column_id ON kanban_cards
  FOR EACH ROW
  EXECUTE FUNCTION reorder_kanban_card_positions();
