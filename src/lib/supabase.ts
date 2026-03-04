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
   is_visible: boolean;
   is_featured: boolean;
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
  lieu?: string;
  message: string;
}

export interface ContactFormEntry extends ContactFormData {
  id: string;
  status: 'nouveau' | 'lu' | 'traite';
  created_at: string;
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

export interface Service {
  id: string;
  title: string;
  description: string;
  cta_label: string;
  image_url?: string | null;
  color_variant?: string | null;
  order: number;
  is_visible: boolean;
  created_at: string;
}

export interface GalleryCategory {
  id: string;
  slug: string;
  label: string;
  order: number;
  created_at: string;
}

export interface PageContent {
  id: string;
  page: string;
  section_key: string;
  title: string | null;
  body: string | null;
  cta_label: string | null;
  cta_url: string | null;
  order: number;
  created_at: string;
}

export interface PageImage {
  id: string;
  page: string;
  section_key: string;
  url: string;
  alt: string | null;
  order: number;
  is_visible: boolean;
  created_at: string;
}

export async function getGalleryImages(category?: string): Promise<GalleryImage[]> {
  let query = supabase
    .from('gallery_images')
    .select('*')
    .eq('is_visible', true)
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

export async function getGalleryImagesForAdmin(category?: string): Promise<GalleryImage[]> {
  let query = supabase
    .from('gallery_images')
    .select('*')
    .order('order', { ascending: true });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching admin gallery images:', error);
    return [];
  }

  return data || [];
}

export async function getPageContentForPage(page: string): Promise<PageContent[]> {
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page', page)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching page content:', error);
    return [];
  }

  return data || [];
}

export async function getPageImagesForPage(page: string): Promise<PageImage[]> {
  const { data, error } = await supabase
    .from('page_images')
    .select('*')
    .eq('page', page)
    .eq('is_visible', true)
    .order('order', { ascending: true });

  if (error) {
    if ((error as any).code === 'PGRST205') {
      console.info('page_images table not found, returning empty list.');
      return [];
    }
    console.error('Error fetching page images:', error);
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
    if ((error as any).code === 'PGRST205') {
      console.info('testimonials table not found, returning empty list.');
      return [];
    }
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
    // Si la table n'existe pas encore (erreur 404 côté REST),
    // on ignore l'erreur pour ne pas bloquer le formulaire.
    if ((error as any).code === 'PGRST205') {
      console.info('contact_form table not found, skipping DB insert.');
      return true;
    }

    console.error('Error submitting contact form:', error);
    return false;
  }

  return true;
}

export async function getContactSubmissions(): Promise<ContactFormEntry[]> {
  const { data, error } = await supabase
    .from('contact_form')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact submissions:', error);
    return [];
  }

  return (data as ContactFormEntry[]) || [];
}

export async function updateContactStatus(
  id: string,
  status: ContactFormEntry['status']
): Promise<boolean> {
  const { error } = await supabase
    .from('contact_form')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating contact status:', error);
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
    if ((error as any).code === 'PGRST205') {
      console.info('social_reviews table not found, returning empty list.');
      return [];
    }
    console.error('Error fetching social reviews:', error);
    return [];
  }

  return data || [];
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    if ((error as any).code === 'PGRST205') {
      console.info('testimonials table not found, returning empty list.');
      return [];
    }
    console.error('Error fetching all testimonials:', error);
    return [];
  }

  return data || [];
}

export async function createTestimonial(
  payload: Omit<Testimonial, 'id' | 'created_at'>
): Promise<boolean> {
  const { error } = await supabase.from('testimonials').insert([payload]);

  if (error) {
    console.error('Error creating testimonial:', error);
    return false;
  }

  return true;
}

export async function updateTestimonial(
  id: string,
  updates: Partial<Omit<Testimonial, 'id' | 'created_at'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating testimonial:', error);
    return false;
  }

  return true;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }

  return true;
}

export async function getAllSocialReviews(): Promise<SocialReview[]> {
  const { data, error } = await supabase
    .from('social_reviews')
    .select('*')
    .order('posted_at', { ascending: false });

  if (error) {
    if ((error as any).code === 'PGRST205') {
      console.info('social_reviews table not found, returning empty list.');
      return [];
    }
    console.error('Error fetching all social reviews:', error);
    return [];
  }

  return data || [];
}

export async function createSocialReview(
  payload: Omit<SocialReview, 'id' | 'created_at'>
): Promise<boolean> {
  const { error } = await supabase.from('social_reviews').insert([payload]);

  if (error) {
    console.error('Error creating social review:', error);
    return false;
  }

  return true;
}

export async function updateSocialReview(
  id: string,
  updates: Partial<Omit<SocialReview, 'id' | 'created_at'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('social_reviews')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating social review:', error);
    return false;
  }

  return true;
}

export async function deleteSocialReview(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('social_reviews')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting social review:', error);
    return false;
  }

  return true;
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
    if ((error as any).code === 'PGRST205') {
      console.info('instagram_posts table not found, returning empty list.');
      return [];
    }
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

export async function upsertPageImageFile(
  file: File,
  page: string,
  sectionKey: string,
  alt: string
): Promise<boolean> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${page}/${sectionKey}/${crypto.randomUUID()}.${fileExt}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('page-images')
      .upload(fileName, file);

    if (storageError || !storageData?.path) {
      console.error('Error uploading page image to storage:', storageError);
      return false;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('page-images').getPublicUrl(storageData.path);

    const { error: dbError } = await supabase.from('page_images').upsert(
      [
        {
          page,
          section_key: sectionKey,
          url: publicUrl,
          alt,
          is_visible: true,
        },
      ],
      {
        onConflict: 'page,section_key',
      }
    );

    if (dbError) {
      console.error('Error upserting page image record:', dbError);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Unexpected error upserting page image:', e);
    return false;
  }
}

export async function updatePageImageMeta(
  id: string,
  updates: Partial<Pick<PageImage, 'alt' | 'is_visible' | 'order'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('page_images')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating page image:', error);
    return false;
  }

  return true;
}

export async function deletePageImage(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('page_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting page image:', error);
    return false;
  }

  return true;
}

export async function uploadServiceImage(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `services/${crypto.randomUUID()}.${fileExt}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from('page-images')
      .upload(fileName, file);

    if (storageError || !storageData?.path) {
      console.error('Error uploading service image to storage:', storageError);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('page-images').getPublicUrl(storageData.path);

    return publicUrl;
  } catch (e) {
    console.error('Unexpected error uploading service image:', e);
    return null;
  }
}

export async function getVisibleServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_visible', true)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data || [];
}

export async function getAllServicesForAdmin(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching admin services:', error);
    return [];
  }

  return data || [];
}

export async function createService(payload: Omit<Service, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await supabase.from('services').insert([payload]);

  if (error) {
    console.error('Error creating service:', error);
    return false;
  }

  return true;
}

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  const { data, error } = await supabase
    .from('gallery_categories')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching gallery categories:', error);
    return [];
  }

  return data || [];
}

export async function createGalleryCategory(
  payload: Omit<GalleryCategory, 'id' | 'created_at'>
): Promise<boolean> {
  const { error } = await supabase.from('gallery_categories').insert([payload]);

  if (error) {
    console.error('Error creating gallery category:', error);
    return false;
  }

  return true;
}

export async function upsertPageContentItem(
  page: string,
  sectionKey: string,
  payload: Partial<Omit<PageContent, 'id' | 'page' | 'section_key' | 'created_at'>>
): Promise<boolean> {
  const { error } = await supabase.from('page_content').upsert(
    [
      {
        page,
        section_key: sectionKey,
        ...payload,
      },
    ],
    {
      onConflict: 'page,section_key',
    }
  );

  if (error) {
    console.error('Error upserting page content:', error);
    return false;
  }

  return true;
}

export async function updateGalleryCategory(
  id: string,
  updates: Partial<Omit<GalleryCategory, 'id' | 'created_at'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('gallery_categories')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating gallery category:', error);
    return false;
  }

  return true;
}

export async function deleteGalleryCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('gallery_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting gallery category:', error);
    return false;
  }

  return true;
}

export async function createGalleryImage(
  file: File,
  categorySlug: string,
  alt: string
): Promise<boolean> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${categorySlug}/${fileName}`;

    const { error: storageError, data: storageData } = await supabase.storage
      .from('gallery')
      .upload(filePath, file);

    if (storageError || !storageData?.path) {
      console.error('Error uploading image to storage:', storageError);
      return false;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('gallery').getPublicUrl(storageData.path);

    const { error: dbError } = await supabase.from('gallery_images').insert([
      {
        url: publicUrl,
        alt,
        category: categorySlug,
      },
    ]);

    if (dbError) {
      console.error('Error creating gallery image record:', dbError);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Unexpected error creating gallery image:', e);
    return false;
  }
}

export async function updateGalleryImage(
  id: string,
  updates: Partial<Omit<GalleryImage, 'id' | 'created_at'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('gallery_images')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating gallery image:', error);
    return false;
  }

  return true;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting gallery image:', error);
    return false;
  }

  return true;
}

export async function reorderGalleryImages(orderedIds: string[]): Promise<boolean> {
  try {
    const updates = orderedIds.map((id, index) => ({
      id,
      order: index,
    }));

    const promises = updates.map((item) =>
      supabase
        .from('gallery_images')
        .update({ order: item.order })
        .eq('id', item.id)
    );

    const results = await Promise.all(promises);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      console.error('Error reordering gallery images:', results);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Unexpected error reordering gallery images:', e);
    return false;
  }
}

export async function updateService(
  id: string,
  updates: Partial<Omit<Service, 'id' | 'created_at'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating service:', error);
    return false;
  }

  return true;
}

export async function deleteService(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    return false;
  }

  return true;
}

export async function reorderServices(orderedIds: string[]): Promise<boolean> {
  try {
    const updates = orderedIds.map((id, index) => ({
      id,
      order: index,
    }));

    const promises = updates.map((item) =>
      supabase
        .from('services')
        .update({ order: item.order })
        .eq('id', item.id)
    );

    const results = await Promise.all(promises);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      console.error('Error reordering services:', results);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Unexpected error reordering services:', e);
    return false;
  }
}
