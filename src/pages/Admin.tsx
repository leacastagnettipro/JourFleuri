import { useEffect, useState, FormEvent } from 'react';
import {
  supabase,
  getPageContentForPage,
  upsertPageContentItem,
  getPageImagesForPage,
  upsertPageImageFile,
  updatePageImageMeta,
  deletePageImage,
  getAllServicesForAdmin,
  createService,
  updateService,
  deleteService,
  reorderServices,
  uploadServiceImage,
  type Service,
  getGalleryCategories,
  getGalleryImagesForAdmin,
  createGalleryCategory,
  updateGalleryCategory,
  deleteGalleryCategory,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
  type GalleryCategory,
  type GalleryImage,
  type PageContent,
  type PageImage,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAllSocialReviews,
  createSocialReview,
  updateSocialReview,
  deleteSocialReview,
  type Testimonial,
  type SocialReview,
  getContactSubmissions,
  updateContactStatus,
  type ContactFormEntry,
} from '../lib/supabase';
import ScrollReveal from '../components/ScrollReveal';

type AdminView =
  | 'dashboard'
  | 'texts'
  | 'pageImages'
  | 'services'
  | 'gallery'
  | 'reviews'
  | 'contacts';

interface AdminUserRow {
  role: 'owner' | 'developer';
}

interface EditableService extends Service {}

interface EditableGalleryCategory extends GalleryCategory {}

interface EditableGalleryImage extends GalleryImage {}

interface EditableTestimonial extends Testimonial {}

interface EditableSocialReview extends SocialReview {}

interface EditableContactEntry extends ContactFormEntry {}

interface EditablePageContent extends PageContent {}

interface EditablePageImage extends PageImage {}

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [sessionExists, setSessionExists] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState<AdminView>('dashboard');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const { data } = await supabase.auth.getSession();
      const hasSession = !!data.session;
      if (!mounted) return;

      setSessionExists(hasSession);

      if (hasSession) {
        await checkAdmin(data.session.user.id);
      }

      setLoading(false);

      supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        const active = !!session;
        setSessionExists(active);
        if (active && session) {
          void checkAdmin(session.user.id);
        } else {
          setIsAdmin(false);
        }
      });
    }

    void initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  async function checkAdmin(userId: string) {
    setCheckingAdmin(true);
    const { data, error } = await supabase
      .from('admin_users')
      .select<AdminUserRow>('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      // On log seulement côté console pour ne pas exposer de détails techniques.
      console.error('Erreur lors de la vérification admin:', error);
      setIsAdmin(false);
    } else {
      setIsAdmin(!!data);
    }
    setCheckingAdmin(false);
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setAuthError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError('Identifiants invalides. Merci de vérifier votre email et votre mot de passe.');
      return;
    }

    setEmail('');
    setPassword('');
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setSessionExists(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-jour-fleuri-cream flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!sessionExists || !isAdmin) {
    return (
      <div className="min-h-screen bg-jour-fleuri-cream flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <ScrollReveal variant="fade">
            <h1 className="font-serif text-3xl text-jour-fleuri-coral text-center mb-6">
              Accès administrateur
            </h1>
          </ScrollReveal>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-jour-fleuri-coral focus:ring-2 focus:ring-jour-fleuri-coral focus:ring-opacity-20 transition-all duration-300"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-jour-fleuri-coral focus:ring-2 focus:ring-jour-fleuri-coral focus:ring-opacity-20 transition-all duration-300"
              />
            </div>

            {authError && (
              <p className="text-sm text-red-600">
                {authError}
              </p>
            )}

            {sessionExists && !isAdmin && !checkingAdmin && (
              <p className="text-sm text-red-600">
                Vous êtes connecté·e mais vous n&apos;avez pas les droits administrateur.
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-jour-fleuri-coral hover:bg-jour-fleuri-coral-clair text-white px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jour-fleuri-cream py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-jour-fleuri-coral">
              Tableau de bord Jour Fleuri
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les textes et les visuels de votre site.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start md:self-auto px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Se déconnecter
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'dashboard', label: 'Vue d’ensemble' },
            { id: 'texts', label: 'Textes du site' },
            { id: 'pageImages', label: 'Images des pages' },
            { id: 'services', label: 'Services' },
            { id: 'gallery', label: 'Galerie' },
            { id: 'reviews', label: 'Avis & témoignages' },
            { id: 'contacts', label: 'Demandes de contact' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as AdminView)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                view === tab.id
                  ? 'bg-jour-fleuri-coral text-white shadow-md'
                  : 'bg-jour-fleuri-cream text-gray-700 hover:bg-jour-fleuri-rose-pale'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {view === 'dashboard' && (
          <div className="space-y-4 text-gray-700">
            <p>
              Bienvenue dans l’espace administrateur. Les sections &quot;Textes du site&quot;, &quot;Services&quot;
              et &quot;Galerie&quot; seront progressivement enrichies pour vous permettre de modifier le contenu
              sans intervention technique.
            </p>
          </div>
        )}

        {view === 'texts' && <TextsAdminSection />}

        {view === 'pageImages' && <PageImagesAdminSection />}

        {view === 'services' && <ServicesAdminSection />}

        {view === 'gallery' && <GalleryAdminSection />}

        {view === 'reviews' && <ReviewsAdminSection />}

        {view === 'contacts' && <ContactsAdminSection />}
      </div>
    </div>
  );
}

function ServicesAdminSection() {
  const [services, setServices] = useState<EditableService[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    id: '' as string | null,
    title: '',
    description: '',
    cta_label: 'Demander un devis',
    image_url: '',
    color_variant: 'soft-coral',
    is_visible: true,
  });
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    const data = await getAllServicesForAdmin();
    setServices(data);
    setLoading(false);
  }

  function resetForm() {
    setForm({
      id: null,
      title: '',
      description: '',
      cta_label: 'Demander un devis',
      image_url: '',
      color_variant: 'soft-coral',
      is_visible: true,
    });
    setImageFile(null);
    setFormMode('create');
    setError(null);
    setSuccess(null);
  }

  function handleEdit(service: EditableService) {
    setForm({
      id: service.id,
      title: service.title,
      description: service.description,
      cta_label: service.cta_label,
      image_url: service.image_url || '',
      color_variant: service.color_variant || 'soft-coral',
      is_visible: service.is_visible,
    });
    setFormMode('edit');
    setError(null);
    setSuccess(null);
    setImageFile(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.title.trim() || !form.description.trim()) {
      setError('Merci de renseigner au minimum un titre et une description.');
      return;
    }

    let finalImageUrl: string | null = form.image_url.trim() || null;

    if (imageFile) {
      const uploadedUrl = await uploadServiceImage(imageFile);
      if (!uploadedUrl) {
        setError("Erreur lors de l'upload de l’image du service.");
        return;
      }
      finalImageUrl = uploadedUrl;
    }

    if (formMode === 'create') {
      const ok = await createService({
        title: form.title.trim(),
        description: form.description.trim(),
        cta_label: form.cta_label.trim() || 'Demander un devis',
        image_url: finalImageUrl,
        color_variant: form.color_variant,
        is_visible: form.is_visible,
        order: services.length,
      });

      if (!ok) {
        setError('Erreur lors de la création du service.');
        return;
      }

      setSuccess('Service ajouté avec succès.');
      resetForm();
      await loadServices();
    } else if (form.id) {
      const ok = await updateService(form.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        cta_label: form.cta_label.trim() || 'Demander un devis',
        image_url: finalImageUrl,
        color_variant: form.color_variant,
        is_visible: form.is_visible,
      });

      if (!ok) {
        setError('Erreur lors de la mise à jour du service.');
        return;
      }

      setSuccess('Service mis à jour avec succès.');
      await loadServices();
    }

    setImageFile(null);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Supprimer ce service ? Cette action est irréversible.')) return;

    setError(null);
    setSuccess(null);

    const ok = await deleteService(id);
    if (!ok) {
      setError('Erreur lors de la suppression du service.');
      return;
    }

    setSuccess('Service supprimé avec succès.');
    await loadServices();
  }

  function moveService(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= services.length) return;

    const updated = [...services];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setServices(updated);
  }

  async function saveOrder() {
    setSavingOrder(true);
    setError(null);
    setSuccess(null);

    const ok = await reorderServices(services.map((s) => s.id));
    if (!ok) {
      setError('Erreur lors de l’enregistrement de l’ordre.');
    } else {
      setSuccess('Ordre enregistré avec succès.');
    }
    setSavingOrder(false);
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="font-semibold text-lg mb-4 text-gray-900">
          Services affichés sur le site
        </h2>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <p className="text-gray-600 text-sm">
            Aucun service pour le moment. Ajoutez votre premier service avec le formulaire à droite.
          </p>
        ) : (
          <div className="space-y-3">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="border border-gray-200 rounded-2xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">#{index + 1}</p>
                    <h3 className="font-medium text-gray-900">
                      {service.title}
                    </h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${service.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                    {service.is_visible ? 'Visible' : 'Masqué'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => moveService(index, 'up')}
                    disabled={index === 0}
                    className="px-3 py-1 text-xs rounded-full border border-gray-200 text-gray-700 disabled:opacity-40"
                  >
                    Monter
                  </button>
                  <button
                    type="button"
                    onClick={() => moveService(index, 'down')}
                    disabled={index === services.length - 1}
                    className="px-3 py-1 text-xs rounded-full border border-gray-200 text-gray-700 disabled:opacity-40"
                  >
                    Descendre
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(service)}
                    className="px-3 py-1 text-xs rounded-full border border-jour-fleuri-coral text-jour-fleuri-coral"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(service.id)}
                    className="px-3 py-1 text-xs rounded-full border border-red-200 text-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}

            {services.length > 1 && (
              <button
                type="button"
                onClick={saveOrder}
                disabled={savingOrder}
                className="mt-2 px-4 py-2 rounded-full bg-jour-fleuri-coral text-white text-sm font-medium hover:bg-jour-fleuri-coral-clair disabled:opacity-60"
              >
                {savingOrder ? 'Enregistrement...' : 'Enregistrer l’ordre'}
              </button>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-semibold text-lg mb-4 text-gray-900">
          {formMode === 'create' ? 'Ajouter un service' : 'Modifier le service'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre du service
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-jour-fleuri-coral focus:ring-2 focus:ring-jour-fleuri-coral focus:ring-opacity-20 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-jour-fleuri-coral focus:ring-2 focus:ring-jour-fleuri-coral focus:ring-opacity-20 text-sm resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texte du bouton (CTA)
            </label>
            <input
              type="text"
              value={form.cta_label}
              onChange={(e) => setForm((prev) => ({ ...prev, cta_label: e.target.value }))}
              className="w-full px-4 py-2 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-jour-fleuri-jaune focus:ring-2 focus:ring-jour-fleuri-jaune focus:ring-opacity-20 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image d’illustration
            </label>
            {form.image_url && (
              <div className="mb-2">
                <p className="text-xs text-gray-500 mb-1">Image actuelle :</p>
                <img
                  src={form.image_url}
                  alt={form.title}
                  className="w-full max-h-48 object-cover rounded-2xl border border-gray-200"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
            <p className="mt-1 text-xs text-gray-500">
              Choisissez une image pour ce service. Si vous n’en sélectionnez pas, l’image actuelle
              (ou une image par défaut) sera utilisée.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Palette de couleurs
            </label>
            <select
              value={form.color_variant}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, color_variant: e.target.value }))
              }
              className="w-full px-4 py-2 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-jour-fleuri-coral focus:ring-2 focus:ring-jour-fleuri-coral focus:ring-opacity-20 text-sm bg-white"
            >
              <option value="soft-coral">Fond rose pâle / titre corail</option>
              <option value="soft-yellow">Fond jaune pâle / titre jaune</option>
              <option value="soft-pink">Fond rose poudré / titre rose poudré</option>
              <option value="cream">Fond crème / titre corail</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="service-visible"
              type="checkbox"
              checked={form.is_visible}
              onChange={(e) => setForm((prev) => ({ ...prev, is_visible: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-jour-fleuri-coral focus:ring-jour-fleuri-coral"
            />
            <label htmlFor="service-visible" className="text-sm text-gray-700">
              Afficher ce service sur le site
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-jour-fleuri-coral text-white text-sm font-semibold hover:bg-jour-fleuri-coral-clair"
            >
              {formMode === 'create' ? 'Ajouter le service' : 'Enregistrer les modifications'}
            </button>
            {formMode === 'edit' && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
              >
                Annuler la modification
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function TextsAdminSection() {
  const [page, setPage] = useState<'home' | 'about' | 'services' | 'contact'>('home');
  const [items, setItems] = useState<Record<string, EditablePageContent>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const config: Record<
    typeof page,
    {
      key: string;
      label: string;
      help?: string;
      defaultTitle?: string;
      defaultBody: string;
    }[]
  > = {
    home: [
      {
        key: 'home_intro',
        label: 'Accueil – paragraphe d’introduction',
        defaultBody:
          "Jour Fleuri imagine des créations florales délicates et colorées pour sublimer vos événements, en privilégiant les fleurs de saison et une approche responsable.",
      },
    ],
    about: [
      {
        key: 'about_story',
        label: 'À propos – texte “Mon histoire”',
        defaultBody:
          "Après une formation en enseignement, j'ai décidé de me reconvertir et de faire un CAP. Le but était d'y découvrir un métier manuel tout en me permettant d'exploiter la branche commerciale en restant au contact de l'humain. Après trois ans chez un fleuriste indépendant auprès duquel j'ai appris tout mon savoir-faire mais aussi découvert l'importance de la saisonnalité des fleurs, j'ai décidé de me lancer à mon compte en proposant d'accompagner les clients dans la décoration de leurs événements professionnels et particuliers.",
      },
      {
        key: 'about_value_1',
        label: 'Valeur 1',
        defaultBody:
          'Accompagner les clients dans tous leurs projets en créant une relation de confiance.',
      },
      {
        key: 'about_value_2',
        label: 'Valeur 2',
        defaultBody: 'Travailler avec des fleurs de saison.',
      },
      {
        key: 'about_value_3',
        label: 'Valeur 3',
        defaultBody: 'Proposer des créations sur mesure.',
      },
      {
        key: 'about_value_4',
        label: 'Valeur 4',
        defaultBody: 'Favoriser des produits locaux.',
      },
    ],
    services: [
      {
        key: 'services_intro',
        label: 'Services – texte d’introduction',
        defaultBody:
          'Des créations florales sur mesure pour tous vos événements.',
      },
      {
        key: 'services_cta_block',
        label: 'Services – texte du bloc final',
        defaultBody:
          'Contactez-nous pour discuter de vos besoins et recevoir un devis personnalisé.',
      },
    ],
    contact: [
      {
        key: 'contact_intro',
        label: 'Contact – sous-titre sous le titre principal',
        defaultBody: 'Donnons vie à vos rêves floraux ensemble.',
      },
      {
        key: 'contact_form_intro',
        label: 'Contact – texte au-dessus du formulaire',
        defaultBody:
          'Vous avez un projet floral ? Racontez-moi votre univers, je serai ravie d’imaginer une création sur mesure pour votre événement.',
      },
    ],
  };

  useEffect(() => {
    void loadPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function loadPage(target: typeof page) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const data = await getPageContentForPage(target);
    const map: Record<string, EditablePageContent> = {};
    data.forEach((item) => {
      map[item.section_key] = item;
    });
    setItems(map);
    setLoading(false);
  }

  async function handleSave(sectionKey: string, body: string) {
    setSavingKey(sectionKey);
    setError(null);
    setSuccess(null);
    const ok = await upsertPageContentItem(page, sectionKey, { body });
    if (!ok) {
      setError('Erreur lors de la sauvegarde du texte.');
    } else {
      setSuccess('Texte enregistré avec succès.');
      await loadPage(page);
    }
    setSavingKey(null);
  }

  const sections = config[page];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'home', label: 'Accueil' },
          { id: 'about', label: 'À propos' },
          { id: 'services', label: 'Services' },
          { id: 'contact', label: 'Contact' },
        ].map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPage(p.id as typeof page)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              page === p.id
                ? 'bg-jour-fleuri-coral text-white shadow-md'
                : 'bg-jour-fleuri-cream text-gray-700 hover:bg-jour-fleuri-rose-pale'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="w-8 h-8 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          {sections.map((section) => {
            const current = items[section.key];
            const value = current?.body ?? section.defaultBody;
            return (
              <div
                key={section.key}
                className="border border-gray-200 rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                    {section.label}
                  </h3>
                </div>
                {section.help && (
                  <p className="text-xs text-gray-500">{section.help}</p>
                )}
                <textarea
                  rows={4}
                  defaultValue={value}
                  onBlur={(e) => {
                    // optionnel: auto-save au blur plus tard
                  }}
                  onChange={(e) => {
                    setItems((prev) => ({
                      ...prev,
                      [section.key]: {
                        ...(current || {
                          id: '',
                          page,
                          section_key: section.key,
                          title: null,
                          body: null,
                          cta_label: null,
                          cta_url: null,
                          order: 0,
                          created_at: '',
                        }),
                        body: e.target.value,
                      },
                    }));
                  }}
                  className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-sm focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleSave(section.key, items[section.key]?.body ?? value)
                  }
                  disabled={savingKey === section.key}
                  className="px-4 py-2 rounded-full bg-jour-fleuri-coral text-white text-xs font-semibold hover:bg-jour-fleuri-coral-clair disabled:opacity-60"
                >
                  {savingKey === section.key ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PageImagesAdminSection() {
  type PageKey = 'about';

  const [page] = useState<PageKey>('about');
  const [items, setItems] = useState<Record<string, EditablePageImage>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [alts, setAlts] = useState<Record<string, string>>({});

  const config: Record<
    PageKey,
    {
      key: string;
      label: string;
      defaultUrl: string;
      defaultAlt: string;
    }[]
  > = {
    about: [
      {
        key: 'about_main',
        label: 'À propos – image principale (en haut)',
        defaultUrl:
          'https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=1200',
        defaultAlt: 'Création florale',
      },
      {
        key: 'about_bottom_left',
        label: 'À propos – image en bas à gauche',
        defaultUrl:
          'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200',
        defaultAlt: 'Bouquet de mariée',
      },
      {
        key: 'about_bottom_right',
        label: 'À propos – image en bas à droite',
        defaultUrl:
          'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1200',
        defaultAlt: 'Composition florale champêtre',
      },
    ],
  };

  useEffect(() => {
    void loadPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function loadPage(target: PageKey) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const data = await getPageImagesForPage(target);
    const map: Record<string, EditablePageImage> = {};
    data.forEach((item) => {
      map[item.section_key] = item;
    });
    setItems(map);
    setLoading(false);
  }

  async function handleSave(sectionKey: string) {
    const sectionConfig = config[page].find((s) => s.key === sectionKey);
    if (!sectionConfig) return;

    const file = files[sectionKey] || null;
    const existing = items[sectionKey];
    const altText =
      (alts[sectionKey] || existing?.alt || sectionConfig.defaultAlt).trim();

    if (!file && !existing) {
      setError('Merci de choisir un fichier image avant d’enregistrer.');
      return;
    }

    setSavingKey(sectionKey);
    setError(null);
    setSuccess(null);

    let ok = true;

    if (file) {
      ok = await upsertPageImageFile(file, page, sectionKey, altText);
    } else if (existing) {
      ok = await updatePageImageMeta(existing.id, { alt: altText });
    }

    if (!ok) {
      setError('Erreur lors de l’enregistrement de l’image.');
      setSavingKey(null);
      return;
    }

    setSuccess('Image enregistrée avec succès.');
    setFiles((prev) => ({ ...prev, [sectionKey]: null }));
    setAlts((prev) => ({ ...prev, [sectionKey]: '' }));
    await loadPage(page);
    setSavingKey(null);
  }

  async function handleDelete(sectionKey: string) {
    const current = items[sectionKey];
    if (!current) return;

    if (
      !window.confirm(
        'Supprimer cette image personnalisée ? La photo par défaut réapparaîtra sur le site.'
      )
    ) {
      return;
    }

    setError(null);
    setSuccess(null);

    const ok = await deletePageImage(current.id);
    if (!ok) {
      setError('Erreur lors de la suppression de l’image.');
      return;
    }

    setSuccess('Image supprimée, la photo par défaut sera utilisée.');
    await loadPage(page);
  }

  const sections = config[page];

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-700">
        Ici, vous pouvez remplacer les photos utilisées sur les pages du site. Pour le moment, la
        page &quot;À propos&quot; est configurable. Les images de la galerie restent gérées dans
        l’onglet &quot;Galerie&quot;.
      </p>

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="w-8 h-8 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          {sections.map((section) => {
            const current = items[section.key];
            const previewUrl = current?.url || section.defaultUrl;
            const altValue =
              alts[section.key] || current?.alt || section.defaultAlt;

            return (
              <div
                key={section.key}
                className="border border-gray-200 rounded-2xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                    {section.label}
                  </h3>
                  {current && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                      Image personnalisée
                    </span>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 items-center">
                  <div className="rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
                    <img
                      src={previewUrl}
                      alt={altValue}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Fichier image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setFiles((prev) => ({
                            ...prev,
                            [section.key]: e.target.files?.[0] || null,
                          }))
                        }
                        className="w-full text-xs"
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        Formats recommandés : JPG ou PNG, taille raisonnable (&lt; 2–3 Mo).
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Texte alternatif (description de l’image)
                      </label>
                      <input
                        type="text"
                        value={altValue}
                        onChange={(e) =>
                          setAlts((prev) => ({
                            ...prev,
                            [section.key]: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleSave(section.key)}
                        disabled={savingKey === section.key}
                        className="px-4 py-2 rounded-full bg-jour-fleuri-coral text-white text-xs font-semibold hover:bg-jour-fleuri-coral-clair disabled:opacity-60"
                      >
                        {savingKey === section.key
                          ? 'Enregistrement...'
                          : 'Enregistrer cette image'}
                      </button>
                      {current && (
                        <button
                          type="button"
                          onClick={() => handleDelete(section.key)}
                          className="px-3 py-2 rounded-full border border-red-200 text-xs text-red-600 hover:bg-red-50"
                        >
                          Supprimer l’image personnalisée
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GalleryAdminSection() {
  const [categories, setCategories] = useState<EditableGalleryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<EditableGalleryCategory | null>(null);
  const [images, setImages] = useState<EditableGalleryImage[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    id: '' as string | null,
    label: '',
    slug: '',
  });
  const [categoryMode, setCategoryMode] = useState<'create' | 'edit'>('create');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    void loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      void loadImages(selectedCategory.slug);
    } else {
      setImages([]);
    }
  }, [selectedCategory?.id]);

  async function loadCategories() {
    setLoadingCategories(true);
    const data = await getGalleryCategories();
    setCategories(data);
    setLoadingCategories(false);

    if (!selectedCategory && data.length > 0) {
      setSelectedCategory(data[0]);
    }
  }

  async function loadImages(categorySlug: string) {
    setLoadingImages(true);
    const data = await getGalleryImagesForAdmin(categorySlug);
    setImages(data);
    setLoadingImages(false);
  }

  function resetCategoryForm() {
    setCategoryForm({
      id: null,
      label: '',
      slug: '',
    });
    setCategoryMode('create');
  }

  function handleCategoryEdit(category: EditableGalleryCategory) {
    setCategoryForm({
      id: category.id,
      label: category.label,
      slug: category.slug,
    });
    setCategoryMode('edit');
  }

  async function handleCategorySubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!categoryForm.label.trim() || !categoryForm.slug.trim()) {
      setError('Merci de renseigner un nom et un identifiant pour la catégorie.');
      return;
    }

    const normalizedSlug = categoryForm.slug.trim().toLowerCase().replace(/\s+/g, '-');

    if (categoryMode === 'create') {
      const ok = await createGalleryCategory({
        label: categoryForm.label.trim(),
        slug: normalizedSlug,
        order: categories.length,
      });

      if (!ok) {
        setError('Erreur lors de la création de la catégorie.');
        return;
      }

      setSuccess('Catégorie créée avec succès.');
      resetCategoryForm();
      await loadCategories();
    } else if (categoryForm.id) {
      const ok = await updateGalleryCategory(categoryForm.id, {
        label: categoryForm.label.trim(),
        slug: normalizedSlug,
      });

      if (!ok) {
        setError('Erreur lors de la mise à jour de la catégorie.');
        return;
      }

      setSuccess('Catégorie mise à jour avec succès.');
      resetCategoryForm();
      await loadCategories();
    }
  }

  async function handleCategoryDelete(id: string) {
    if (
      !window.confirm(
        'Supprimer cette catégorie ? Les images déjà associées conserveront leur catégorie dans la base.'
      )
    ) {
      return;
    }

    setError(null);
    setSuccess(null);

    const ok = await deleteGalleryCategory(id);
    if (!ok) {
      setError('Erreur lors de la suppression de la catégorie.');
      return;
    }

    if (selectedCategory?.id === id) {
      setSelectedCategory(null);
    }

    setSuccess('Catégorie supprimée avec succès.');
    await loadCategories();
  }

  function moveImage(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updated = [...images];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setImages(updated);
  }

  async function saveImageOrder() {
    if (!selectedCategory) return;

    setSavingOrder(true);
    setError(null);
    setSuccess(null);

    const ok = await reorderGalleryImages(images.map((img) => img.id));
    if (!ok) {
      setError('Erreur lors de l’enregistrement de l’ordre des images.');
    } else {
      setSuccess('Ordre des images enregistré avec succès.');
      await loadImages(selectedCategory.slug);
    }
    setSavingOrder(false);
  }

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedCategory) {
      setError('Merci de sélectionner une catégorie avant d’ajouter des images.');
      return;
    }

    if (!uploadFile) {
      setError('Merci de choisir un fichier image.');
      return;
    }

    const ok = await createGalleryImage(
      uploadFile,
      selectedCategory.slug,
      uploadAlt.trim() || selectedCategory.label
    );

    if (!ok) {
      setError('Erreur lors de l’upload de l’image.');
      return;
    }

    setUploadFile(null);
    setUploadAlt('');
    (e.target as HTMLFormElement).reset?.();

    setSuccess('Image ajoutée avec succès.');
    await loadImages(selectedCategory.slug);
  }

  async function handleImageVisibilityToggle(image: EditableGalleryImage) {
    const ok = await updateGalleryImage(image.id, { is_visible: !image.is_visible });
    if (!ok) {
      setError('Erreur lors de la mise à jour de la visibilité.');
      return;
    }

    if (selectedCategory) {
      await loadImages(selectedCategory.slug);
    } else {
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, is_visible: !img.is_visible } : img
        )
      );
    }
  }

  async function handleImageFeaturedToggle(image: EditableGalleryImage) {
    const ok = await updateGalleryImage(image.id, { is_featured: !image.is_featured });
    if (!ok) {
      setError('Erreur lors de la mise à jour du statut vedette.');
      return;
    }

    if (selectedCategory) {
      await loadImages(selectedCategory.slug);
    } else {
      setImages((prev) =>
        prev.map((img) =>
          img.id === image.id ? { ...img, is_featured: !img.is_featured } : img
        )
      );
    }
  }

  async function handleImageDelete(id: string) {
    if (!window.confirm('Supprimer cette image de la galerie ?')) return;

    const ok = await deleteGalleryImage(id);
    if (!ok) {
      setError('Erreur lors de la suppression de l’image.');
      return;
    }

    setImages((prev) => prev.filter((img) => img.id !== id));
    setSuccess('Image supprimée avec succès.');
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <h2 className="font-semibold text-lg text-gray-900">Catégories</h2>

        {loadingCategories ? (
          <div className="py-6 flex justify-center">
            <div className="w-8 h-8 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-600">
            Aucune catégorie pour le moment. Créez votre première catégorie avec le formulaire
            ci-dessous (par exemple &quot;Mariages&quot;).
          </p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-2xl text-sm border ${
                  selectedCategory?.id === cat.id
                    ? 'bg-jour-fleuri-coral text-white border-jour-fleuri-coral'
                    : 'bg-jour-fleuri-cream text-gray-800 border-gray-200 hover:bg-jour-fleuri-rose-pale'
                }`}
              >
                <span>{cat.label}</span>
                <span className="text-xs opacity-75">{cat.slug}</span>
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-medium text-sm text-gray-900 mb-2">
            {categoryMode === 'create' ? 'Ajouter une catégorie' : 'Modifier la catégorie'}
          </h3>
          <form onSubmit={handleCategorySubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nom affiché
              </label>
              <input
                type="text"
                value={categoryForm.label}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, label: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Identifiant (slug)
              </label>
              <input
                type="text"
                value={categoryForm.slug}
                onChange={(e) =>
                  setCategoryForm((prev) => ({ ...prev, slug: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                placeholder="mariages, compositions..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-jour-fleuri-coral text-white text-xs font-semibold hover:bg-jour-fleuri-coral-clair"
              >
                {categoryMode === 'create' ? 'Ajouter' : 'Enregistrer'}
              </button>
              {categoryMode === 'edit' && (
                <button
                  type="button"
                  onClick={resetCategoryForm}
                  className="px-3 py-2 rounded-full border border-gray-300 text-xs text-gray-700 hover:bg-gray-100"
                >
                  Annuler
                </button>
              )}
              {categoryMode === 'edit' && categoryForm.id && (
                <button
                  type="button"
                  onClick={() => handleCategoryDelete(categoryForm.id!)}
                  className="px-3 py-2 rounded-full border border-red-200 text-xs text-red-600 hover:bg-red-50"
                >
                  Supprimer
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <h2 className="font-semibold text-lg text-gray-900">
          Images de la catégorie {selectedCategory ? `"${selectedCategory.label}"` : ''}
        </h2>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        <form onSubmit={handleUpload} className="bg-jour-fleuri-cream rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Fichier image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="w-full text-xs"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Texte alternatif (description)
            </label>
            <input
              type="text"
              value={uploadAlt}
              onChange={(e) => setUploadAlt(e.target.value)}
              className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
              placeholder="Bouquet de mariée champêtre..."
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-jour-fleuri-coral text-white text-xs font-semibold hover:bg-jour-fleuri-coral-clair"
          >
            Ajouter l’image
          </button>
        </form>

        {loadingImages ? (
          <div className="py-8 flex justify-center">
            <div className="w-8 h-8 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <p className="text-sm text-gray-600">
            Aucune image dans cette catégorie pour le moment.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 space-y-2 flex-1 flex flex-col">
                  <p className="text-xs text-gray-800 line-clamp-2">{image.alt}</p>
                  <div className="flex flex-wrap gap-1 mt-auto items-center">
                    {image.is_featured && (
                      <span className="px-2 py-1 rounded-full bg-jour-fleuri-jaune text-[10px] font-semibold text-white">
                        Vedette
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 rounded-full border border-gray-200 text-[11px] text-gray-700 disabled:opacity-40"
                    >
                      Monter
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 'down')}
                      disabled={index === images.length - 1}
                      className="px-2 py-1 rounded-full border border-gray-200 text-[11px] text-gray-700 disabled:opacity-40"
                    >
                      Descendre
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImageVisibilityToggle(image)}
                      className={`px-2 py-1 rounded-full border text-[11px] ${
                        image.is_visible
                          ? 'border-green-200 text-green-700'
                          : 'border-gray-300 text-gray-600'
                      }`}
                    >
                      {image.is_visible ? 'Visible' : 'Masqué'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImageFeaturedToggle(image)}
                      className="px-2 py-1 rounded-full border border-jour-fleuri-jaune text-[11px] text-jour-fleuri-jaune"
                    >
                      {image.is_featured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImageDelete(image.id)}
                      className="px-2 py-1 rounded-full border border-red-200 text-[11px] text-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <button
            type="button"
            onClick={saveImageOrder}
            disabled={savingOrder}
            className="mt-2 px-4 py-2 rounded-full bg-jour-fleuri-coral text-white text-xs font-semibold hover:bg-jour-fleuri-coral-clair disabled:opacity-60"
          >
            {savingOrder ? 'Enregistrement...' : 'Enregistrer l’ordre des images'}
          </button>
        )}
      </div>
    </div>
  );
}

function ReviewsAdminSection() {
  const [testimonials, setTestimonials] = useState<EditableTestimonial[]>([]);
  const [socialReviews, setSocialReviews] = useState<EditableSocialReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<{
    id: string | null;
    name: string;
    text: string;
    rating: number;
    event_type: string;
    is_featured: boolean;
  }>({
    id: null,
    name: '',
    text: '',
    rating: 5,
    event_type: 'mariage',
    is_featured: true,
  });
  const [socialForm, setSocialForm] = useState<{
    id: string | null;
    platform: SocialReview['platform'];
    author: string;
    content: string;
    rating: number | undefined;
    profile_url: string;
    posted_at: string;
  }>({
    id: null,
    platform: 'google',
    author: '',
    content: '',
    rating: 5,
    profile_url: '',
    posted_at: new Date().toISOString().slice(0, 10),
  });
  const [modeTestimonial, setModeTestimonial] = useState<'create' | 'edit'>('create');
  const [modeSocial, setModeSocial] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    void loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const [t, s] = await Promise.all([getAllTestimonials(), getAllSocialReviews()]);
    setTestimonials(t);
    setSocialReviews(s);
    setLoading(false);
  }

  async function handleSubmitTestimonial(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!testimonialForm.name.trim() || !testimonialForm.text.trim()) {
      setError('Merci de renseigner au minimum le nom et le texte du témoignage.');
      return;
    }

    const payload = {
      name: testimonialForm.name.trim(),
      text: testimonialForm.text.trim(),
      rating: testimonialForm.rating,
      event_type: testimonialForm.event_type || 'autre',
      avatar_url: null,
      is_featured: testimonialForm.is_featured,
    };

    let ok = false;
    if (modeTestimonial === 'create') {
      ok = await createTestimonial(payload as Omit<Testimonial, 'id' | 'created_at'>);
    } else if (testimonialForm.id) {
      ok = await updateTestimonial(testimonialForm.id, payload);
    }

    if (!ok) {
      setError('Erreur lors de la sauvegarde du témoignage.');
      return;
    }

    setSuccess('Témoignage enregistré avec succès.');
    setTestimonialForm({
      id: null,
      name: '',
      text: '',
      rating: 5,
      event_type: 'mariage',
      is_featured: true,
    });
    setModeTestimonial('create');
    await loadAll();
  }

  async function handleDeleteTestimonial(id: string) {
    if (!window.confirm('Supprimer ce témoignage ?')) return;
    setError(null);
    setSuccess(null);
    const ok = await deleteTestimonial(id);
    if (!ok) {
      setError('Erreur lors de la suppression du témoignage.');
      return;
    }
    setSuccess('Témoignage supprimé avec succès.');
    await loadAll();
  }

  function editTestimonial(t: EditableTestimonial) {
    setModeTestimonial('edit');
    setTestimonialForm({
      id: t.id,
      name: t.name,
      text: t.text,
      rating: t.rating,
      event_type: t.event_type,
      is_featured: t.is_featured,
    });
  }

  async function handleSubmitSocial(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!socialForm.author.trim() || !socialForm.content.trim()) {
      setError('Merci de renseigner au minimum l’auteur et le texte de l’avis.');
      return;
    }

    const payload = {
      platform: socialForm.platform,
      author: socialForm.author.trim(),
      content: socialForm.content.trim(),
      rating: socialForm.rating || null,
      profile_url: socialForm.profile_url.trim() || null,
      posted_at: new Date(socialForm.posted_at || new Date().toISOString()).toISOString(),
    };

    let ok = false;
    if (modeSocial === 'create') {
      ok = await createSocialReview(payload as Omit<SocialReview, 'id' | 'created_at'>);
    } else if (socialForm.id) {
      ok = await updateSocialReview(socialForm.id, payload);
    }

    if (!ok) {
      setError('Erreur lors de la sauvegarde de l’avis.');
      return;
    }

    setSuccess('Avis enregistré avec succès.');
    setSocialForm({
      id: null,
      platform: 'google',
      author: '',
      content: '',
      rating: 5,
      profile_url: '',
      posted_at: new Date().toISOString().slice(0, 10),
    });
    setModeSocial('create');
    await loadAll();
  }

  async function handleDeleteSocial(id: string) {
    if (!window.confirm('Supprimer cet avis ?')) return;
    setError(null);
    setSuccess(null);
    const ok = await deleteSocialReview(id);
    if (!ok) {
      setError('Erreur lors de la suppression de l’avis.');
      return;
    }
    setSuccess('Avis supprimé avec succès.');
    await loadAll();
  }

  function editSocial(r: EditableSocialReview) {
    setModeSocial('edit');
    setSocialForm({
      id: r.id,
      platform: r.platform,
      author: r.author,
      content: r.content,
      rating: r.rating,
      profile_url: r.profile_url ?? '',
      posted_at: r.posted_at.slice(0, 10),
    });
  }

  return (
    <div className="space-y-8">
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="w-8 h-8 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold text-lg mb-4 text-gray-900">Témoignages</h2>
              {testimonials.length === 0 ? (
                <p className="text-sm text-gray-600">
                  Aucun témoignage pour le moment.
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="border border-gray-200 rounded-2xl p-3 text-sm space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900">{t.name}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {t.event_type}
                          </p>
                        </div>
                        <div className="text-xs text-yellow-500">
                          {'★'.repeat(t.rating)}
                        </div>
                      </div>
                      <p className="text-gray-700 line-clamp-3">{t.text}</p>
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => editTestimonial(t)}
                          className="px-3 py-1 rounded-full border border-jour-fleuri-coral text-[11px] text-jour-fleuri-coral"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="px-3 py-1 rounded-full border border-red-200 text-[11px] text-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-4 text-gray-900">
                {modeTestimonial === 'create'
                  ? 'Ajouter un témoignage'
                  : 'Modifier le témoignage'}
              </h2>
              <form onSubmit={handleSubmitTestimonial} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    value={testimonialForm.name}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Texte
                  </label>
                  <textarea
                    rows={4}
                    value={testimonialForm.text}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({ ...prev, text: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Note (/5)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={testimonialForm.rating}
                      onChange={(e) =>
                        setTestimonialForm((prev) => ({
                          ...prev,
                          rating: Number(e.target.value) || 5,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Type d’événement
                    </label>
                    <select
                      value={testimonialForm.event_type}
                      onChange={(e) =>
                        setTestimonialForm((prev) => ({
                          ...prev,
                          event_type: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                    >
                      <option value="mariage">Mariage</option>
                      <option value="anniversaire">Anniversaire</option>
                      <option value="entreprise">Événement d’entreprise</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="testimonial-featured"
                    type="checkbox"
                    checked={testimonialForm.is_featured}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        is_featured: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-jour-fleuri-coral focus:ring-jour-fleuri-coral"
                  />
                  <label
                    htmlFor="testimonial-featured"
                    className="text-xs text-gray-700"
                  >
                    Afficher en priorité (page d’accueil)
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-jour-fleuri-coral text-white text-xs font-semibold hover:bg-jour-fleuri-coral-clair"
                  >
                    {modeTestimonial === 'create'
                      ? 'Ajouter le témoignage'
                      : 'Enregistrer les modifications'}
                  </button>
                  {modeTestimonial === 'edit' && (
                    <button
                      type="button"
                      onClick={() => {
                        setModeTestimonial('create');
                        setTestimonialForm({
                          id: null,
                          name: '',
                          text: '',
                          rating: 5,
                          event_type: 'mariage',
                          is_featured: true,
                        });
                      }}
                      className="px-3 py-2 rounded-full border border-gray-300 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="font-semibold text-lg mb-4 text-gray-900">
                Avis (Google, réseaux sociaux…)
              </h2>
              {socialReviews.length === 0 ? (
                <p className="text-sm text-gray-600">
                  Aucun avis pour le moment.
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {socialReviews.map((r) => (
                    <div
                      key={r.id}
                      className="border border-gray-200 rounded-2xl p-3 text-sm space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-1 rounded-full bg-jour-fleuri-coral text-white text-[11px] capitalize">
                          {r.platform}
                        </span>
                        {r.rating && (
                          <span className="text-xs text-yellow-500">
                            {'★'.repeat(r.rating)}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-gray-900">{r.author}</p>
                      <p className="text-gray-700 line-clamp-3">{r.content}</p>
                      {r.profile_url && (
                        <a
                          href={r.profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-jour-fleuri-coral underline"
                        >
                          Voir l’avis original
                        </a>
                      )}
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => editSocial(r)}
                          className="px-3 py-1 rounded-full border border-jour-fleuri-coral text-[11px] text-jour-fleuri-coral"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSocial(r.id)}
                          className="px-3 py-1 rounded-full border border-red-200 text-[11px] text-red-600"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-4 text-gray-900">
                {modeSocial === 'create'
                  ? 'Ajouter un avis'
                  : 'Modifier l’avis'}
              </h2>
              <form onSubmit={handleSubmitSocial} className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Plateforme
                    </label>
                    <select
                      value={socialForm.platform}
                      onChange={(e) =>
                        setSocialForm((prev) => ({
                          ...prev,
                          platform: e.target.value as SocialReview['platform'],
                        }))
                      }
                      className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                    >
                      <option value="google">Google</option>
                      <option value="instagram">Instagram</option>
                      <option value="facebook">Facebook</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={socialForm.posted_at}
                      onChange={(e) =>
                        setSocialForm((prev) => ({
                          ...prev,
                          posted_at: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Auteur
                  </label>
                  <input
                    type="text"
                    value={socialForm.author}
                    onChange={(e) =>
                      setSocialForm((prev) => ({
                        ...prev,
                        author: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Texte de l’avis
                  </label>
                  <textarea
                    rows={4}
                    value={socialForm.content}
                    onChange={(e) =>
                      setSocialForm((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Note (/5) – optionnelle
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={socialForm.rating ?? ''}
                      onChange={(e) =>
                        setSocialForm((prev) => ({
                          ...prev,
                          rating: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Lien vers l’avis (Google, etc.)
                    </label>
                    <input
                      type="url"
                      value={socialForm.profile_url}
                      onChange={(e) =>
                        setSocialForm((prev) => ({
                          ...prev,
                          profile_url: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 rounded-2xl border-2 border-gray-200 text-xs focus:outline-none focus:border-jour-fleuri-coral focus:ring-1 focus:ring-jour-fleuri-coral focus:ring-opacity-20"
                      placeholder="https://maps.app.goo.gl/…"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-jour-fleuri-coral text-white text-xs font-semibold hover:bg-jour-fleuri-coral-clair"
                  >
                    {modeSocial === 'create'
                      ? 'Ajouter l’avis'
                      : 'Enregistrer les modifications'}
                  </button>
                  {modeSocial === 'edit' && (
                    <button
                      type="button"
                      onClick={() => {
                        setModeSocial('create');
                        setSocialForm({
                          id: null,
                          platform: 'google',
                          author: '',
                          content: '',
                          rating: 5,
                          profile_url: '',
                          posted_at: new Date().toISOString().slice(0, 10),
                        });
                      }}
                      className="px-3 py-2 rounded-full border border-gray-300 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ContactsAdminSection() {
  const [entries, setEntries] = useState<EditableContactEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'nouveau' | 'lu' | 'traite'>('all');

  useEffect(() => {
    void loadEntries();
  }, []);

  async function loadEntries() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const data = await getContactSubmissions();
    setEntries(data);
    setLoading(false);
  }

  async function changeStatus(id: string, status: EditableContactEntry['status']) {
    setError(null);
    setSuccess(null);
    const ok = await updateContactStatus(id, status);
    if (!ok) {
      setError('Erreur lors de la mise à jour du statut.');
      return;
    }
    setSuccess('Statut mis à jour.');
    await loadEntries();
  }

  const filtered =
    filter === 'all' ? entries : entries.filter((e) => e.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <h2 className="font-semibold text-lg text-gray-900">
          Demandes de contact
        </h2>
        <div className="flex gap-2 text-xs">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'nouveau', label: 'Nouvelles' },
            { id: 'lu', label: 'Lues' },
            { id: 'traite', label: 'Traitées' },
          ].map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setFilter(b.id as typeof filter)}
              className={`px-3 py-1 rounded-full border ${
                filter === b.id
                  ? 'bg-jour-fleuri-coral text-white border-jour-fleuri-coral'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="w-8 h-8 border-4 border-jour-fleuri-coral border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-600">
          Aucune demande pour le moment.
        </p>
      ) : (
        <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="border border-gray-200 rounded-2xl p-4 text-sm space-y-2 bg-white"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{entry.nom}</p>
                  <p className="text-xs text-gray-500">
                    {entry.email} • {entry.type_evenement}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    entry.status === 'nouveau'
                      ? 'bg-jour-fleuri-jaune text-white'
                      : entry.status === 'lu'
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {entry.status === 'nouveau'
                    ? 'Nouveau'
                    : entry.status === 'lu'
                    ? 'Lu'
                    : 'Traité'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Reçue le {new Date(entry.created_at).toLocaleDateString('fr-FR')}
                {entry.date && ` • Événement le ${entry.date}`}
                {entry.lieu && ` • Lieu : ${entry.lieu}`}
              </p>
              <p className="text-gray-800 whitespace-pre-line">
                {entry.message}
              </p>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                {entry.status !== 'nouveau' && (
                  <button
                    type="button"
                    onClick={() => changeStatus(entry.id, 'nouveau')}
                    className="px-3 py-1 rounded-full border border-gray-200 text-gray-700"
                  >
                    Marquer comme nouveau
                  </button>
                )}
                {entry.status !== 'lu' && (
                  <button
                    type="button"
                    onClick={() => changeStatus(entry.id, 'lu')}
                    className="px-3 py-1 rounded-full border border-gray-200 text-gray-700"
                  >
                    Marquer comme lu
                  </button>
                )}
                {entry.status !== 'traite' && (
                  <button
                    type="button"
                    onClick={() => changeStatus(entry.id, 'traite')}
                    className="px-3 py-1 rounded-full border border-green-200 text-green-700"
                  >
                    Marquer comme traité
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const subject = encodeURIComponent(
                      'Réponse à votre demande – Jour Fleuri'
                    );
                    const body = encodeURIComponent(
                      `Bonjour ${entry.nom},\n\n`
                      + `Je fais suite à votre demande concernant un événement (${entry.type_evenement})`
                      + (entry.lieu ? ` à ${entry.lieu}` : '')
                      + `.\n\n`
                      + `--- Rappel de votre message ---\n`
                      + `${entry.message}\n\n`
                      + `Bien à vous,\nJour Fleuri`
                    );
                    window.location.href = `mailto:${entry.email}?subject=${subject}&body=${body}`;
                  }}
                  className="px-3 py-1 rounded-full border border-jour-fleuri-coral text-jour-fleuri-coral"
                >
                  Répondre par email
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


