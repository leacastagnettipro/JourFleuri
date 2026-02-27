import { useState, FormEvent } from 'react';
import { Mail, Instagram } from 'lucide-react';
import { submitContactForm } from '../lib/supabase';
import ScrollReveal from '../components/ScrollReveal';

export default function Contact() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    typeEvenement: '',
    date: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
        message: formData.message
      });

      if (success) {
        setSubmitStatus('success');
        setFormData({
          nom: '',
          email: '',
          typeEvenement: '',
          date: '',
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
              Donnons vie à vos rêves floraux ensemble
            </p>
          </ScrollReveal>

          <ScrollReveal variant="slide-up" delay={0.2}>
            <div className="bg-jour-fleuri-cream rounded-[3rem] p-10 md:p-14 shadow-2xl mb-12 relative overflow-hidden">
              <p className="text-2xl text-gray-800 leading-relaxed text-center mb-12 relative z-10 font-light">
                Vous avez un projet floral ? <span className="text-jour-fleuri-coral font-serif font-semibold text-3xl">Racontez-moi votre univers</span>, je serai ravie d'imaginer une
                création sur mesure pour votre événement.
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
                  href="mailto:contact@jourfleuri.fr"
                  className="flex items-center gap-4 text-gray-800 hover:text-jour-fleuri-coral transition-colors group"
                >
                  <div className="p-4 bg-white rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Mail className="w-8 h-8" />
                  </div>
                  <span className="text-xl font-medium">contact@jourfleuri.fr</span>
                </a>
                <a
                  href="https://instagram.com/jourfleuri"
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
