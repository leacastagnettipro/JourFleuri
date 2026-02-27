import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Scissors, Palette, MapPin } from 'lucide-react';
import { getAtelierImages, AtelierImage } from '../lib/supabase';
import ScrollReveal from '../components/ScrollReveal';
import ParallaxSection from '../components/ParallaxSection';

export default function Atelier() {
  const [images, setImages] = useState<AtelierImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      const data = await getAtelierImages();
      setImages(data);
      setLoading(false);
    }
    loadImages();
  }, []);

  const getImagesBySection = (section: string) => {
    return images.filter((img) => img.section === section);
  };

  const processSteps = [
    {
      icon: Sparkles,
      title: 'Sélection des fleurs',
      description: 'Je choisis avec soin des fleurs de saison, fraîches et locales quand c\'est possible.',
      color: 'from-jour-fleuri-yellow to-yellow-400',
    },
    {
      icon: Palette,
      title: 'Conception',
      description: 'Création d\'un moodboard personnalisé qui capture votre vision et l\'atmosphère désirée.',
      color: 'from-coral-400 to-coral-500',
    },
    {
      icon: Scissors,
      title: 'Réalisation',
      description: 'Assemblage minutieux de chaque composition, avec attention aux détails et à l\'harmonie.',
      color: 'from-jour-fleuri-rose-poudre to-pink-300',
    },
    {
      icon: MapPin,
      title: 'Installation',
      description: 'Mise en place soignée sur le lieu de votre événement pour un résultat parfait.',
      color: 'from-jour-fleuri-pink to-pink-400',
    },
  ];

  const seasonalFlowers = [
    { name: 'Pivoines', season: 'Printemps', color: 'bg-pink-100 text-pink-800' },
    { name: 'Dahlias', season: 'Été', color: 'bg-coral-100 text-coral-800' },
    { name: 'Renoncules', season: 'Printemps', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Eucalyptus', season: 'Toute l\'année', color: 'bg-green-100 text-green-800' },
    { name: 'Roses', season: 'Toute l\'année', color: 'bg-pink-100 text-pink-800' },
    { name: 'Pampas', season: 'Automne', color: 'bg-orange-100 text-orange-800' },
  ];

  return (
    <div>
      <ParallaxSection
        imageUrl="https://images.pexels.com/photos/1820563/pexels-photo-1820563.jpeg?auto=compress&cs=tinysrgb&w=1920"
        height="h-[60vh]"
      >
        <div className="relative z-10 text-center text-white">
          <ScrollReveal variant="fade">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
              Les Coulisses de l'Atelier
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto drop-shadow">
              Découvrez l'univers où prennent vie vos créations florales
            </p>
          </ScrollReveal>
        </div>
      </ParallaxSection>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal variant="fade">
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
              Mon Espace de Travail
            </h2>
            <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Un atelier lumineux où la créativité rencontre la nature. Chaque coin est pensé pour
              donner vie aux bouquets qui sublimeront vos événements les plus précieux.
            </p>
          </ScrollReveal>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : getImagesBySection('workspace').length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getImagesBySection('workspace').map((image, index) => (
                <ScrollReveal key={image.id} variant="scale" delay={index * 0.1}>
                  <div className="aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i, index) => (
                <ScrollReveal key={i} variant="scale" delay={index * 0.1}>
                  <div className="aspect-square overflow-hidden rounded-xl shadow-lg bg-gray-200">
                    <img
                      src={`https://images.pexels.com/photos/${1820563 + i}/pexels-photo-${1820563 + i}.jpeg?auto=compress&cs=tinysrgb&w=600`}
                      alt={`Atelier ${i}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-jour-fleuri-cream">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal variant="fade">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              Le Processus de Création
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <ScrollReveal key={index} variant="slide-up" delay={index * 0.15}>
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-300 mb-2">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal variant="fade">
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
              Derrière les Bouquets
            </h2>
            <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Un aperçu authentique de la création de vos compositions florales,
              de la première coupe à la touche finale.
            </p>
          </ScrollReveal>

          {!loading && getImagesBySection('behind_scenes').length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {getImagesBySection('behind_scenes').map((image, index) => (
                <ScrollReveal key={image.id} variant="slide-up" delay={index * 0.1}>
                  <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="aspect-[4/3]">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {image.description && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <p className="text-sm">{image.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i, index) => (
                <ScrollReveal key={i} variant="slide-up" delay={index * 0.1}>
                  <div className="aspect-[4/3] overflow-hidden rounded-xl shadow-lg bg-gray-200">
                    <img
                      src={`https://images.pexels.com/photos/${1128797 + i}/pexels-photo-${1128797 + i}.jpeg?auto=compress&cs=tinysrgb&w=600`}
                      alt={`Behind the scenes ${i}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-jour-fleuri-rose-poudre/10 to-jour-fleuri-rose-pale/10">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal variant="fade">
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-900">
              Les Fleurs du Moment
            </h2>
            <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-12">
              Travailler avec les fleurs de saison, c'est garantir leur fraîcheur,
              respecter l'environnement et profiter du meilleur de la nature.
            </p>
          </ScrollReveal>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {seasonalFlowers.map((flower, index) => (
              <ScrollReveal key={index} variant="scale" delay={index * 0.1}>
                <div className={`px-6 py-3 rounded-full ${flower.color} font-medium shadow-md hover:shadow-lg transition-shadow`}>
                  {flower.name}
                  <span className="text-xs ml-2 opacity-70">({flower.season})</span>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {!loading && getImagesBySection('seasonal_flowers').length > 0 && (
            <div className="grid md:grid-cols-4 gap-4 mt-8">
              {getImagesBySection('seasonal_flowers').map((image, index) => (
                <ScrollReveal key={image.id} variant="scale" delay={index * 0.1}>
                  <div className="aspect-square overflow-hidden rounded-lg shadow-md">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-jour-fleuri-yellow to-yellow-400">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal variant="fade">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Discutons de Votre Projet
            </h2>
            <p className="text-xl text-gray-800 mb-8">
              Chaque création est unique. Partagez-moi votre vision et créons ensemble
              quelque chose d'exceptionnel pour votre événement.
            </p>
            <Link
              to="/contact"
              className="inline-block px-12 py-5 bg-white text-gray-900 font-bold text-lg rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              Demander un devis
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
