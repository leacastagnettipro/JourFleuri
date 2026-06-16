/*
  # Align gallery schema with application code

  - Add is_visible and is_featured columns to gallery_images
  - Create gallery_categories table with default seed data
*/

-- Add missing columns to gallery_images
ALTER TABLE gallery_images
  ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

UPDATE gallery_images SET is_visible = true WHERE is_visible IS NULL;
UPDATE gallery_images SET is_featured = false WHERE is_featured IS NULL;

-- Create gallery_categories table
CREATE TABLE IF NOT EXISTS gallery_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery categories"
  ON gallery_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated users can insert gallery categories"
  ON gallery_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update gallery categories"
  ON gallery_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete gallery categories"
  ON gallery_categories FOR DELETE
  TO authenticated
  USING (true);

-- Seed default categories (skip if slug already exists)
INSERT INTO gallery_categories (slug, label, "order")
VALUES
  ('mariages', 'Mariages', 0),
  ('compositions', 'Compositions', 1),
  ('tables', 'Décors de table', 2),
  ('bouquets', 'Bouquets', 3)
ON CONFLICT (slug) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_gallery_categories_order ON gallery_categories("order");
