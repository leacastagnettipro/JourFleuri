import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import ParallaxSection from '../components/ParallaxSection';
import { getVisibleServices, type Service, getPageContentForPage, type PageContent } from '../lib/supabase';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [texts, setTexts] = useState<Record<string, PageContent>>({});

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

  const fallbackServices = [
    {
      title: 'Mariages',
      description:
        'Décors floraux sur mesure, bouquet de mariée, arche florale, centres de table et scénographies complètes pour célébrer votre amour.',
      bgColor: 'bg-jour-fleuri-rose-pale',
      accentColor: 'text-jour-fleuri-coral',
      image:
        'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      title: 'Événements privés',
      description:
        'Anniversaires, baptêmes, dîners, fêtes et célébrations familiales. Des bouquets sur mesure pour tous vos moments de joie.',
      bgColor: 'bg-jour-fleuri-jaune-pale',
      accentColor: 'text-jour-fleuri-jaune',
      image:
        'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      title: 'Événements professionnels',
      description:
        'Lancements de produits, séminaires, vitrines, décors de boutiques et scénographies florales pour marquer les esprits.',
      bgColor: 'bg-jour-fleuri-rose-poudre-pale',
      accentColor: 'text-jour-fleuri-rose-poudre',
      image:
        'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ];

  useEffect(() => {
    async function load() {
      const data = await getVisibleServices();
      if (data.length > 0) {
        setServices(data);
      }
      setLoading(false);
    }

    void load();
  }, []);

  useEffect(() => {
    async function loadTexts() {
      const data = await getPageContentForPage('services');
      const map: Record<string, PageContent> = {};
      data.forEach((item) => {
        map[item.section_key] = item;
      });
      setTexts(map);
    }
    void loadTexts();
  }, []);

  const intro =
    texts['services_intro']?.body ??
    'Des créations florales sur mesure pour tous vos événements';
  const ctaBlock =
    texts['services_cta_block']?.body ??
    'Contactez-nous pour discuter de vos besoins et recevoir un devis personnalisé';

  return (
    <div className="min-h-screen bg-jour-fleuri-cream relative overflow-hidden">
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal variant="fade">
            <h1 className="font-serif text-6xl md:text-7xl text-jour-fleuri-coral text-center mb-8">
              Nos <span className="font-serif text-jour-fleuri-jaune text-7xl md:text-8xl">Services</span>
            </h1>
            <p className="text-xl text-center text-gray-600 mb-20 max-w-3xl mx-auto">
              {intro}
            </p>
          </ScrollReveal>

          <div className="space-y-24">
            {(services.length > 0 ? services : fallbackServices).map((service, index) => {
              const isFallback = 'bgColor' in service;
              const variantKey = !isFallback
                ? (service as Service).color_variant ||
                  defaultVariants[index % defaultVariants.length]
                : defaultVariants[index % defaultVariants.length];
              const theme = colorThemes[variantKey] || colorThemes['soft-coral'];

              return (
                <ScrollReveal
                  key={index}
                  variant="fade"
                  delay={0.1}
                >
                  <div
                    className={`${
                      isFallback ? service.bgColor : theme.bg
                    } rounded-[3rem] overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 relative`}
                  >
                    <div className="grid md:grid-cols-2 gap-0 items-center">
                      {index % 2 === 0 ? (
                        <>
                          <div className="h-[400px] md:h-[550px] overflow-hidden relative">
                            <ParallaxSection speed={0.15}>
                              <img
                                src={
                                  'image' in service
                                    ? service.image
                                    : service.image_url ||
                                      'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200'
                                }
                                alt={service.title}
                                loading="lazy"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                              />
                            </ParallaxSection>
                          </div>
                          <div className="p-10 md:p-16">
                            <h2
                              className={`font-serif text-4xl md:text-5xl ${
                                isFallback ? service.accentColor : theme.accent
                              } mb-8 leading-tight`}
                            >
                              {service.title}
                            </h2>
                            <p className="text-xl text-gray-800 leading-relaxed mb-10">
                              {service.description}
                            </p>
                            <Link
                              to="/contact"
                              className="inline-block bg-jour-fleuri-coral hover:bg-jour-fleuri-coral-clair text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110"
                            >
                              Demander un devis
                            </Link>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-10 md:p-16 order-2 md:order-1">
                            <h2
                              className={`font-serif text-4xl md:text-5xl ${
                                isFallback ? service.accentColor : theme.accent
                              } mb-8 leading-tight`}
                            >
                              {service.title}
                            </h2>
                            <p className="text-xl text-gray-800 leading-relaxed mb-10">
                              {service.description}
                            </p>
                            <Link
                              to="/contact"
                              className="inline-block bg-jour-fleuri-coral hover:bg-jour-fleuri-coral-clair text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-110"
                            >
                              Demander un devis
                            </Link>
                          </div>
                          <div className="h-[400px] md:h-[550px] order-1 md:order-2 overflow-hidden relative">
                            <ParallaxSection speed={0.15}>
                              <img
                                src={
                                  'image' in service
                                    ? service.image
                                    : service.image_url ||
                                      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1200'
                                }
                                alt={service.title}
                                loading="lazy"
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000"
                              />
                            </ParallaxSection>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          <ScrollReveal variant="fade" delay={0.3}>
            <div className="mt-24 text-center bg-jour-fleuri-coral rounded-[3rem] p-16 shadow-2xl">
              <h3 className="font-serif text-4xl md:text-5xl text-jour-fleuri-cream mb-6">
                Un projet <span className="font-serif text-jour-fleuri-jaune text-5xl md:text-6xl">floral</span> en tête ?
              </h3>
              <p className="text-xl text-jour-fleuri-cream mb-10 max-w-2xl mx-auto">
                {ctaBlock}
              </p>
              <Link
                to="/contact"
                className="inline-block bg-jour-fleuri-jaune text-white hover:bg-jour-fleuri-cream hover:text-jour-fleuri-coral px-12 py-5 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110"
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
