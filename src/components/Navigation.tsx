import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram } from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/a-propos', label: 'À propos' },
    { path: '/services', label: 'Services' },
    { path: '/galerie', label: 'Galerie' },
    { path: '/atelier', label: 'Atelier' },
    { path: '/temoignages', label: 'Témoignages' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-jour-fleuri-cream shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/LOGO_ORANGE.svg"
              alt="Jour Fleuri"
              className="h-12 md:h-14 transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-sans font-medium text-sm uppercase tracking-wide transition-colors ${
                  isActive(link.path)
                    ? 'text-jour-fleuri-coral'
                    : 'text-gray-700 hover:text-jour-fleuri-coral'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral-500 hover:text-coral-600 transition-colors hover:scale-110 transform duration-200"
              aria-label="Suivez-nous sur Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 hover:text-jour-fleuri-coral transition-colors"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-3 font-sans font-medium text-base transition-colors ${
                  isActive(link.path)
                    ? 'text-jour-fleuri-coral'
                    : 'text-gray-700 hover:text-jour-fleuri-coral'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-3 text-coral-500 hover:text-coral-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Instagram className="w-5 h-5" />
              <span className="font-sans font-medium text-base">Instagram</span>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
