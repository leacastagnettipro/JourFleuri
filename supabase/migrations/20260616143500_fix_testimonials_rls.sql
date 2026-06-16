/*
  # Fix testimonials RLS policies

  Recreate testimonials policies to guarantee authenticated admin writes work.
*/

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only authenticated users can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only authenticated users can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Only authenticated users can delete testimonials" ON testimonials;

CREATE POLICY "Anyone can view testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated users can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (true);

