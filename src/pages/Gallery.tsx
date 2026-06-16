import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { getGalleryImages, getGalleryCategories, type GalleryCategory } from '../lib/supabase';
import CarouselGallery from '../components/CarouselGallery';
import ScrollReveal from '../components/ScrollReveal';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [images, setImages] = useState<any[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      const [data, categoryData] = await Promise.all([
        getGalleryImages(),
        getGalleryCategories(),
      ]);
      setImages(data);
      setCategories(categoryData);
      setLoading(false);
    }
    void loadImages();
  }, []);

  const categoryTabs = [
    { id: 'all', label: 'Tout' },
    ...categories.map((cat) => ({ id: cat.slug, label: cat.label })),
  ];

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
    640: 1,
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
      <section className="py-16 md:py-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal variant="fade">
            <h1 className="text-4xl sm:text-6xl md:text-7xl text-jour-fleuri-cream text-center mb-6 md:mb-8 font-serif">
              <span className="font-sans font-normal">Galerie</span>{' '}
              <span className="font-accent text-jour-fleuri-coral">florale</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-center text-jour-fleuri-cream mb-10 md:mb-16 max-w-3xl mx-auto">
              Découvrez nos créations colorées et champêtres pour tous vos événements
            </p>
          </ScrollReveal>

          {featuredImages.length > 0 && (
            <ScrollReveal variant="slide-up" className="mb-20">
              <div className="bg-jour-fleuri-cream rounded-3xl p-5 sm:p-8 shadow-xl">
                <h2 className="text-2xl sm:text-3xl font-serif text-jour-fleuri-coral mb-6 sm:mb-8 text-center">
                  <span className="font-sans font-normal text-[0.82em]">Nos créations</span>{' '}
                  <span className="font-accent text-jour-fleuri-jaune">vedettes</span>
                </h2>
                <CarouselGallery images={featuredImages} autoplay={true} interval={5000} />
              </div>
            </ScrollReveal>
          )}

          {categoryTabs.length > 1 && (
            <ScrollReveal variant="fade" delay={0.2}>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-10 md:mb-16">
                {categoryTabs.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-lg ${
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
          )}

          {filteredImages.length > 0 ? (
            <Masonry
              breakpointCols={breakpointColumns}
              className="flex gap-4 sm:gap-8 -ml-4 sm:-ml-8"
              columnClassName="pl-4 sm:pl-8 bg-clip-padding"
            >
              {filteredImages.map((image, index) => (
                <ScrollReveal key={image.id || index} variant="slide-up" delay={Math.min(index * 0.03, 0.5)}>
                  <div
                    className="mb-4 sm:mb-8 overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group relative"
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
          ) : (
            <p className="text-center text-jour-fleuri-cream text-lg">
              Aucune image dans cette catégorie pour le moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
