import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import ParallaxSection from '../components/ParallaxSection';
import {
  getVisibleServices,
  getPageContentForPage,
  getPageImagesForPage,
  type Service,
  type PageContent,
  type PageImage,
} from '../lib/supabase';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [texts, setTexts] = useState<Record<string, PageContent>>({});
  const [pageImages, setPageImages] = useState<Record<string, PageImage>>({});

  const colorThemes: Record<string, { bg: string; accent: string }> = {
    'soft-coral': {
      bg: 'bg-jour-fleuri-rose-pale',
      accent: 'text-jour-fleuri-coral',
    },
    'soft-yellow': {
      bg: 'bg-jour-fleuri-jaune-pale',
      accent: 'text-jour-fleuri-jaune',
    },
    'soft-pink': {
      bg: 'bg-jour-fleuri-rose-poudre-pale',
      accent: 'text-jour-fleuri-rose-poudre',
    },
    cream: {
      bg: 'bg-jour-fleuri-cream',
      accent: 'text-jour-fleuri-coral',
    },
  };

  const defaultVariants = ['soft-coral', 'soft-yellow', 'soft-pink', 'cream'];

  useEffect(() => {
    async function load() {
      const data = await getVisibleServices();
      setServices(data);
      setLoading(false);
    }

    void load();
  }, []);

  useEffect(() => {
    async function loadTexts() {
      const [data, images] = await Promise.all([
        getPageContentForPage('services'),
        getPageImagesForPage('services'),
      ]);
      const map: Record<string, PageContent> = {};
      data.forEach((item) => {
        map[item.section_key] = item;
      });
      setTexts(map);

      const imageMap: Record<string, PageImage> = {};
      images.forEach((item) => {
        imageMap[item.section_key] = item;
      });
      setPageImages(imageMap);
    }
    void loadTexts();
  }, []);

  const intro =
    texts['services_intro']?.body ??
    'Des créations florales sur mesure pour tous vos événements';
  const ctaBlock =
    texts['services_cta_block']?.body ??
    'Contactez-nous pour discuter de vos besoins et recevoir un devis personnalisé';
  const topBandeau = pageImages['services_top_bandeau'];

  if (loading) {
    return (
      <div className="min-h-screen bg-jour-fleuri-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jour-fleuri-cream relative overflow-hidden">
      <section
        className={`${topBandeau ? 'pt-0 pb-16 md:pb-24' : 'py-16 md:py-24'} px-4 relative z-10`}
      >
        <div className="max-w-7xl mx-auto">
          {topBandeau ? (
            <ScrollReveal variant="fade">
              <div className="mb-12 md:mb-20">
                <div className="relative left-1/2 right-1/2 w-screen -ml-[50vw] -mr-[50vw] h-52 sm:h-64 md:h-80 lg:h-[26rem] overflow-hidden">
                  <img
                    src={topBandeau.url}
                    alt={topBandeau.alt || 'Bandeau services'}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: topBandeau.object_position || 'center center',
                      transform: `scale(${topBandeau.object_scale || 1})`,
                      transformOrigin: topBandeau.object_position || 'center center',
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-5 sm:px-8">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl text-jour-fleuri-cream text-center mb-5 md:mb-7 font-serif drop-shadow-lg">
                      <span className="font-sans font-normal">Nos</span>{' '}
                      <span className="font-accent text-jour-fleuri-jaune">Services</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-2xl text-center text-white max-w-3xl leading-relaxed drop-shadow-md">
                      {intro}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <ScrollReveal variant="fade">
              <h1 className="text-4xl sm:text-6xl md:text-7xl text-jour-fleuri-coral text-center mb-6 md:mb-8 font-serif">
                <span className="font-sans font-normal">Nos</span>{' '}
                <span className="font-accent text-jour-fleuri-jaune">Services</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-center text-gray-600 mb-12 md:mb-20 max-w-3xl mx-auto">
                {intro}
              </p>
            </ScrollReveal>
          )}

          {services.length > 0 ? (
            <div className="space-y-14 md:space-y-24">
              {services.map((service, index) => {
                const variantKey =
                  service.color_variant || defaultVariants[index % defaultVariants.length];
                const theme = colorThemes[variantKey] || colorThemes['soft-coral'];

                return (
                  <ScrollReveal key={service.id} variant="fade" delay={0.1}>
                    <div
                      className={`${theme.bg} rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 relative`}
                    >
                      <div className="grid md:grid-cols-2 gap-0 items-center">
                        {index % 2 === 0 ? (
                          <>
                            {service.image_url && (
                              <div className="h-[260px] sm:h-[320px] md:h-[550px] overflow-hidden relative">
                                <ParallaxSection speed={0.15}>
                                  <img
                                    src={service.image_url}
                                    alt={service.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                                  />
                                </ParallaxSection>
                              </div>
                            )}
                            <div className="p-6 sm:p-8 md:p-16">
                              <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl ${theme.accent} mb-5 md:mb-8 leading-tight`}>
                                {service.title}
                              </h2>
                              <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed mb-7 md:mb-10">
                                {service.description}
                              </p>
                              <Link
                                to="/contact"
                                className="inline-block w-full sm:w-auto bg-jour-fleuri-coral hover:bg-jour-fleuri-coral-clair text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                              >
                                {service.cta_label || 'Demander un devis'}
                              </Link>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-6 sm:p-8 md:p-16 order-2 md:order-1">
                              <h2 className={`font-serif text-3xl sm:text-4xl md:text-5xl ${theme.accent} mb-5 md:mb-8 leading-tight`}>
                                {service.title}
                              </h2>
                              <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed mb-7 md:mb-10">
                                {service.description}
                              </p>
                              <Link
                                to="/contact"
                                className="inline-block w-full sm:w-auto bg-jour-fleuri-coral hover:bg-jour-fleuri-coral-clair text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                              >
                                {service.cta_label || 'Demander un devis'}
                              </Link>
                            </div>
                            {service.image_url && (
                              <div className="h-[260px] sm:h-[320px] md:h-[550px] order-1 md:order-2 overflow-hidden relative">
                                <ParallaxSection speed={0.15}>
                                  <img
                                    src={service.image_url}
                                    alt={service.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                                  />
                                </ParallaxSection>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg mb-12">
              Nos services seront bientôt disponibles ici.
            </p>
          )}

          <ScrollReveal variant="fade" delay={0.3}>
            <div className="mt-16 md:mt-24 text-center bg-jour-fleuri-coral rounded-[2rem] md:rounded-[3rem] p-8 sm:p-12 md:p-16 shadow-2xl">
              <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-jour-fleuri-cream mb-5 md:mb-6">
                <span className="font-sans font-normal text-[0.82em]">Un projet</span>{' '}
                <span className="font-accent text-jour-fleuri-jaune">floral</span>{' '}
                <span className="font-sans font-normal text-[0.82em]">en tête ?</span>
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-jour-fleuri-cream mb-8 md:mb-10 max-w-2xl mx-auto">
                {ctaBlock}
              </p>
              <Link
                to="/contact"
                className="inline-block w-full sm:w-auto bg-jour-fleuri-jaune text-white hover:bg-jour-fleuri-cream hover:text-jour-fleuri-coral px-10 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                Nous contacter
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
