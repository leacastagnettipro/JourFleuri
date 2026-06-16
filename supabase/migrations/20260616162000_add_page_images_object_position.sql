/*
  # Add framing controls on page images

  - Add object_position column to page_images
  - Add object_scale column to page_images
  - Backfill existing rows with center-center framing and default scale
*/

DO $$
BEGIN
  IF to_regclass('public.page_images') IS NOT NULL THEN
    ALTER TABLE page_images
      ADD COLUMN IF NOT EXISTS object_position text DEFAULT 'center center';
    ALTER TABLE page_images
      ADD COLUMN IF NOT EXISTS object_scale numeric DEFAULT 1;

    UPDATE page_images
    SET object_position = 'center center'
    WHERE object_position IS NULL;

    UPDATE page_images
    SET object_scale = 1
    WHERE object_scale IS NULL;
  END IF;
END $$;
