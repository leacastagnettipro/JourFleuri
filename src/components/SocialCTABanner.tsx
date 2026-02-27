import { useState, useEffect } from 'react';
import { Instagram, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SocialCTABanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('socialBannerDismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('socialBannerDismissed', 'true');
  };

  if (isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
        >
          <div className="max-w-7xl mx-auto px-4 pb-4">
            <div className="bg-jour-fleuri-coral text-white rounded-xl shadow-2xl pointer-events-auto">
              <div className="flex items-center justify-between p-4 gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <Instagram className="w-6 h-6 flex-shrink-0" />
                  <p className="text-sm md:text-base font-medium">
                    Suivez nos créations fleuries au quotidien sur Instagram
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href="https://www.instagram.com/jourfleuri_fleuriste/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white text-jour-fleuri-rose-poudre border-2 border-jour-fleuri-rose-poudre rounded-full text-sm font-medium hover:bg-jour-fleuri-rose-poudre hover:text-white transition-all duration-300 hidden sm:block"
                  >
                    Suivre
                  </a>
                  <button
                    onClick={handleDismiss}
                    className="p-2 hover:bg-black/10 rounded-full transition-colors"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
