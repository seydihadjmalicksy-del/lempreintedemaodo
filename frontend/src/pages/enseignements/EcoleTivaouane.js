import { GraduationCap, BookOpen, Users, Award, Globe, Star } from "lucide-react";

const EcoleTivaouane = () => {
  const methodePedagogique = [
    {
      icon: BookOpen,
      title: "Enseignement Intégral",
      description: "Combinaison harmonieuse entre sciences religieuses (Coran, Hadith, Fiqh) et sciences profanes (mathématiques, langues)"
    },
    {
      icon: Users,
      title: "Pédagogie Orale",
      description: "Transmission directe du maître à l'élève, favorisant la mémorisation et la compréhension profonde"
    },
    {
      icon: Award,
      title: "Formation Spirituelle",
      description: "Au-delà de la science, éducation du caractère (Akhlaq) et purification de l'âme (Tazkiyya)"
    }
  ];

  const grandsErudits = [
    {
      name: "Serigne Mansour Sy 'Balkhawmi'",
      period: "1925-1980",
      specialites: "Exégèse coranique, Jurisprudence, Poésie mystique",
      contribution: "A formé des centaines d'imams et de muqqadams qui ont essaimé la Tariqa à travers le Sénégal"
    },
    {
      name: "Serigne Abdoul Aziz Sy 'Dabakh'",
      period: "1904-1997",
      specialites: "Tafsir, Hadith, Médiation sociale",
      contribution: "Ses causeries radiodiffusées ont éduqué des millions de Sénégalais pendant des décennies"
    },
    {
      name: "Serigne Rawane Mbaye",
      period: "1890-1960",
      specialites: "Grammaire arabe, Logique, Sciences coraniques",
      contribution: "Maître réputé qui a formé une génération d'arabisants de haut niveau"
    },
    {
      name: "Serigne Souhaibou Mbacké",
      period: "1925-2008",
      specialites: "Fiqh Maliki, Usul al-Fiqh",
      contribution: "Juriste exceptionnel consulté pour les questions complexes de droit islamique"
    }
  ];

  const niveauxEnseignement = [
    {
      niveau: "Cycle Élémentaire",
      duree: "3-5 ans",
      contenu: "Apprentissage du Coran par cœur, initiation à la langue arabe, principes de base de l'Islam"
    },
    {
      niveau: "Cycle Moyen",
      duree: "5-7 ans",
      contenu: "Grammaire arabe (Nahw, Sarf), Fiqh, Hadith, introduction au Tafsir"
    },
    {
      niveau: "Cycle Supérieur",
      duree: "Variable",
      contenu: "Spécialisation en Tafsir, Hadith, Fiqh approfondi, Usul al-Fiqh, Logique (Mantiq)"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="ecole-page">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
            alt="École de Tivaouane"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/95 via-[#004D33]/85 to-[#004D33]/75"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full px-6 py-2 mb-6">
                <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-sm font-medium">Université Populaire</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                L'École de Tivaouane
                <br />
                <span className="text-[#D4AF37]">Former l'Homme Complet</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                La méthode pédagogique unique d'El Hadji Malick Sy qui a révolutionné 
                l'enseignement islamique en Afrique de l'Ouest
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[#004D33] font-semibold mb-6 leading-relaxed">
              L'École de Tivaouane n'est pas une institution au sens moderne, mais un 
              <strong> système d'enseignement vivant</strong> créé par El Hadji Malick Sy, 
              qui visait à former des musulmans éclairés, à la fois savants et vertueux.
            </p>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              Dès son installation en 1902, Maodo établit une <strong className="text-[#004D33]">zawiya</strong> 
              (école coranique) qui devint rapidement un centre d'attraction pour des milliers d'étudiants. 
              Sa pédagogie se distinguait par son <strong className="text-[#004D33]">accessibilité</strong> : 
              contrairement aux écoles élitistes de l'époque, Tivaouane accueillait tous les aspirants au savoir, 
              riches ou pauvres, Wolofs ou Sérères, citadins ou ruraux.
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-[#004D33] italic mb-0">
                <strong>La vision de Maodo :</strong> "Le savoir religieux doit être accessible à tous. 
                Un berger qui connaît son Seigneur vaut mieux qu'un érudit orgueilleux."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Méthode Pédagogique */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              La Méthode Pédagogique
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {methodePedagogique.map((methode, index) => {
              const Icon = methode.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 border-t-4 border-[#D4AF37]"
                >
                  <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-[#004D33]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#004D33] mb-4">
                    {methode.title}
                  </h3>
                  
                  <p className="text-[#4A4A4A] leading-relaxed">
                    {methode.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl p-8 lg:p-12 shadow-lg">
            <h3 className="text-2xl font-bold text-[#004D33] mb-6">
              Les Principes Directeurs
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#004D33] mb-2">La Gratuité de l'Enseignement</h4>
                  <p className="text-[#4A4A4A]">
                    L'éducation à Tivaouane était entièrement gratuite. Les étudiants étaient nourris 
                    et logés par la communauté. Le savoir était considéré comme un bien sacré qui ne 
                    se monnaye pas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#004D33] mb-2">L'Équilibre Science-Spiritualité</h4>
                  <p className="text-[#4A4A4A]">
                    Maodo insistait sur le fait que la science sans spiritualité mène à l'orgueil, 
                    et la spiritualité sans science conduit à l'égarement. L'étudiant devait cultiver 
                    les deux simultanément.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#004D33] mb-2">Le Service à la Communauté</h4>
                  <p className="text-[#4A4A4A]">
                    Les étudiants étaient encouragés à mettre leur savoir au service de la société : 
                    enseigner aux enfants, conseiller les familles, arbitrer les conflits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Niveaux d'Enseignement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Les Cycles d'Enseignement
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {niveauxEnseignement.map((niveau, index) => (
              <div
                key={index}
                className="bg-[#F9F7F2] rounded-xl p-8 border-l-4 border-[#D4AF37]"
              >
                <div className="mb-4">
                  <span className="inline-block bg-[#004D33] text-white px-4 py-2 rounded-full text-sm font-bold">
                    {niveau.duree}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-[#004D33] mb-4">
                  {niveau.niveau}
                </h3>
                
                <p className="text-[#4A4A4A] leading-relaxed">
                  {niveau.contenu}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grands Érudits */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Les Grands Maîtres de Tivaouane
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              L'École de Tivaouane a produit des sommités dans tous les domaines des sciences islamiques
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {grandsErudits.map((erudit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#004D33] mb-1">
                      {erudit.name}
                    </h3>
                    <p className="text-sm text-[#888888]">{erudit.period}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-[#004D33] mb-2">Spécialités :</h4>
                    <p className="text-[#4A4A4A]">{erudit.specialites}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#004D33] mb-2">Contribution :</h4>
                    <p className="text-[#4A4A4A]">{erudit.contribution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Héritage Actuel */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Un Héritage qui Perdure
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            Aujourd'hui encore, des dizaines de daaras (écoles coraniques) perpétuent la méthode 
            de Maodo à Tivaouane et dans tout le Sénégal. Des milliers d'étudiants y apprennent 
            le Coran, la langue arabe et les sciences islamiques dans le respect de la tradition 
            éducative tidiane.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">50+</div>
              <p className="text-white/80">Daaras actives</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">10K+</div>
              <p className="text-white/80">Étudiants actuels</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">120+</div>
              <p className="text-white/80">Ans d'histoire</p>
            </div>
          </div>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              اطْلُبُوا الْعِلْمَ مِنَ الْمَهْدِ إِلَى اللَّحْدِ
              <br />
              "Cherchez la science du berceau jusqu'à la tombe"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcoleTivaouane;