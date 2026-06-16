import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import ParallaxSection from '../components/ParallaxSection';
import {
  getPageContentForPage,
  getPageImagesForPage,
  type PageContent,
  type PageImage,
} from '../lib/supabase';

export default function About() {
  const [texts, setTexts] = useState<Record<string, PageContent>>({});
  const [images, setImages] = useState<Record<string, PageImage>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const [content, pageImages] = await Promise.all([
        getPageContentForPage('about'),
        getPageImagesForPage('about'),
      ]);

      const textMap: Record<string, PageContent> = {};
      content.forEach((item) => {
        textMap[item.section_key] = item;
      });
      setTexts(textMap);

      const imageMap: Record<string, PageImage> = {};
      pageImages.forEach((img) => {
        imageMap[img.section_key] = img;
      });
      setImages(imageMap);
      setLoaded(true);
    }
    void load();
  }, []);

  const mainImage = images['about_main'];

  const story =
    texts['about_story']?.body ??
    "Après une formation en enseignement, j'ai décidé de me reconvertir et de faire un CAP. Le but était d'y découvrir un métier manuel mais tout en me permettant aussi d'exploiter la branche commercial en restant au contact de l'humain. Après 3ans chez un fleuriste indépendant auprès duquel j'ai appris tout mon savoir faire mais aussi où j'ai découvert l'importance de la saisonnalité des fleurs, j'ai décidé de me lancer à mon compte en proposant d'accompagner les clients dans la décoration de leurs évènements professionnels et particuliers.";

  const value1 =
    texts['about_value_1']?.body ??
    'Accompagner les clients dans tous leurs projets en créant une relation de confiance';
  const value2 =
    texts['about_value_2']?.body ?? 'Travailler avec des fleurs de saison';
  const value3 =
    texts['about_value_3']?.body ?? 'Proposer des créations sur mesure';
  const value4 =
    texts['about_value_4']?.body ?? 'Favoriser des produits locaux';
  const ctaText =
    texts['about_cta_block']?.body ??
    'Parlons de votre univers floral et imaginons ensemble une création sur mesure.';

  const topBandeau = images['about_top_bandeau'];
  const dividerOne = images['about_divider_one'];
  const dividerTwo = images['about_divider_two'];

  if (!loaded) {
    return (
      <div className="min-h-screen bg-jour-fleuri-rose-pale flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFD3D2] relative overflow-hidden">
      {topBandeau && (
        <section className="relative">
          <div className="w-full h-44 sm:h-56 md:h-72 lg:h-[24rem] overflow-hidden">
            <img
              src={topBandeau.url}
              alt={topBandeau.alt || 'Bandeau floral'}
              className="w-full h-full object-cover"
              style={{
                objectPosition: topBandeau.object_position || 'center center',
                transform: `scale(${topBandeau.object_scale || 1})`,
                transformOrigin: topBandeau.object_position || 'center center',
              }}
            />
            <div className="absolute inset-0 bg-black/25" />
          </div>
          <div className="absolute inset-x-0 bottom-6 md:bottom-10 px-4 z-10">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal variant="fade">
                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-jour-fleuri-cream text-center drop-shadow-lg">
                  <span className="font-sans font-normal text-[0.82em]">À propos de</span>{' '}
                  <span className="font-accent text-jour-fleuri-jaune">Jour Fleuri</span>
                </h1>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      <section className={`${topBandeau ? 'pt-10 md:pt-14' : 'pt-16 md:pt-24'} pb-12 md:pb-16 px-4 bg-[#FFD3D2] relative z-10`}>
        <div className="max-w-6xl mx-auto">
          {!topBandeau && (
            <ScrollReveal variant="fade">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-jour-fleuri-coral text-center mb-10 md:mb-14">
                <span className="font-sans font-normal text-[0.82em]">À propos de</span>{' '}
                <span className="font-accent text-jour-fleuri-jaune">Jour Fleuri</span>
              </h1>
            </ScrollReveal>
          )}

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {mainImage && (
              <ScrollReveal variant="slide-right" delay={0.2}>
                <ParallaxSection speed={0.15}>
                  <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <img
                      src={mainImage.url}
                      alt={mainImage.alt || 'Portrait de la fleuriste'}
                      loading="lazy"
                      className="w-full h-[320px] sm:h-[420px] md:h-[520px] object-cover transition-all duration-500"
                      style={{
                        objectPosition: mainImage.object_position || 'center center',
                        transform: `scale(${mainImage.object_scale || 1})`,
                        transformOrigin: mainImage.object_position || 'center center',
                      }}
                    />
                  </div>
                </ParallaxSection>
              </ScrollReveal>
            )}

            <ScrollReveal variant="slide-left" delay={0.3}>
              <div className="bg-[#FFE6C5] rounded-[2rem] md:rounded-[2.5rem] p-7 sm:p-9 md:p-11 shadow-xl">
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-jour-fleuri-coral mb-5 md:mb-7">
                  <span className="font-sans font-normal text-[0.82em]">Mon</span>{' '}
                  <span className="font-accent text-jour-fleuri-jaune">histoire</span>
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-800 leading-relaxed">
                  {story}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {dividerOne && (
        <section>
          <div className="w-full h-36 sm:h-44 md:h-52 overflow-hidden">
            <img
              src={dividerOne.url}
              alt={dividerOne.alt || 'Bandeau floral intermédiaire'}
              className="w-full h-full object-cover"
              style={{
                objectPosition: dividerOne.object_position || 'center center',
                transform: `scale(${dividerOne.object_scale || 1})`,
                transformOrigin: dividerOne.object_position || 'center center',
              }}
            />
          </div>
        </section>
      )}

      <section className="py-14 md:py-20 px-4 bg-jour-fleuri-jaune-pale">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal variant="slide-up" delay={0.35}>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-jour-fleuri-coral text-center mb-10 md:mb-14">
              <span className="font-sans font-normal text-[0.82em]">Mes</span>{' '}
              <span className="font-accent text-jour-fleuri-jaune">valeurs</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-5 md:gap-7">
              {[
                { text: value1, bg: 'bg-jour-fleuri-coral' },
                { text: value2, bg: 'bg-jour-fleuri-jaune' },
                { text: value3, bg: 'bg-jour-fleuri-rose-poudre' },
                { text: value4, bg: 'bg-jour-fleuri-coral-clair' },
              ].map((value, index) => (
                <div key={index} className="bg-jour-fleuri-cream rounded-2xl p-5 md:p-6 shadow-md">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${value.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                    <p className="text-gray-800 text-base sm:text-lg leading-relaxed">{value.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {dividerTwo && (
        <section>
          <div className="w-full h-36 sm:h-44 md:h-52 overflow-hidden">
            <img
              src={dividerTwo.url}
              alt={dividerTwo.alt || 'Bandeau floral intermédiaire'}
              className="w-full h-full object-cover"
              style={{
                objectPosition: dividerTwo.object_position || 'center center',
                transform: `scale(${dividerTwo.object_scale || 1})`,
                transformOrigin: dividerTwo.object_position || 'center center',
              }}
            />
          </div>
        </section>
      )}

      <section className="py-14 md:py-20 px-4 bg-jour-fleuri-coral text-center">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal variant="fade" delay={0.45}>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-jour-fleuri-cream mb-5 md:mb-6">
              <span className="font-sans font-normal text-[0.82em]">Créons votre</span>{' '}
              <span className="font-accent text-jour-fleuri-jaune">univers floral</span>
            </h3>
            <p className="text-jour-fleuri-cream text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto">
              {ctaText}
            </p>
            <Link
              to="/contact"
              className="inline-block w-full sm:w-auto bg-jour-fleuri-jaune text-white hover:bg-jour-fleuri-cream hover:text-jour-fleuri-coral px-10 sm:px-12 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105"
            >
              Demander un devis
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
