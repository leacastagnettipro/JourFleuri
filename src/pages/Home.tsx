import { Link } from 'react-router-dom';
import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  getGalleryImages,
  getTestimonials,
  getVisibleServices,
  getPageContentForPage,
  getPageImagesForPage,
  type PageContent,
  type PageImage,
  type Service,
  type Testimonial,
} from '../lib/supabase';
import CarouselGallery from '../components/CarouselGallery';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import ScrollReveal from '../components/ScrollReveal';

const InstagramFeed = lazy(() => import('../components/InstagramFeed'));

export default function Home() {
  const [galleryImages, setGalleryImages] = useState<{ url: string; alt: string }[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [texts, setTexts] = useState<Record<string, PageContent>>({});
  const [pageImages, setPageImages] = useState<Record<string, PageImage>>({});
  const [loaded, setLoaded] = useState(false);
  const [showInstagram, setShowInstagram] = useState(false);
  const instagramRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadData() {
      const [images, testimonialData, servicesData, content, heroImages] = await Promise.all([
        getGalleryImages(),
        getTestimonials(true),
        getVisibleServices(),
        getPageContentForPage('home'),
        getPageImagesForPage('home'),
      ]);

      setGalleryImages(images.slice(0, 5).map((img) => ({ url: img.url, alt: img.alt })));
      setTestimonials(testimonialData);
      setServices(servicesData);

      const map: Record<string, PageContent> = {};
      content.forEach((item) => {
        map[item.section_key] = item;
      });
      setTexts(map);

      const imageMap: Record<string, PageImage> = {};
      heroImages.forEach((img) => {
        imageMap[img.section_key] = img;
      });
      setPageImages(imageMap);
      setLoaded(true);
    }
    void loadData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setShowInstagram(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (instagramRef.current) {
      observer.observe(instagramRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const homeIntro =
    texts['home_intro']?.body ??
    'Jour Fleuri imagine des créations florales délicates et colorées pour sublimer vos événements, en privilégiant les fleurs de saison et une approche responsable.';

  const heroLeft = pageImages['home_hero_left'];
  const heroRight = pageImages['home_hero_right'];
  const universTopBandeau = pageImages['home_univers_top_bandeau'];
  const universBandeau = pageImages['home_univers_bandeau'];
  const ctaBackground = pageImages['home_cta_background'];

  if (!loaded) {
    return (
      <div className="min-h-screen bg-jour-fleuri-coral flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-jour-fleuri-cream border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-jour-fleuri-coral">
        {heroLeft && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden lg:block absolute inset-y-0 left-0 w-[20vw] min-w-[210px] max-w-[360px] overflow-hidden"
          >
            <img
              src={heroLeft.url}
              alt={heroLeft.alt || 'Création florale'}
              className="w-full h-full object-cover"
              style={{
                objectPosition: heroLeft.object_position || 'center center',
                transform: `scale(${heroLeft.object_scale || 1})`,
                transformOrigin: heroLeft.object_position || 'center center',
              }}
            />
          </motion.div>
        )}

        {heroRight && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden lg:block absolute inset-y-0 right-0 w-[20vw] min-w-[210px] max-w-[360px] overflow-hidden"
          >
            <img
              src={heroRight.url}
              alt={heroRight.alt || 'Création florale'}
              className="w-full h-full object-cover"
              style={{
                objectPosition: heroRight.object_position || 'center center',
                transform: `scale(${heroRight.object_scale || 1})`,
                transformOrigin: heroRight.object_position || 'center center',
              }}
            />
          </motion.div>
        )}

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 lg:px-8 py-10 md:py-0">
          <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="mb-8 lg:mb-12"
              >
                <svg
                  className="h-32 sm:h-40 md:h-56 lg:h-72 mx-auto mb-6 drop-shadow-2xl"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 965 580"
                  aria-label="Jour Fleuri"
                  role="img"
                >
                  <defs>
                    <style>
                      {`.cls-1 { fill: #ffe6c5; }`}
                    </style>
                  </defs>
                  <path
                    className="cls-1"
                    d="M396.02,358.4v12.03h-5.38v2.05h5.38v125.99h17.93v-125.99h20.23v-2.05h-20.23v-12.03c0-17.58,2.56-30.26,7.68-38.03,5.12-7.77,13.57-11.73,25.35-11.91v-2.05c-17.93.17-30.9,4.23-38.92,12.16-8.03,7.94-12.04,21.21-12.04,39.82Z"
                  />
                  <path
                    className="cls-1"
                    d="M476.68,495.91c-2.05-.18-4.05-1.58-6.01-4.23-1.98-2.65-2.96-6.43-2.96-11.4v-176.1c-6.63-2.05-11.6-5.05-14.69-8.97-1.22-1.47-2.29-3.03-3.23-4.7v191.57c0,1.36.42,2.89,1.27,4.61,3.94,7.86,13.4,11.77,28.42,11.77h7.95v-2.05h-7.95l-2.8-.51Z"
                  />
                  <path
                    className="cls-1"
                    d="M581.42,381.96c-9.56-8.36-21.34-12.55-35.34-12.55-17.41,0-31.75,5.89-43.02,17.67-11.27,11.78-16.9,28.34-16.9,49.68s5.38,37.13,16.13,47.37c10.75,10.24,24.71,15.36,41.87,15.36s32.56-2.65,46.22-7.94l-.77-1.79c-13.32,5.12-28.51,7.68-45.58,7.68-12.12,0-21.9-4.95-29.32-14.85-7.43-9.9-11.14-25.43-11.14-46.61,0-4.95.26-9.73.77-14.34h91.42v-2.56c0-16.39-4.78-28.76-14.34-37.13ZM504.59,419.6c2.05-15.02,6.87-26.8,14.47-35.34,7.59-8.53,16.26-12.8,25.99-12.8s17.67,3.93,23.82,11.78c6.14,7.86,9.3,19.97,9.47,36.36h-73.75Z"
                  />
                  <path
                    className="cls-1"
                    d="M717.39,495.91c-2.05-.17-4.06-1.58-6.02-4.23-1.96-2.65-2.95-6.44-2.95-11.4v-109.86h-17.93v91.93c-.68,7-5.25,14.6-13.7,22.79s-18.05,12.29-28.81,12.29c-5.29,0-9.65-.85-13.06-2.56-7.17-3.75-10.75-12.37-10.75-25.86v-98.59h-17.93v98.33c0,8.37,2.22,15.2,6.66,20.49,2.56,3.25,6.79,5.76,12.68,7.56,5.89,1.79,13.48,2.69,22.79,2.69s17.88-3.2,25.74-9.6c7.85-6.4,13.32-13.27,16.39-20.61v11.01l.26,4.35c.17,3.07,2.09,6.14,5.76,9.22,3.67,3.07,9,4.61,16,4.61h15.62v-2.05h-7.94l-2.81-.51Z"
                  />
                  <path
                    className="cls-1"
                    d="M793.95,369.41h-1.02c-9.73.34-18.44,4.91-26.12,13.7-7.68,8.79-12.89,18.14-15.62,28.04v-40.72h-17.93v128.04h17.93v-77.59c.34-8.19,3.67-16.94,9.99-26.25,6.31-9.3,13.32-15.49,21-18.57v5.38c0,3.42,1.11,6.23,3.33,8.45,2.21,2.22,5.03,3.33,8.45,3.33s6.28-1.11,8.58-3.33c2.31-2.22,3.46-5.03,3.46-8.45s-1.15-6.27-3.46-8.58c-2.3-2.31-5.16-3.46-8.58-3.46Z"
                  />
                  <path
                    className="cls-1"
                    d="M851.31,496.42l-3.07-.51c-1.88-.17-3.8-1.58-5.76-4.23-1.96-2.65-2.95-6.44-2.95-11.4v-109.86h-17.93v109.86l.26,4.35c.17,3.07,2.09,6.14,5.76,9.22,3.67,3.07,9,4.61,16,4.61h15.62v-2.05h-7.94Z"
                  />
                  <path
                    className="cls-1"
                    d="M830.83,344.83c3.07,0,5.68-1.02,7.81-3.07,2.13-2.05,3.2-4.61,3.2-7.68s-1.07-5.68-3.2-7.81c-2.14-2.13-4.74-3.2-7.81-3.2s-5.63,1.07-7.68,3.2c-2.05,2.14-3.07,4.74-3.07,7.81s1.02,5.63,3.07,7.68c2.05,2.05,4.61,3.07,7.68,3.07Z"
                  />
                  <path
                    className="cls-1"
                    d="M437.02,235.3c0-21.32-5.63-37.12-16.92-47.36-5.79-5.27-12.49-9.17-20.08-11.73,6.3-4.94,26.02-18.79,40.71-11.08,1.94,1.02,3.74,2.36,5.39,4.03,1.34,1.36,2.56,2.96,3.69,4.76v98.02c0,8.35,2.23,15.18,6.65,20.48,2.34,2.98,6.1,5.34,11.24,7.06.47.18.96.33,1.45.49,5.88,1.8,13.47,2.69,22.79,2.69s17.87-3.2,25.73-9.59c7.86-6.41,13.31-13.27,16.38-20.61v10.99l.27,4.36c.16,3.07,2.09,6.14,5.76,9.21,3.65,3.07,8.99,4.61,16,4.61h15.6v-2.05h-7.92l-2.83-.51c-2.05-.16-4.05-1.58-6.01-4.23-1.96-2.63-2.94-6.43-2.94-11.4v-109.84h-17.94v91.92c-.69,7.01-5.25,14.6-13.69,22.79-8.46,8.19-18.05,12.29-28.82,12.29-5.3,0-9.64-.85-13.04-2.56-7.19-3.74-10.77-12.38-10.77-25.86v-98.58h-15.8c-.96-1.65-2-3.14-3.14-4.45-2.09-2.49-4.47-4.43-7.12-5.81-16.78-8.79-39.04,7.52-44.36,11.89-.04.02-.07.07-.11.09h-.02v.02c-.13.11-.29.22-.45.36-1.02.82-2.18,1.69-2.87,2.2-.09.09-.2.16-.27.22h-.02c-.09.07-.16.11-.2.16-.2.16-.4.29-.62.45-1.11.78-33.72,27.11-59.52,40.62,1.96-10.97,5.65-20.12,11.08-27.44,8.52-11.53,19.27-17.27,32.27-17.27,5.14,0,9.86.78,14.18,2.36l3.43-2.43c-5.56-1.31-11.55-1.98-18.01-1.98-18.01,0-32.85,5.88-44.56,17.65-9.15,9.24-14.71,21.37-16.69,36.44-2.63.56-4.96.69-6.9.31,10.22-21.28,18.83-45.52,25.84-72.76,2.76-11.06,5.48-20.21,8.15-27.44,2.65-7.23,5.41-13.09,8.28-17.54,2.89-4.47,6.01-7.88,9.41-10.22,3.41-2.34,7.34-4.14,11.82-5.43.65-.42,1.69-1.22,3.18-2.38,1.49-1.18,2.83-2.45,3.98-3.83,1.18-1.38,2.03-2.72,2.56-3.98.53-1.29.27-2.25-.8-2.89-16.58,0-32.58,3.21-48.01,9.59-15.42,6.37-29,14.78-40.69,25.2-11.71,10.44-21.06,22.12-28.09,35.1-7.01,12.98-10.53,26.06-10.53,39.26s3.52,22.92,10.53,30.47c7.03,7.55,16.07,11.53,27.13,11.95-8.1,18.72-16.76,34.68-26.02,47.88-9.26,13.18-19.1,23.93-29.51,32.23-10.42,8.3-21.43,14.36-33.03,18.18-11.6,3.83-23.66,5.74-36.21,5.74-14.04,0-24.68-3.29-31.89-9.88-7.26-6.61-10.86-16.38-10.86-29.36,0-15.34,6.39-29.05,19.14-41.18,12.78-12.13,32.03-20.63,57.76-25.53,1.07-.42,1.6-1.05,1.6-1.91s-.53-1.27-1.6-1.27c-15.96,2.76-29.82,7.08-41.64,12.93-11.8,5.85-21.63,12.38-29.51,19.61-7.88,7.23-13.71,14.89-17.54,22.97-3.83,8.1-5.74,15.76-5.74,22.99,0,13.4,4.18,23.35,12.6,29.82,8.39,6.5,20.68,9.73,36.86,9.73,14.02,0,28.07-2.27,42.11-6.86,14.04-4.56,27.55-11.6,40.53-21.06,12.98-9.46,25.26-21.39,36.86-35.75,11.6-14.36,22.17-31.32,31.74-50.88,2.65-.22,5.41-.71,8.21-1.4-.38,3.45-.56,7.06-.56,10.82,0,21.34,5.63,37.15,16.89,47.39,11.28,10.24,25.91,15.36,43.94,15.36s32.85-5.88,44.56-17.67c11.69-11.77,17.54-28.33,17.54-49.68ZM292.08,228.89c-10.84-.65-19.36-4.47-25.53-11.48-6.17-7.03-9.26-16.69-9.26-29.05,0-9.99,2.45-20.1,7.34-30.31,4.9-10.22,11.82-19.61,20.74-28.24,8.93-8.61,19.56-16,31.92-22.17,12.33-6.17,25.84-10.1,40.51-11.8-8.72,4.9-17,12.44-24.88,22.66-7.88,10.19-14.16,24.46-18.83,42.76-6.81,25.73-14.13,48.28-22.01,67.64ZM374.52,300.61c-12.98,0-23.37-4.94-31.23-14.85-7.86-9.9-11.77-25.13-11.77-45.72,0-6.28.4-12.11,1.2-17.54,28.76-13.42,57.82-38.75,59.25-39.88,1.47-1.16,2.98-2.25,4.27-3.16,4.34,2.4,8.19,5.74,11.57,10.02,7.86,9.9,11.77,25.13,11.77,45.72s-4.25,36.61-12.8,48.14c-8.55,11.51-19.3,17.27-32.27,17.27Z"
                  />
                  <path
                    className="cls-1"
                    d="M625.74,179.23v5.38c0,3.42,1.11,6.23,3.33,8.45,2.21,2.22,5.03,3.33,8.45,3.33s6.28-1.11,8.58-3.33c2.3-2.22,3.46-5.03,3.46-8.45s-1.15-6.27-3.46-8.58-5.17-3.46-8.58-3.46h-1.02c-9.73.34-18.44,4.91-26.12,13.7-7.68,8.79-12.89,18.14-15.62,28.04v-40.72h-17.93v128.04h17.93v-77.59c.34-8.19,3.67-16.94,9.99-26.25,6.32-9.3,13.32-15.49,21-18.57Z"
                  />
                </svg>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-xl sm:text-2xl md:text-3xl text-jour-fleuri-cream mb-10 md:mb-12 font-light drop-shadow-lg leading-relaxed"
              >
                Délicatesse champêtre et{' '}
                <span className="font-accent text-jour-fleuri-jaune">colorée</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="mb-10 lg:mb-12"
              >
                <Link
                  to="/contact"
                  className="inline-block w-full sm:w-auto bg-jour-fleuri-jaune text-white hover:bg-jour-fleuri-cream hover:text-jour-fleuri-coral px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-semibold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
                >
                  Demander un devis
                </Link>
              </motion.div>

          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-jour-fleuri-cream relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal variant="fade">
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 leading-relaxed font-light">
              {homeIntro}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {universTopBandeau && (
        <section className="bg-jour-fleuri-rose-pale">
          <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] h-40 sm:h-48 md:h-56 overflow-hidden">
            <img
              src={universTopBandeau.url}
              alt={universTopBandeau.alt || 'Bandeau floral horizontal'}
              className="w-full h-full object-cover"
              style={{
                objectPosition: universTopBandeau.object_position || 'center center',
                transform: `scale(${universTopBandeau.object_scale || 1})`,
                transformOrigin: universTopBandeau.object_position || 'center center',
              }}
            />
          </div>
        </section>
      )}

      <section className="pt-8 pb-16 md:pt-12 md:pb-24 px-4 bg-jour-fleuri-rose-pale relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal variant="fade">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-jour-fleuri-coral text-center mb-14 md:mb-20">
              <span className="font-sans font-normal text-[0.75em] text-jour-fleuri-jaune">Nos</span>{' '}
              univers floraux
            </h2>
          </ScrollReveal>

          {services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {services.map((service, index) => (
                <ScrollReveal key={service.id} variant="slide-up" delay={index * 0.08}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.01 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="w-full bg-jour-fleuri-cream rounded-2xl p-5 sm:p-6 md:p-7 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <h3 className="font-serif text-2xl sm:text-3xl mb-3 text-gray-800">
                      {service.title}
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {service.short_description || service.description}
                    </p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">
              Les univers floraux seront bientôt disponibles ici.
            </p>
          )}
        </div>
      </section>

      {universBandeau && (
        <section className="hidden lg:block bg-jour-fleuri-rose-pale">
          <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] h-56 xl:h-64 overflow-hidden">
            <img
              src={universBandeau.url}
              alt={universBandeau.alt || 'Bandeau floral horizontal'}
              className="w-full h-full object-cover"
              style={{
                objectPosition: universBandeau.object_position || 'center center',
                transform: `scale(${universBandeau.object_scale || 1})`,
                transformOrigin: universBandeau.object_position || 'center center',
              }}
            />
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 px-4 bg-jour-fleuri-jaune-pale relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal variant="fade">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-jour-fleuri-coral text-center mb-8">
              <span className="font-sans font-normal text-[0.82em]">Nos créations</span>{' '}
              <span className="font-accent text-jour-fleuri-jaune">fleuries</span>
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
                className="inline-block w-full sm:w-auto bg-jour-fleuri-coral hover:bg-jour-fleuri-coral-clair text-white px-8 sm:px-10 py-4 rounded-full text-lg sm:text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Découvrir toute la galerie
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 bg-jour-fleuri-rose-poudre-pale relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal variant="fade">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-jour-fleuri-rose-poudre text-center mb-14 md:mb-20">
              <span className="font-sans font-normal text-[0.82em]">Ils nous font</span>{' '}
              <span className="font-accent text-jour-fleuri-jaune">confiance</span>
            </h2>
          </ScrollReveal>

          {testimonials.length > 0 && (
            <ScrollReveal variant="slide-up" delay={0.2}>
              <TestimonialsCarousel
                testimonials={testimonials}
                autoplay={true}
                interval={6000}
                itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
                mode="home"
              />
            </ScrollReveal>
          )}
        </div>
      </section>

      <div ref={instagramRef}>
        {showInstagram && (
          <Suspense
            fallback={
              <div className="py-16 bg-jour-fleuri-cream flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <InstagramFeed limit={6} showTitle={true} />
          </Suspense>
        )}
      </div>

      <section className="py-16 md:py-24 px-4 text-center relative overflow-hidden">
        {ctaBackground ? (
          <>
            <img
              src={ctaBackground.url}
              alt={ctaBackground.alt || 'Fond floral fumé'}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: ctaBackground.object_position || 'center center',
                transform: `scale(${ctaBackground.object_scale || 1})`,
                transformOrigin: ctaBackground.object_position || 'center center',
              }}
            />
            <div className="absolute inset-0 bg-black/45" />
          </>
        ) : (
          <div className="absolute inset-0 bg-jour-fleuri-coral" />
        )}

        <div className="max-w-4xl mx-auto relative z-10">
          <ScrollReveal variant="fade">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-jour-fleuri-cream mb-6 drop-shadow-lg">
              <span className="font-sans font-normal text-[0.82em]">Parlons de votre</span>{' '}
              <span className="font-accent text-jour-fleuri-jaune">projet floral</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal variant="slide-up" delay={0.2}>
            <Link
              to="/contact"
              className="inline-block w-full sm:w-auto bg-jour-fleuri-jaune text-white hover:bg-jour-fleuri-cream hover:text-jour-fleuri-coral px-10 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              Demander un devis gratuit
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
