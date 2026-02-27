import ScrollReveal from '../components/ScrollReveal';
import ParallaxSection from '../components/ParallaxSection';

export default function About() {
  return (
    <div className="min-h-screen bg-jour-fleuri-rose-pale relative overflow-hidden">
      <section className="py-24 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal variant="fade">
            <h1 className="font-serif text-6xl md:text-7xl text-jour-fleuri-coral text-center mb-8">
              À propos de <span className="font-serif text-jour-fleuri-jaune text-7xl md:text-8xl">Jour Fleuri</span>
            </h1>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <ScrollReveal variant="slide-right" delay={0.2}>
              <ParallaxSection speed={0.3}>
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/1070850/pexels-photo-1070850.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Création florale"
                    loading="lazy"
                    className="relative rounded-[3rem] shadow-2xl w-full hover:shadow-3xl transition-all duration-500 hover:scale-105"
                  />
                </div>
              </ParallaxSection>
            </ScrollReveal>

            <ScrollReveal variant="slide-left" delay={0.3}>
              <div className="bg-jour-fleuri-cream rounded-[2rem] p-10 shadow-xl">
                <h2 className="font-serif text-4xl text-jour-fleuri-coral mb-6">Mon <span className="font-serif text-jour-fleuri-jaune text-5xl">histoire</span></h2>
                <p className="text-xl text-gray-800 leading-relaxed">
                  Après une formation en enseignement, j'ai décidé de me reconvertir et de faire un CAP. Le but était d'y découvrir un métier manuel mais tout en me permettant aussi d'exploiter la branche commercial en restant au contact de l'humain. 
                  Après 3ans chez un fleuriste indépendant auprès duquel j'ai appris tout mon savoir faire mais aussi où j'ai découvert l'importance de la saisonnalité des fleurs, j'ai décidé de me lancer à mon compte en proposant d'accompagner les clients dans la décoration de leurs évènements professionnels et particuliers. 

                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal variant="slide-up" delay={0.4}>
            <div className="bg-jour-fleuri-jaune-pale rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
              <h2 className="font-serif text-4xl text-jour-fleuri-coral text-center mb-16 relative z-10">
                Mes <span className="font-serif text-jour-fleuri-jaune text-5xl">valeurs</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-8">
                  <div className="flex items-start group">
                    <div className="w-12 h-12 bg-jour-fleuri-coral rounded-2xl flex items-center justify-center mr-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <p className="text-xl text-gray-800 pt-2">
                      Accompagner les clients dans tous leurs projets en créant une relation de confiance
                    </p>
                  </div>
                  <div className="flex items-start group">
                    <div className="w-12 h-12 bg-jour-fleuri-jaune rounded-2xl flex items-center justify-center mr-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <p className="text-xl text-gray-800 pt-2">
                      Travailler avec des fleurs de saison
                    </p>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="flex items-start group">
                    <div className="w-12 h-12 bg-jour-fleuri-bleu rounded-2xl flex items-center justify-center mr-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <p className="text-xl text-gray-800 pt-2">
                      Proposer des créations sur mesure
                    </p>
                  </div>
                  <div className="flex items-start group">
                    <div className="w-12 h-12 bg-jour-fleuri-coral-clair rounded-2xl flex items-center justify-center mr-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                    <p className="text-xl text-gray-800 pt-2">
                      Favoriser des produits locaux
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-16 grid md:grid-cols-2 gap-10">
            <ScrollReveal variant="slide-up" delay={0.2}>
              <ParallaxSection speed={0.2}>
                <div className="relative group">
                  <img
                    src="https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Bouquet de mariée"
                    loading="lazy"
                    className="relative rounded-[3rem] shadow-xl w-full h-96 object-cover group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105"
                  />
                </div>
              </ParallaxSection>
            </ScrollReveal>

            <ScrollReveal variant="slide-up" delay={0.3}>
              <ParallaxSection speed={0.2}>
                <div className="relative group">
                  <img
                    src="https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Composition florale champêtre"
                    loading="lazy"
                    className="relative rounded-[3rem] shadow-xl w-full h-96 object-cover group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105"
                  />
                </div>
              </ParallaxSection>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
