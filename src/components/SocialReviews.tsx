import { useEffect, useState } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { getSocialReviews, SocialReview } from '../lib/supabase';
import ScrollReveal from './ScrollReveal';

export default function SocialReviews() {
  const [reviews, setReviews] = useState<SocialReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      const data = await getSocialReviews();
      setReviews(data);
      setLoading(false);
    }
    loadReviews();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'google':
        return 'from-blue-500 to-green-500';
      case 'instagram':
        return 'from-purple-500 to-pink-500';
      case 'facebook':
        return 'from-blue-600 to-blue-400';
      default:
        return 'from-gray-500 to-gray-700';
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <ScrollReveal variant="fade">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Ils parlent de nous
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ScrollReveal key={review.id} variant="slide-up" delay={index * 0.1}>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`px-3 py-1 rounded-full bg-gradient-to-r ${getPlatformColor(
                      review.platform
                    )} text-white text-sm font-medium capitalize`}
                  >
                    {review.platform}
                  </div>
                  {review.rating && (
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating!
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-4 line-clamp-4">{review.content}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="font-medium">{review.author}</span>
                  {review.profile_url && (
                    <a
                      href={review.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      Voir <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
