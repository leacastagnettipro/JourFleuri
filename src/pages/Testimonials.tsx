import { useEffect, useState } from 'react';
import {
  getTestimonials,
  getPageImagesForPage,
  type Testimonial,
  type PageImage,
} from '../lib/supabase';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import SocialReviews from '../components/SocialReviews';
import ScrollReveal from '../components/ScrollReveal';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [pageImages, setPageImages] = useState<Record<string, PageImage>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      const [data, images] = await Promise.all([
        getTestimonials(),
        getPageImagesForPage('testimonials'),
      ]);
      setTestimonials(data);
      const imageMap: Record<string, PageImage> = {};
      images.forEach((item) => {
        imageMap[item.section_key] = item;
      });
      setPageImages(imageMap);
      setLoading(false);
    }
    void loadTestimonials();
  }, []);

  const sideLeft = pageImages['testimonials_side_left'];
  const sideRight = pageImages['testimonials_side_right'];

  if (loading) {
    return (
      <div className="min-h-screen bg-jour-fleuri-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jour-fleuri-cream relative overflow-hidden">
      {sideLeft && (
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[18vw] min-w-[180px] max-w-[320px] overflow-hidden z-0">
          <img
            src={sideLeft.url}
            alt={sideLeft.alt || 'Création florale'}
            className="w-full h-full object-cover"
            style={{
              objectPosition: sideLeft.object_position || 'center center',
              transform: `scale(${sideLeft.object_scale || 1})`,
              transformOrigin: sideLeft.object_position || 'center center',
            }}
          />
        </div>
      )}
      {sideRight && (
        <div className="hidden lg:block absolute inset-y-0 right-0 w-[18vw] min-w-[180px] max-w-[320px] overflow-hidden z-0">
          <img
            src={sideRight.url}
            alt={sideRight.alt || 'Création florale'}
            className="w-full h-full object-cover"
            style={{
              objectPosition: sideRight.object_position || 'center center',
              transform: `scale(${sideRight.object_scale || 1})`,
              transformOrigin: sideRight.object_position || 'center center',
            }}
          />
        </div>
      )}

      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal variant="fade">
            <h1 className="font-serif text-5xl md:text-6xl text-jour-fleuri-coral text-center mb-8">
              <span className="font-accent text-jour-fleuri-jaune">Témoignages</span>
            </h1>
          </ScrollReveal>

          {testimonials.length > 0 ? (
            <ScrollReveal variant="slide-up" delay={0.2}>
              <div className="mb-16">
                <TestimonialsCarousel
                  testimonials={testimonials}
                  autoplay={true}
                  interval={6000}
                  itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
                  mode="page"
                />
              </div>
            </ScrollReveal>
          ) : (
            <p className="text-center text-gray-600 text-lg mb-16">
              Aucun témoignage pour le moment.
            </p>
          )}
        </div>
      </section>

      <div className="relative z-10">
        <SocialReviews />
      </div>
    </div>
  );
}
