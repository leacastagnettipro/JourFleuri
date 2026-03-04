import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { getGalleryImages } from '../lib/supabase';
import CarouselGallery from '../components/CarouselGallery';
import ScrollReveal from '../components/ScrollReveal';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'mariages', label: 'Mariages' },
    { id: 'compositions', label: 'Compositions' },
    { id: 'tables', label: 'Décors de table' },
    { id: 'bouquets', label: 'Bouquets' }
  ];

  const fallbackImages = [
    { url: 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Bouquet champêtre coloré', aspect_ratio: 1.5 },
    { url: 'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Bouquet rose et pêche', aspect_ratio: 0.8 },
    { url: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'mariages', alt: 'Arche florale mariage', aspect_ratio: 1.2 },
    { url: 'https://images.pexels.com/photos/1459505/pexels-photo-1459505.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'tables', alt: 'Table élégante fleurie', aspect_ratio: 1.0 },
    { url: 'https://images.pexels.com/photos/2306285/pexels-photo-2306285.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'mariages', alt: 'Décor bohème mariage', aspect_ratio: 0.9 },
    { url: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Bouquet corail moderne', aspect_ratio: 1.3 },
    { url: 'https://images.pexels.com/photos/1476039/pexels-photo-1476039.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Composition florale jaune', aspect_ratio: 0.7 },
    { url: 'https://images.pexels.com/photos/931162/pexels-photo-931162.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Bouquet de pivoines roses', aspect_ratio: 1.1 },
    { url: 'https://images.pexels.com/photos/1390600/pexels-photo-1390600.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Bouquet de roses pastel', aspect_ratio: 1.4 },
    { url: 'https://images.pexels.com/photos/1414110/pexels-photo-1414110.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'compositions', alt: 'Composition florale moderne', aspect_ratio: 0.85 },
    { url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Bouquet de tulipes colorées', aspect_ratio: 1.2 },
    { url: 'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'mariages', alt: 'Bouquet de mariée champêtre', aspect_ratio: 0.95 },
    { url: 'https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Bouquet sauvage coloré', aspect_ratio: 1.3 },
    { url: 'https://images.pexels.com/photos/1496373/pexels-photo-1496373.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'compositions', alt: 'Composition florale bohème', aspect_ratio: 0.9 },
    { url: 'https://images.pexels.com/photos/1179863/pexels-photo-1179863.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Bouquet de fleurs des champs', aspect_ratio: 1.5 },
    { url: 'https://images.pexels.com/photos/1322164/pexels-photo-1322164.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'tables', alt: 'Centre de table floral', aspect_ratio: 1.0 },
    { url: 'https://images.pexels.com/photos/1840119/pexels-photo-1840119.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Bouquet romantique rose', aspect_ratio: 1.1 },
    { url: 'https://images.pexels.com/photos/1157255/pexels-photo-1157255.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Bouquet de fleurs fraîches', aspect_ratio: 0.8 },
    { url: 'https://images.pexels.com/photos/1268558/pexels-photo-1268558.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'compositions', alt: 'Arrangement floral élégant', aspect_ratio: 1.2 },
    { url: 'https://images.pexels.com/photos/3585089/pexels-photo-3585089.jpeg?auto=compress&cs=tinysrgb&w=1200', category: 'bouquets', alt: 'Bouquet de mariée délicat', aspect_ratio: 1.4 },
  ];

  useEffect(() => {
    async function loadImages() {
      const data = await getGalleryImages();
      if (data.length > 0) {
        setImages(data);
      } else {
        setImages(fallbackImages);
      }
      setLoading(false);
    }
    loadImages();
  }, []);

  const filteredImages =
    selectedCategory === 'all'
      ? images
      : images.filter((img) => img.category === selectedCategory);

  const featuredSource = images.filter((img) => img.is_featured);
  const baseForFeatured = (featuredSource.length > 0 ? featuredSource : images).slice(0, 5);

  const featuredImages = baseForFeatured.map((img) => ({
    url: img.url,
    alt: img.alt,
  }));

  const breakpointColumns = {
    default: 3,
    1024: 2,
    640: 1
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-jour-fleuri-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jour-fleuri-jaune relative overflow-hidden">
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal variant="fade">
            <h1 className="font-serif text-6xl md:text-7xl text-jour-fleuri-cream text-center mb-8">
              Galerie <span className="font-serif text-jour-fleuri-coral text-7xl md:text-8xl">florale</span>
            </h1>
            <p className="text-xl text-center text-jour-fleuri-cream mb-16 max-w-3xl mx-auto">
              Découvrez nos créations colorées et champêtres pour tous vos événements
            </p>
          </ScrollReveal>

          {featuredImages.length > 0 && (
            <ScrollReveal variant="slide-up" className="mb-20">
              <div className="bg-jour-fleuri-cream rounded-3xl p-8 shadow-xl">
                <h2 className="text-3xl font-serif text-jour-fleuri-coral mb-8 text-center">
                  Nos créations <span className="font-serif text-jour-fleuri-jaune text-4xl">vedettes</span>
                </h2>
                <CarouselGallery images={featuredImages} autoplay={true} interval={5000} />
              </div>
            </ScrollReveal>
          )}

          <ScrollReveal variant="fade" delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 text-lg ${
                    selectedCategory === category.id
                      ? 'bg-jour-fleuri-coral text-white shadow-xl scale-110'
                      : 'bg-jour-fleuri-cream text-gray-700 hover:bg-jour-fleuri-coral-clair hover:text-white shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          <Masonry
            breakpointCols={breakpointColumns}
            className="flex gap-8 -ml-8"
            columnClassName="pl-8 bg-clip-padding"
          >
            {filteredImages.map((image, index) => (
              <ScrollReveal key={index} variant="slide-up" delay={Math.min(index * 0.03, 0.5)}>
                <div
                  className="mb-8 overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group relative"
                  style={{ aspectRatio: image.aspect_ratio || 1 }}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-jour-fleuri-coral opacity-0 group-hover:opacity-80 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-jour-fleuri-cream font-medium text-lg">{image.alt}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </Masonry>
        </div>
      </section>
    </div>
  );
}
