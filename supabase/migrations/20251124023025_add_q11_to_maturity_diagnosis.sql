/*
  # Add q11 column to maturity_diagnosis table

  1. Changes
    - Add `q11_cultura` column to maturity_diagnosis table
    - Column is integer, NOT NULL with default value 1
    - Column has CHECK constraint (1-5)

  2. Notes
    - Default value allows existing records to remain valid
    - After migration, default will be used for any existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'maturity_diagnosis' AND column_name = 'q11_cultura'
  ) THEN
    ALTER TABLE maturity_diagnosis
    ADD COLUMN q11_cultura integer NOT NULL DEFAULT 1 CHECK (q11_cultura BETWEEN 1 AND 5);
  END IF;
END $$;
