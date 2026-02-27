import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, User } from 'lucide-react';
import { Testimonial } from '../lib/supabase';

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
  autoplay?: boolean;
  interval?: number;
  itemsPerView?: { mobile: number; tablet: number; desktop: number };
}

export default function TestimonialsCarousel({
  testimonials,
  autoplay = true,
  interval = 6000,
  itemsPerView = { mobile: 1, tablet: 2, desktop: 3 }
}: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView.desktop);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsToShow(itemsPerView.mobile);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(itemsPerView.tablet);
      } else {
        setItemsToShow(itemsPerView.desktop);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsPerView]);

  useEffect(() => {
    if (!autoplay || isHovered || testimonials.length <= itemsToShow) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, testimonials.length - itemsToShow + 1));
    }, interval);

    return () => clearInterval(timer);
  }, [autoplay, interval, isHovered, testimonials.length, itemsToShow]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, testimonials.length - itemsToShow) : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % Math.max(1, testimonials.length - itemsToShow + 1)
    );
  };

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucun témoignage disponible pour le moment.
      </div>
    );
  }

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsToShow);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="grid gap-6 md:gap-8"
            style={{
              gridTemplateColumns: `repeat(${itemsToShow}, minmax(0, 1fr))`
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {visibleTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center overflow-hidden">
                    {testimonial.avatar_url ? (
                      <img
                        src={testimonial.avatar_url}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{testimonial.event_type}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-gray-700 leading-relaxed line-clamp-4">
                  {testimonial.text}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {testimonials.length > itemsToShow && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex justify-center gap-2 mt-8">
            {[...Array(Math.max(1, testimonials.length - itemsToShow + 1))].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-orange-500 w-8'
                    : 'bg-gray-300 w-2 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial group ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
