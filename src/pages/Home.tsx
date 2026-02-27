import { Link } from 'react-router-dom';
import { Heart, Users, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGalleryImages, getTestimonials } from '../lib/supabase';
import CarouselGallery from '../components/CarouselGallery';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import ScrollReveal from '../components/ScrollReveal';
import ParallaxSection from '../components/ParallaxSection';
import InstagramFeed from '../components/InstagramFeed';

export default function Home() {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  const fallbackGalleryImages = [
    { url: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Bouquet rose et pêche' },
    { url: 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Bouquet champêtre coloré' },
    { url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Arche florale mariage' },
    { url: 'https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Table fleurie élégante' },
    { url: 'https://images.pexels.com/photos/2306285/pexels-photo-2306285.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Décor floral bohème' },
    { url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Bouquet moderne corail' },
    { url: 'https://images.pexels.com/photos/1476039/pexels-photo-1476039.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Composition florale jaune' },
    { url: 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Bouquet de pivoines roses' },
  ];

  const fallbackTestimonials = [
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
    }
  ];

  useEffect(() => {
    async function loadData() {
      const images = await getGalleryImages();
      const testimonialData = await getTestimonials(true);

      if (images.length > 0) {
        setGalleryImages(images.slice(0, 5).map(img => ({ url: img.url, alt: img.alt })));
      } else {
        setGalleryImages(fallbackGalleryImages);
      }

      if (testimonialData.length > 0) {
        setTestimonials(testimonialData);
      } else {
        setTestimonials(fallbackTestimonials);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-jour-fleuri-coral">
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-12"
          >
            <img
              src="/LOGO_JAUNE_CLAIR.svg"
              alt="Jour Fleuri"
              className="h-48 md:h-64 lg:h-80 mx-auto mb-6 drop-shadow-2xl"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-2xl md:text-3xl text-jour-fleuri-cream mb-12 font-light drop-shadow-lg"
          >
            Délicatesse champêtre et <span className="font-serif text-jour-fleuri-jaune text-4xl md:text-5xl">colorée</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Link
              to="/contact"
              className="inline-block bg-jour-fleuri-jaune text-white hover:bg-jour-fleuri-cream hover:text-jour-fleuri-coral px-10 py-5 rounded-full text-xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110"
            >
              Demander un devis
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-jour-fleuri-cream relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal variant="fade">
            <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed font-light">
              Jour Fleuri imagine des <span className="text-jour-fleuri-coral font-serif font-semibold text-4xl">créations florales</span> délicates et colorées pour sublimer vos événements,
              en privilégiant les <span className="text-jour-fleuri-jaune font-serif text-4xl">fleurs de saison</span> et une approche <span className="text-jour-fleuri-orange font-serif text-4xl">responsable</span>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 px-4 bg-jour-fleuri-rose-pale relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal variant="fade">
            <h2 className="font-serif text-5xl md:text-6xl text-jour-fleuri-coral text-center mb-20">
              Nos univers floraux
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Heart, title: 'Mariages', desc: 'Des créations sur mesure pour sublimer votre jour J', bgColor: 'bg-jour-fleuri-cream', iconColor: 'bg-jour-fleuri-coral', delay: 0 },
              { icon: Users, title: 'Événements privés', desc: 'Anniversaires, baptêmes et célébrations familiales', bgColor: 'bg-jour-fleuri-jaune-pale', iconColor: 'bg-jour-fleuri-jaune', delay: 0.15 },
              { icon: Briefcase, title: 'Événements professionnels', desc: 'Scénographies florales pour vos événements d\'entreprise', bgColor: 'bg-jour-fleuri-cream', iconColor: 'bg-jour-fleuri-coral', delay: 0.3 }
            ].map((item, index) => (
              <ScrollReveal key={index} variant="slide-up" delay={item.delay}>
                <motion.div
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`${item.bgColor} rounded-3xl p-10 text-center shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group`}
                >
                  <motion.div
                    className="flex justify-center mb-8 relative z-10"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className={`p-6 rounded-full ${item.iconColor}`}>
                      <item.icon className="w-14 h-14 text-white" />
                    </div>
                  </motion.div>
                  <h3 className="font-serif text-4xl mb-6 text-gray-800 relative z-10">{item.title}</h3>
                  <p className="text-gray-700 text-lg leading-relaxed relative z-10">{item.desc}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-jour-fleuri-jaune-pale relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal variant="fade">
            <h2 className="font-serif text-5xl md:text-6xl text-jour-fleuri-coral text-center mb-8">
              Nos créations <span className="font-serif text-jour-fleuri-jaune text-6xl md:text-7xl">fleuries</span>
            </h2>
          </ScrollReveal>

          {galleryImages.length > 0 && (
            <ScrollReveal variant="slide-up" delay={0.2}>
              <div className="mb-12 px-4">
                <CarouselGallery images={galleryImages} autoplay={true} interval={5000} />
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal variant="fade" delay={0.4}>
            <div className="text-center">
              <Link
                to="/galerie"
                className="inline-block bg-jour-fleuri-coral hover:bg-jour-fleuri-coral-clair text-white px-10 py-4 rounded-full text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110"
              >
                Découvrir toute la galerie
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 px-4 bg-jour-fleuri-rose-poudre-pale relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal variant="fade">
            <h2 className="font-serif text-5xl md:text-6xl text-jour-fleuri-rose-poudre text-center mb-20">
              Ils nous font confiance
            </h2>
          </ScrollReveal>

          {testimonials.length > 0 && (
            <ScrollReveal variant="slide-up" delay={0.2}>
              <TestimonialsCarousel
                testimonials={testimonials}
                autoplay={true}
                interval={6000}
                itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
              />
            </ScrollReveal>
          )}
        </div>
      </section>

      <InstagramFeed limit={6} showTitle={true} />

      <section className="py-24 px-4 bg-jour-fleuri-coral text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <ScrollReveal variant="fade">
            <h2 className="font-serif text-5xl md:text-6xl text-jour-fleuri-cream mb-6 drop-shadow-lg">
              Parlons de votre <span className="font-serif text-jour-fleuri-jaune text-6xl md:text-7xl">projet floral</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="slide-up" delay={0.2}>
            <Link
              to="/contact"
              className="inline-block bg-jour-fleuri-jaune text-white hover:bg-jour-fleuri-cream hover:text-jour-fleuri-coral px-12 py-5 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110"
            >
              Demander un devis gratuit
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
