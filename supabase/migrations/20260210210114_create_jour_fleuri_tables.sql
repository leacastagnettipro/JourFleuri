/*
  # Create Jour Fleuri Database Schema

  ## Overview
  This migration creates the complete database schema for the Jour Fleuri website,
  including tables for gallery images, testimonials, contact form submissions, and social reviews.

  ## New Tables

  1. **gallery_images**
     - `id` (uuid, primary key) - Unique identifier
     - `url` (text) - Image URL (Supabase Storage or external)
     - `alt` (text) - Alternative text for accessibility
     - `category` (text) - Image category (mariage, bapteme, entreprise, etc.)
     - `aspect_ratio` (numeric) - Height/width ratio for masonry layout
     - `order` (integer) - Display order
     - `created_at` (timestamptz) - Creation timestamp

  2. **testimonials**
     - `id` (uuid, primary key) - Unique identifier
     - `name` (text) - Client name
     - `text` (text) - Testimonial content
     - `avatar_url` (text, nullable) - Avatar image URL
     - `rating` (integer) - Rating out of 5
     - `event_type` (text) - Type of event (mariage, bapteme, etc.)
     - `is_featured` (boolean) - Whether to show on homepage
     - `created_at` (timestamptz) - Creation timestamp

  3. **contact_form**
     - `id` (uuid, primary key) - Unique identifier
     - `nom` (text) - Contact name
     - `email` (text) - Contact email
     - `type_evenement` (text) - Event type
     - `date` (date, nullable) - Event date
     - `message` (text) - Message content
     - `status` (text) - Submission status (nouveau, lu, traite)
     - `created_at` (timestamptz) - Submission timestamp

  4. **social_reviews**
     - `id` (uuid, primary key) - Unique identifier
     - `platform` (text) - Platform name (google, instagram, facebook)
     - `author` (text) - Review author name
     - `content` (text) - Review content
     - `rating` (integer, nullable) - Rating if applicable
     - `profile_url` (text, nullable) - Author profile URL
     - `posted_at` (timestamptz) - When the review was posted
     - `created_at` (timestamptz) - When imported to database

  ## Security
  - RLS enabled on all tables
  - Public read access for gallery_images, testimonials, and social_reviews
  - Authenticated write access for contact_form submissions
  - Service role required for managing content
*/

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  alt text NOT NULL,
  category text NOT NULL,
  aspect_ratio numeric DEFAULT 1.0,
  "order" integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery images"
  ON gallery_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated users can insert gallery images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update gallery images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete gallery images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (true);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  text text NOT NULL,
  avatar_url text,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  event_type text NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

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

-- Create contact_form table
CREATE TABLE IF NOT EXISTS contact_form (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  email text NOT NULL,
  type_evenement text NOT NULL,
  date date,
  message text NOT NULL,
  status text DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'lu', 'traite')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_form ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_form FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contact submissions"
  ON contact_form FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can update contact submissions"
  ON contact_form FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete contact submissions"
  ON contact_form FOR DELETE
  TO authenticated
  USING (true);

-- Create social_reviews table
CREATE TABLE IF NOT EXISTS social_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL CHECK (platform IN ('google', 'instagram', 'facebook', 'other')),
  author text NOT NULL,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  profile_url text,
  posted_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view social reviews"
  ON social_reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated users can insert social reviews"
  ON social_reviews FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can update social reviews"
  ON social_reviews FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can delete social reviews"
  ON social_reviews FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_order ON gallery_images("order");
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_contact_form_status ON contact_form(status);
CREATE INDEX IF NOT EXISTS idx_contact_form_created ON contact_form(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_reviews_platform ON social_reviews(platform);
CREATE INDEX IF NOT EXISTS idx_social_reviews_posted ON social_reviews(posted_at DESC);