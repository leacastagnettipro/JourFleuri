/*
  # Create Instagram Posts and Atelier Images Tables

  ## Summary
  This migration creates two new tables to support social media integration and behind-the-scenes content.

  ## New Tables

  ### instagram_posts
  Stores Instagram post information for display on the website
  - `id` (uuid, primary key) - Unique identifier
  - `image_url` (text) - URL of the Instagram image
  - `post_url` (text) - Direct link to the Instagram post
  - `caption` (text, nullable) - Post caption/description
  - `posted_at` (timestamptz) - When the post was published on Instagram
  - `likes_count` (integer, nullable) - Number of likes (optional)
  - `is_visible` (boolean) - Whether to display this post on the site
  - `order` (integer) - Display order
  - `created_at` (timestamptz) - Record creation timestamp

  ### atelier_images
  Stores images for the "Behind the Scenes" workshop page
  - `id` (uuid, primary key) - Unique identifier
  - `url` (text) - Image URL
  - `alt` (text) - Alt text for accessibility
  - `section` (text) - Which section of the page (workspace, process, behind_scenes, seasonal_flowers)
  - `description` (text, nullable) - Optional image description
  - `order` (integer) - Display order within section
  - `is_visible` (boolean) - Whether to display this image
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on both tables
  - Public read access for all visitors
  - No write access from client (managed via admin panel or API)
*/

-- Create instagram_posts table
CREATE TABLE IF NOT EXISTS instagram_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  post_url text NOT NULL,
  caption text,
  posted_at timestamptz NOT NULL DEFAULT now(),
  likes_count integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create atelier_images table
CREATE TABLE IF NOT EXISTS atelier_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  alt text NOT NULL,
  section text NOT NULL CHECK (section IN ('workspace', 'process', 'behind_scenes', 'seasonal_flowers')),
  description text,
  "order" integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE atelier_images ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view visible Instagram posts"
  ON instagram_posts
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Anyone can view visible atelier images"
  ON atelier_images
  FOR SELECT
  USING (is_visible = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_instagram_posts_order ON instagram_posts("order", posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_atelier_images_section ON atelier_images(section, "order");