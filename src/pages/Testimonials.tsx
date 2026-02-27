import { useEffect, useState } from 'react';
import { getTestimonials, Testimonial } from '../lib/supabase';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import SocialReviews from '../components/SocialReviews';
import ScrollReveal from '../components/ScrollReveal';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackTestimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sophie',
      text: 'Un travail magnifique et sur mesure qui a sublimé notre mariage. Merci pour votre écoute et votre talent !',
      rating: 5,
      event_type: 'mariage',
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Marie',
      text: 'Des créations florales absolument splendides qui ont émerveillé tous nos invités. Un vrai savoir-faire.',
      rating: 5,
      event_type: 'mariage',
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Laurent',
      text: 'Professionnalisme et créativité au rendez-vous pour notre événement d\'entreprise. Je recommande vivement !',
      rating: 5,
      event_type: 'entreprise',
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Camille',
      text: 'Une fleuriste à l\'écoute qui a su parfaitement comprendre nos envies. Le résultat était au-delà de nos attentes.',
      rating: 5,
      event_type: 'bapteme',
      is_featured: false,
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      name: 'Julie',
      text: 'Des compositions délicates et poétiques qui ont apporté une touche magique à notre réception.',
      rating: 5,
      event_type: 'mariage',
      is_featured: false,
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      name: 'Thomas',
      text: 'Un grand merci pour ces magnifiques arrangements floraux. Tout était parfait du début à la fin.',
      rating: 5,
      event_type: 'anniversaire',
      is_featured: false,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    async function loadTestimonials() {
      const data = await getTestimonials();
      if (data.length > 0) {
        setTestimonials(data);
      } else {
        setTestimonials(fallbackTestimonials);
      }
      setLoading(false);
    }
    loadTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-jour-fleuri-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jour-fleuri-cream">
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal variant="fade">
            <h1 className="font-serif text-5xl md:text-6xl text-jour-fleuri-coral text-center mb-8">
              <span className="font-serif text-jour-fleuri-jaune text-6xl md:text-7xl">Témoignages</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal variant="slide-up" delay={0.2}>
            <div className="mb-16">
              <TestimonialsCarousel
                testimonials={testimonials}
                autoplay={true}
                interval={6000}
                itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SocialReviews />
    </div>
  );
}
