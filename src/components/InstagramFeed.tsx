import { useEffect, useState } from 'react';
import { Instagram, ExternalLink } from 'lucide-react';
import { getInstagramPosts, InstagramPost } from '../lib/supabase';
import ScrollReveal from './ScrollReveal';

interface InstagramFeedProps {
  limit?: number;
  showTitle?: boolean;
}

export default function InstagramFeed({ limit = 6, showTitle = true }: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const data = await getInstagramPosts(limit);
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, [limit]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-jour-fleuri-cream">
      <div className="max-w-7xl mx-auto px-4">
        {showTitle && (
          <ScrollReveal variant="fade">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Suivez nos créations
              </h2>
              <p className="text-gray-600 text-lg">
                Découvrez notre quotidien fleuri sur Instagram
              </p>
            </div>
          </ScrollReveal>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <ScrollReveal key={post.id} variant="scale" delay={index * 0.1}>
              <a
                href={post.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={post.image_url}
                  alt={post.caption || 'Instagram post'}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    {post.caption && (
                      <p className="text-sm line-clamp-2 mb-2">{post.caption}</p>
                    )}
                    <div className="flex items-center justify-between">
                      {post.likes_count && (
                        <span className="text-xs flex items-center gap-1">
                          ❤️ {post.likes_count}
                        </span>
                      )}
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </a>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal variant="fade" delay={0.3}>
          <div className="text-center mt-8">
            <a
              href="https://www.instagram.com/jourfleuri_fleuriste/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-jour-fleuri-cream text-jour-fleuri-rose-poudre font-medium rounded-full border-2 border-jour-fleuri-rose-poudre hover:bg-jour-fleuri-rose-poudre hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Instagram className="w-5 h-5" />
              Suivre sur Instagram
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
