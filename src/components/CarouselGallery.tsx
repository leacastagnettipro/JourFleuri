import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface CarouselImage {
  url: string;
  alt: string;
}

interface CarouselGalleryProps {
  images: CarouselImage[];
  autoplay?: boolean;
  interval?: number;
}

export default function CarouselGallery({
  images,
  autoplay = true,
  interval = 5000
}: CarouselGalleryProps) {
  const imagesPerPage = 6;
  const totalPages = Math.ceil(images.length / imagesPerPage);

  const [currentPage, setCurrentPage] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  useEffect(() => {
    if (!autoplay || isHovered || totalPages <= 1) return;

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
      setSelectedImage(null);
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, isHovered, totalPages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImage === null) return;

      if (e.key === 'Escape') {
        setLightboxImage(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxImage((prev) => (prev! - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        setLightboxImage((prev) => (prev! + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxImage, images.length]);

  useEffect(() => {
    if (lightboxImage !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [lightboxImage]);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    setSelectedImage(null);
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
    setSelectedImage(null);
  };

  const goToPreviousLightboxImage = () => {
    if (lightboxImage === null) return;
    setLightboxImage((prev) => (prev! - 1 + images.length) % images.length);
  };

  const goToNextLightboxImage = () => {
    if (lightboxImage === null) return;
    setLightboxImage((prev) => (prev! + 1) % images.length);
  };

  const handleImageClick = (index: number) => {
    setLightboxImage(index);
  };

  if (images.length === 0) {
    return null;
  }

  const startIndex = currentPage * imagesPerPage;
  const visibleImages = images.slice(startIndex, startIndex + imagesPerPage);

  const gridLayout = [
    { span: 'col-span-2 row-span-2', size: 'large' },
    { span: 'col-span-1 row-span-1', size: 'small' },
    { span: 'col-span-1 row-span-2', size: 'tall' },
    { span: 'col-span-2 row-span-1', size: 'wide' },
    { span: 'col-span-1 row-span-1', size: 'small' },
    { span: 'col-span-1 row-span-1', size: 'small' },
  ];

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid grid-cols-4 auto-rows-[200px] gap-3 md:gap-4">
        {visibleImages.map((image, index) => {
          const layout = gridLayout[index % gridLayout.length];
          const globalIndex = startIndex + index;
          const isSelected = selectedImage === globalIndex;
          const isHoveredItem = hoveredImage === globalIndex;
          const isActive = isSelected || isHoveredItem;

          return (
            <motion.div
              key={globalIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className={`${layout.span} relative overflow-hidden rounded-xl cursor-pointer group`}
              onClick={() => handleImageClick(globalIndex)}
              onMouseEnter={() => setHoveredImage(globalIndex)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <motion.div
                className="relative w-full h-full"
                animate={{
                  scale: isActive ? 1.05 : 1,
                  zIndex: isActive ? 10 : 1
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />

                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-jour-fleuri-coral/70 via-transparent to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className="absolute inset-0 border-4 border-jour-fleuri-jaune rounded-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: isSelected ? 1 : 0,
                    scale: isSelected ? 1 : 0.95
                  }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-4 text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    y: isActive ? 0 : 10
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-medium drop-shadow-lg">{image.alt}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <motion.button
            onClick={goToPreviousPage}
            className="bg-jour-fleuri-coral hover:bg-jour-fleuri-coral-clair text-white p-3 rounded-full shadow-lg transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setCurrentPage(index);
                  setSelectedImage(null);
                }}
                className={`rounded-full transition-all duration-300 ${
                  index === currentPage
                    ? 'bg-jour-fleuri-coral w-8 h-3'
                    : 'bg-jour-fleuri-coral/30 hover:bg-jour-fleuri-coral/50 w-3 h-3'
                }`}
                whileHover={{ scale: 1.2 }}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          <motion.button
            onClick={goToNextPage}
            className="bg-jour-fleuri-coral hover:bg-jour-fleuri-coral-clair text-white p-3 rounded-full shadow-lg transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Next page"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {lightboxImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxImage(null)}
          >
            <motion.button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full backdrop-blur-sm transition-colors duration-300 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </motion.button>

            {images.length > 1 && (
              <>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPreviousLightboxImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-colors duration-300 z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextLightboxImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-colors duration-300 z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative max-w-7xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[lightboxImage].url}
                alt={images[lightboxImage].alt}
                loading="lazy"
                className="w-full h-full object-contain rounded-lg"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg"
              >
                <p className="text-white text-lg font-medium text-center">
                  {images[lightboxImage].alt}
                </p>
                <p className="text-white/70 text-sm text-center mt-1">
                  {lightboxImage + 1} / {images.length}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
