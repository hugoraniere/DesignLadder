/*
  # Add designer support to design stories

  1. Changes
    - Add `designer_id` column to `design_stories` table (references auth.users)
    - Add `designer_name` column for display purposes
    - Add `designer_avatar_url` column for avatar display
    - Add index on designer_id for efficient filtering
  
  2. Notes
    - designer_id is nullable to support existing stories
    - designer_name and avatar can be cached for better performance
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'design_stories' AND column_name = 'designer_id'
  ) THEN
    ALTER TABLE design_stories ADD COLUMN designer_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'design_stories' AND column_name = 'designer_name'
  ) THEN
    ALTER TABLE design_stories ADD COLUMN designer_name text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'design_stories' AND column_name = 'designer_avatar_url'
  ) THEN
    ALTER TABLE design_stories ADD COLUMN designer_avatar_url text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_design_stories_designer_id ON design_stories(designer_id);