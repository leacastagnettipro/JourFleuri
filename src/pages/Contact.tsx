import { useState, useEffect, FormEvent } from 'react';
import { Mail, Instagram, Phone } from 'lucide-react';
import { submitContactForm } from '../lib/supabase';
import ScrollReveal from '../components/ScrollReveal';
import {
  getPageContentForPage,
  getPageImagesForPage,
  type PageContent,
  type PageImage,
} from '../lib/supabase';

export default function Contact() {
  const [texts, setTexts] = useState<Record<string, PageContent>>({});
  const [pageImages, setPageImages] = useState<Record<string, PageImage>>({});
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    typeEvenement: '',
    date: '',
    lieu: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function load() {
      const [data, images] = await Promise.all([
        getPageContentForPage('contact'),
        getPageImagesForPage('contact'),
      ]);
      const map: Record<string, PageContent> = {};
      data.forEach((item) => {
        map[item.section_key] = item;
      });
      setTexts(map);

      const imageMap: Record<string, PageImage> = {};
      images.forEach((item) => {
        imageMap[item.section_key] = item;
      });
      setPageImages(imageMap);
    }
    void load();
  }, []);

  const intro =
    texts['contact_intro']?.body ?? 'Donnons vie à vos rêves floraux ensemble';
  const formIntro =
    texts['contact_form_intro']?.body ??
    "Vous avez un projet floral ? Racontez-moi votre univers, je serai ravie d'imaginer une création sur mesure pour votre événement.";
  const topBandeau = pageImages['contact_top_bandeau'];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const success = await submitContactForm({
        nom: formData.nom,
        email: formData.email,
        type_evenement: formData.typeEvenement,
        date: formData.date,
        lieu: formData.lieu,
        message: formData.message
      });

      if (success) {
        setSubmitStatus('success');
        setFormData({
          nom: '',
          email: '',
          typeEvenement: '',
          date: '',
          lieu: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-jour-fleuri-rose-poudre-pale relative overflow-hidden">
      {topBandeau && (
        <section className="relative">
          <div className="w-full h-48 sm:h-64 md:h-80 lg:h-[24rem] overflow-hidden">
            <img
              src={topBandeau.url}
              alt={topBandeau.alt || 'Bandeau floral contact'}
              className="w-full h-full object-cover"
              style={{
                objectPosition: topBandeau.object_position || 'center center',
                transform: `scale(${topBandeau.object_scale || 1})`,
                transformOrigin: topBandeau.object_position || 'center center',
              }}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
          <div className="absolute inset-x-0 bottom-8 sm:bottom-10 md:bottom-14 translate-y-0 px-4 z-10">
            <div className="max-w-4xl mx-auto text-center">
              <ScrollReveal variant="fade">
                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#FF6D64] mb-4 drop-shadow-lg">
                  <span className="font-sans font-normal">Contactez</span>-
                  <span className="font-accent text-jour-fleuri-jaune">nous</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-[#FF6D64]">
                  {intro}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>
      )}

      <section className={`${topBandeau ? 'pt-16 md:pt-24' : 'py-16 md:py-24'} pb-16 md:pb-24 px-4 relative z-10`}>
        <div className="max-w-4xl mx-auto">
          {!topBandeau && (
            <ScrollReveal variant="fade">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-jour-fleuri-rose-poudre text-center mb-6 md:mb-8">
                <span className="font-sans font-normal text-[#FF6D64]">Contactez</span>-
                <span className="font-accent text-jour-fleuri-jaune">nous</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-center text-gray-700 mb-10 md:mb-16">
                {intro}
              </p>
            </ScrollReveal>
          )}

          <ScrollReveal variant="slide-up" delay={0.2}>
            <div className="bg-jour-fleuri-cream rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-14 shadow-2xl mb-10 md:mb-12 relative overflow-hidden">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-800 leading-relaxed text-center mb-8 md:mb-12 relative z-10 font-light">
                {formIntro}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div>
                  <label htmlFor="nom" className="block text-gray-800 font-semibold mb-3 text-lg">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="nom"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-jour-fleuri-coral focus:outline-none focus:ring-2 focus:ring-jour-fleuri-coral focus:ring-opacity-20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-800 font-semibold mb-3 text-lg">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-jour-fleuri-jaune focus:outline-none focus:ring-2 focus:ring-jour-fleuri-jaune focus:ring-opacity-20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="typeEvenement" className="block text-gray-800 font-semibold mb-3 text-lg">
                    Type d'événement
                  </label>
                  <select
                    id="typeEvenement"
                    required
                    value={formData.typeEvenement}
                    onChange={(e) => setFormData({ ...formData, typeEvenement: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-jour-fleuri-rose-poudre focus:outline-none focus:ring-2 focus:ring-jour-fleuri-rose-poudre focus:ring-opacity-20 transition-all duration-300"
                  >
                    <option value="">Sélectionnez un type</option>
                    <option value="mariage">Mariage</option>
                    <option value="anniversaire">Anniversaire</option>
                    <option value="bapteme">Baptême</option>
                    <option value="evenement-entreprise">Événement d'entreprise</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-gray-800 font-semibold mb-3 text-lg">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-jour-fleuri-coral focus:outline-none focus:ring-2 focus:ring-jour-fleuri-coral focus:ring-opacity-20 transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="lieu" className="block text-gray-800 font-semibold mb-3 text-lg">
                    Lieu (ville / lieu de l'événement)
                  </label>
                  <input
                    type="text"
                    id="lieu"
                    value={formData.lieu}
                    onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-jour-fleuri-coral focus:outline-none focus:ring-2 focus:ring-jour-fleuri-coral focus:ring-opacity-20 transition-all duration-300"
                    placeholder="Paris, Suresnes, Château de..."
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-800 font-semibold mb-3 text-lg">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-jour-fleuri-coral focus:outline-none focus:ring-2 focus:ring-jour-fleuri-coral focus:ring-opacity-20 transition-all duration-300 resize-none"
                  />
                </div>

                {submitStatus === 'success' && (
                  <div className="bg-jour-fleuri-rose-poudre text-white px-6 py-4 rounded-2xl shadow-lg">
                    Merci ! Votre message a été envoyé avec succès.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-jour-fleuri-coral text-white px-6 py-4 rounded-2xl shadow-lg">
                    Une erreur est survenue. Veuillez réessayer.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#FF6D64] hover:bg-[#FF857D] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-lg sm:text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-up" delay={0.4}>
            <div className="bg-jour-fleuri-jaune-pale rounded-[2rem] md:rounded-[3rem] p-6 sm:p-8 md:p-14 shadow-2xl">
              <h2 className="font-serif text-3xl sm:text-4xl text-jour-fleuri-coral text-center mb-8 md:mb-10">
                <span className="font-sans font-normal">Restons</span> en{' '}
                <span className="font-accent text-jour-fleuri-jaune">contact</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                <a
                  href="mailto:louisecarton@jourfleuri.com"
                  className="flex items-center gap-4 text-gray-800 hover:text-jour-fleuri-coral transition-colors group bg-white/70 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg min-h-[96px]"
                >
                  <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 shrink-0">
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <span className="text-base sm:text-lg md:text-xl font-medium break-all">
                    louisecarton@jourfleuri.com
                  </span>
                </a>
                <a
                  href="tel:0628255933"
                  className="flex items-center gap-4 text-gray-800 hover:text-jour-fleuri-coral transition-colors group bg-white/70 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg min-h-[96px]"
                >
                  <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 shrink-0">
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-gray-900" />
                  </div>
                  <span className="text-base sm:text-lg md:text-xl font-medium">06 28 25 59 33</span>
                </a>
                <a
                  href="https://www.instagram.com/jourfleuri_fleuriste/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-800 hover:text-jour-fleuri-coral transition-colors group bg-white/70 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg min-h-[96px] md:col-span-2 xl:col-span-1 md:justify-center xl:justify-start"
                >
                  <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 shrink-0">
                    <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <span className="text-base sm:text-lg md:text-xl font-medium">@jourfleuri</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
