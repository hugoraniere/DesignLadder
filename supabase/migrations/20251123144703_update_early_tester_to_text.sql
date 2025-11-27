/*
  # Update early_tester column type

  1. Changes
    - Alter `early_tester` column in `responses` table from boolean to text
    - This allows storing 'yes' or 'no' values instead of true/false
    - Handles existing data by converting boolean values to text equivalents

  2. Notes
    - Existing true values will be converted to 'yes'
    - Existing false values will be converted to 'no'
    - Column will accept text values going forward
*/

-- Alter the column type from boolean to text
ALTER TABLE responses 
ALTER COLUMN early_tester TYPE text 
USING CASE 
  WHEN early_tester = true THEN 'yes'
  WHEN early_tester = false THEN 'no'
  ELSE ''
END;

-- Remove the default value since we want to enforce selection
ALTER TABLE responses 
ALTER COLUMN early_tester DROP DEFAULT;

-- Set NOT NULL constraint
ALTER TABLE responses 
ALTER COLUMN early_tester SET NOT NULL;
