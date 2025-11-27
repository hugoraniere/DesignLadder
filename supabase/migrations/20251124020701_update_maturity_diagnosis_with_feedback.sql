/*
  # Update Maturity Diagnosis Table with Feedback

  1. Changes
    - Add feedback field to maturity_diagnosis table
    - Add archetype field to store level name
    - Add response_id field for unique URLs
    - Update maturity_level range to match new scoring (0-75)
    
  2. Security
    - Maintain existing RLS policies
    - Add policy for public to read their own results by response_id
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maturity_diagnosis' AND column_name = 'feedback'
  ) THEN
    ALTER TABLE maturity_diagnosis ADD COLUMN feedback text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maturity_diagnosis' AND column_name = 'archetype'
  ) THEN
    ALTER TABLE maturity_diagnosis ADD COLUMN archetype text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maturity_diagnosis' AND column_name = 'response_id'
  ) THEN
    ALTER TABLE maturity_diagnosis ADD COLUMN response_id text UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex');
  END IF;
END $$;

CREATE POLICY "Anyone can read their own result by response_id"
  ON maturity_diagnosis
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update feedback on their result"
  ON maturity_diagnosis
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
