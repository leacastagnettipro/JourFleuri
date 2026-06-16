/*
  # Add short description for services

  - Add short_description column to services
  - Backfill existing rows from description for immediate frontend use
*/

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS short_description text;

UPDATE services
SET short_description = description
WHERE short_description IS NULL;
