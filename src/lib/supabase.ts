import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  category: string;
  aspect_ratio: number;
  order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatar_url?: string;
  rating: number;
  event_type: string;
  is_featured: boolean;
  created_at: string;
}

export interface ContactFormData {
  nom: string;
  email: string;
  type_evenement: string;
  date?: string;
  message: string;
}

export interface SocialReview {
  id: string;
  platform: 'google' | 'instagram' | 'facebook' | 'other';
  author: string;
  content: string;
  rating?: number;
  profile_url?: string;
  posted_at: string;
  created_at: string;
}

export interface InstagramPost {
  id: string;
  image_url: string;
  post_url: string;
  caption?: string;
  posted_at: string;
  likes_count?: number;
  is_visible: boolean;
  order: number;
  created_at: string;
}

export interface AtelierImage {
  id: string;
  url: string;
  alt: string;
  section: 'workspace' | 'process' | 'behind_scenes' | 'seasonal_flowers';
  description?: string;
  order: number;
  is_visible: boolean;
  created_at: string;
}

export async function getGalleryImages(category?: string): Promise<GalleryImage[]> {
  let query = supabase
    .from('gallery_images')
    .select('*')
    .order('order', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }

  return data || [];
}

export async function getTestimonials(featured?: boolean): Promise<Testimonial[]> {
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (featured !== undefined) {
    query = query.eq('is_featured', featured);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return data || [];
}

export async function submitContactForm(formData: ContactFormData): Promise<boolean> {
  const { error } = await supabase
    .from('contact_form')
    .insert([formData]);

  if (error) {
    console.error('Error submitting contact form:', error);
    return false;
  }

  return true;
}

export async function getSocialReviews(platform?: string): Promise<SocialReview[]> {
  let query = supabase
    .from('social_reviews')
    .select('*')
    .order('posted_at', { ascending: false });

  if (platform) {
    query = query.eq('platform', platform);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching social reviews:', error);
    return [];
  }

  return data || [];
}

export async function getInstagramPosts(limit?: number): Promise<InstagramPost[]> {
  let query = supabase
    .from('instagram_posts')
    .select('*')
    .eq('is_visible', true)
    .order('order', { ascending: true })
    .order('posted_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }

  return data || [];
}

export async function getAtelierImages(section?: string): Promise<AtelierImage[]> {
  let query = supabase
    .from('atelier_images')
    .select('*')
    .eq('is_visible', true)
    .order('order', { ascending: true });

  if (section) {
    query = query.eq('section', section);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching atelier images:', error);
    return [];
  }

  return data || [];
}
