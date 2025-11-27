/*
  # Create Design Maturity Diagnosis Table

  1. New Tables
    - `maturity_diagnosis`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text, required)
      - `company` (text, optional)
      - `role` (text, required)
      - `q1_processos` (integer, 1-5)
      - `q2_rituais` (integer, 1-5)
      - `q3_colaboracao_pm_eng` (integer, 1-5)
      - `q4_handoff` (integer, 1-5)
      - `q5_design_system` (integer, 1-5)
      - `q6_documentacao` (integer, 1-5)
      - `q7_pesquisa` (integer, 1-5)
      - `q8_qualidade` (integer, 1-5)
      - `q9_carreira` (integer, 1-5)
      - `q10_percepcao` (integer, 1-5)
      - `total_score` (integer)
      - `percentage` (decimal)
      - `maturity_level` (integer, 1-5)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `maturity_diagnosis` table
    - Add policy for authenticated admin users to read all data
    - Add policy for anyone to insert (public form submission)

  3. Indexes
    - Index on email for faster lookups
    - Index on created_at for sorting
    - Index on maturity_level for analytics
*/

CREATE TABLE IF NOT EXISTS maturity_diagnosis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  company text,
  role text NOT NULL,
  q1_processos integer NOT NULL CHECK (q1_processos BETWEEN 1 AND 5),
  q2_rituais integer NOT NULL CHECK (q2_rituais BETWEEN 1 AND 5),
  q3_colaboracao_pm_eng integer NOT NULL CHECK (q3_colaboracao_pm_eng BETWEEN 1 AND 5),
  q4_handoff integer NOT NULL CHECK (q4_handoff BETWEEN 1 AND 5),
  q5_design_system integer NOT NULL CHECK (q5_design_system BETWEEN 1 AND 5),
  q6_documentacao integer NOT NULL CHECK (q6_documentacao BETWEEN 1 AND 5),
  q7_pesquisa integer NOT NULL CHECK (q7_pesquisa BETWEEN 1 AND 5),
  q8_qualidade integer NOT NULL CHECK (q8_qualidade BETWEEN 1 AND 5),
  q9_carreira integer NOT NULL CHECK (q9_carreira BETWEEN 1 AND 5),
  q10_percepcao integer NOT NULL CHECK (q10_percepcao BETWEEN 1 AND 5),
  total_score integer NOT NULL,
  percentage decimal(5, 4) NOT NULL CHECK (percentage BETWEEN 0 AND 1),
  maturity_level integer NOT NULL CHECK (maturity_level BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE maturity_diagnosis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit maturity diagnosis"
  ON maturity_diagnosis
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can view all diagnoses"
  ON maturity_diagnosis
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_maturity_diagnosis_email ON maturity_diagnosis(email);
CREATE INDEX IF NOT EXISTS idx_maturity_diagnosis_created_at ON maturity_diagnosis(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_maturity_diagnosis_level ON maturity_diagnosis(maturity_level);
