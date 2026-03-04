import { useState, useEffect, FormEvent } from 'react';
import { Mail, Instagram } from 'lucide-react';
import { submitContactForm } from '../lib/supabase';
import ScrollReveal from '../components/ScrollReveal';
import { getPageContentForPage, type PageContent } from '../lib/supabase';

export default function Contact() {
  const [texts, setTexts] = useState<Record<string, PageContent>>({});
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
      const data = await getPageContentForPage('contact');
      const map: Record<string, PageContent> = {};
      data.forEach((item) => {
        map[item.section_key] = item;
      });
      setTexts(map);
    }
    void load();
  }, []);

  const intro =
    texts['contact_intro']?.body ?? 'Donnons vie à vos rêves floraux ensemble';
  const formIntro =
    texts['contact_form_intro']?.body ??
    "Vous avez un projet floral ? Racontez-moi votre univers, je serai ravie d'imaginer une création sur mesure pour votre événement.";

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
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal variant="fade">
            <h1 className="font-serif text-6xl md:text-7xl text-jour-fleuri-rose-poudre text-center mb-8">
              <span className="font-serif text-jour-fleuri-coral text-7xl md:text-8xl">Contactez</span>-nous
            </h1>
            <p className="text-xl text-center text-gray-700 mb-16">
              {intro}
            </p>
          </ScrollReveal>

          <ScrollReveal variant="slide-up" delay={0.2}>
            <div className="bg-jour-fleuri-cream rounded-[3rem] p-10 md:p-14 shadow-2xl mb-12 relative overflow-hidden">
              <p className="text-2xl text-gray-800 leading-relaxed text-center mb-12 relative z-10 font-light">
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
                  className="w-full bg-jour-fleuri-coral hover:bg-jour-fleuri-coral-clair text-white px-10 py-5 rounded-full text-xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-up" delay={0.4}>
            <div className="bg-jour-fleuri-jaune-pale rounded-[3rem] p-10 md:p-14 shadow-2xl">
              <h2 className="font-serif text-4xl text-jour-fleuri-coral text-center mb-10">
                Restons en <span className="font-serif text-jour-fleuri-jaune text-5xl">contact</span>
              </h2>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <a
                  href="mailto:louisecarton@jourfleuri.com"
                  className="flex items-center gap-4 text-gray-800 hover:text-jour-fleuri-coral transition-colors group"
                >
                  <div className="p-4 bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Mail className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-medium">louisecarton@jourfleuri.com</span>
                </a>
                <a
                  href="tel:0628255933"
                  className="flex items-center gap-4 text-gray-800 hover:text-jour-fleuri-coral transition-colors group"
                >
                  <div className="p-4 bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-lg font-semibold">📞</span>
                  </div>
                  <span className="text-xl font-medium">06 28 25 59 33</span>
                </a>
                <a
                  href="https://www.instagram.com/jourfleuri_fleuriste/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 text-gray-800 hover:text-jour-fleuri-coral transition-colors group"
                >
                  <div className="p-4 bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Instagram className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-medium">@jourfleuri</span>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
