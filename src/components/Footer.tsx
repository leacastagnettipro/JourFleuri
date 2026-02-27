import { useEffect, useState } from 'react';
import { Mail, Instagram, MapPin } from 'lucide-react';
import { getInstagramPosts, InstagramPost } from '../lib/supabase';

export default function Footer() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    async function loadPosts() {
      const data = await getInstagramPosts(3);
      setPosts(data);
    }
    loadPosts();
  }, []);

  return (
    <footer className="bg-jour-fleuri-rose-pale py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <img
              src="/LOGO_NOIR.svg"
              alt="Jour Fleuri"
              className="h-16 mb-4"
            />
            <p className="text-gray-700">
              Atelier floral créatif spécialisé en décoration d'événements
            </p>
          </div>

          <div>
            <h4 className="font-serif text-xl text-jour-fleuri-coral mb-4">Contact</h4>
            <div className="space-y-3">
              <a
                href="mailto:contact@jourfleuri.fr"
                className="flex items-center gap-2 text-gray-700 hover:text-jour-fleuri-coral transition-colors"
              >
                <Mail size={18} />
                <span>contact@jourfleuri.fr</span>
              </a>
              <a
                href="https://instagram.com/jourfleuri"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-jour-fleuri-coral transition-colors"
              >
                <Instagram size={18} />
                <span>@jourfleuri</span>
              </a>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin size={18} />
                <span>Suresnes, France</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl text-jour-fleuri-coral mb-4">Horaires</h4>
            <p className="text-gray-700">
              Du lundi au samedi<br />
              Sur rendez-vous uniquement
            </p>
          </div>

          <div>
            <h4 className="font-serif text-xl text-jour-fleuri-coral mb-4">Sur Instagram</h4>
            {posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {posts.map((post) => (
                  <a
                    key={post.id}
                    href={post.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square overflow-hidden rounded-lg hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={post.image_url}
                      alt={post.caption || 'Instagram post'}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm mb-4">Suivez nos créations quotidiennes</p>
            )}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-coral-400 to-coral-500 text-white rounded-full text-sm font-medium hover:from-coral-500 hover:to-coral-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Instagram className="w-4 h-4" />
              Suivre
            </a>
          </div>
        </div>

        <div className="border-t border-jour-fleuri-coral border-opacity-20 pt-8 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Jour Fleuri. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
