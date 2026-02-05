import { Clock, Users, Mosque, Sun } from "lucide-react";

const CeremoniesReligieuses = () => {
  const ceremonies = [
    {
      icon: Mosque,
      titre: "La Prière du Vendredi",
      frequence: "Hebdomadaire",
      description: "Le vendredi est le jour le plus important de la semaine pour les musulmans. À Tivaouane, la Grande Mosquée accueille des milliers de fidèles pour la prière du Jumu'ah.",
      deroulement: [
        "12h30 : Appel à la prière (Adhan)",
        "13h00 : Khoutba (sermon) en arabe et wolof",
        "13h30 : Prière collective de deux rak'at",
        "14h00 : Wazifa collective dans les dahiras"
      ],
      particularite: "Le Khalife ou son représentant dirige la prière. C'est un moment de rassemblement communautaire fort."
    },
    {
      icon: Sun,
      titre: "Les Prières des Deux Aïds",
      frequence: "Annuelle",
      description: "Aïd al-Fitr (fin du Ramadan) et Aïd al-Adha (fête du sacrifice) sont célébrés avec faste à Tivaouane.",
      deroulement: [
        "6h00 : Préparation et ablutions",
        "7h00 : Départ en procession vers les Champs de Courses",
        "8h00 : Prière collective de l'Aïd",
        "9h00 : Khoutba du Khalife",
        "10h00 : Échanges de vœux et visites familiales"
      ],
      particularite: "Des centaines de milliers de personnes se rassemblent. C'est une démonstration impressionnante de l'unité de la communauté tidiane."
    },
    {
      icon: Users,
      titre: "Les Assemblées de Dhikr (Hadras)",
      frequence: "Quotidienne",
      description: "Séances collectives de dhikr organisées dans les différentes mosquées et dahiras de Tivaouane.",
      deroulement: [
        "Après Maghreb : Récitation du Wird collectif",
        "Après Isha : Hadra avec chants spirituels (Qasidas)",
        "Nuit du vendredi : Hadratul Jummah spéciale",
        "Récitation de Djawharatoul Kamal en groupe"
      ],
      particularite: "Ces assemblées créent une atmosphère spirituelle intense. Les voix s'élèvent à l'unisson dans l'invocation d'Allah."
    },
    {
      icon: Clock,
      titre: "Les Prières Nocturnes (Tahajjud)",
      frequence: "Particulièrement durant Ramadan",
      description: "Prières surérogatoires effectuées durant le dernier tiers de la nuit, moment privilégié d'intimité avec Allah.",
      deroulement: [
        "3h00 du matin : Appel au Tahajjud",
        "Prière de 8 à 12 rak'at",
        "Invocations et repentir",
        "Lecture du Coran jusqu'à l'aube"
      ],
      particularite: "Durant les dix dernières nuits de Ramadan, la Grande Mosquée ne désemplit pas. Les fidèles y passent la nuit en prière."
    }
  ];

  const organisationSociale = [
    {
      titre: "Les Dahiras",
      description: "Cercles d'études et de dhikr organisés par quartier ou par affinité. Chaque dahira a un responsable (muqqadam) qui guide les disciples.",
      role: "Organisation de la Wazifa hebdomadaire, entraide sociale, éducation religieuse"
    },
    {
      titre: "Le Conseil des Sages",
      description: "Instance composée de grands érudits et notables qui conseillent le Khalife sur les affaires de la communauté.",
      role: "Médiation des conflits, gestion des affaires communautaires, organisation des grands événements"
    },
    {
      titre: "Les Comités d'Organisation",
      description: "Bénévoles qui se chargent de la logistique lors des grands rassemblements (Gamou, Ziarra).",
      role: "Accueil des pèlerins, sécurité, distribution d'eau et de nourriture, gestion du trafic"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="ceremonies-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Cérémonies Religieuses
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              Le Rythme Spirituel de Tivaouane
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              La vie à Tivaouane est rythmée par un calendrier spirituel riche et structuré. 
              Des prières quotidiennes aux grands rassemblements annuels, chaque moment est une 
              occasion de se rapprocher d'Allah et de renforcer les liens communautaires.
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-[#004D33] italic mb-0">
                <strong>L'organisation sociale tidiane</strong> repose sur une structure hiérarchique 
                claire : le Khalife au sommet, puis les muqqadams (responsables de dahiras), et enfin 
                les disciples ordinaires. Cette organisation permet une transmission efficace des 
                enseignements et une gestion harmonieuse de la communauté.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Les Cérémonies */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Les Principales Cérémonies
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="space-y-8">
            {ceremonies.map((ceremonie, index) => {
              const Icon = ceremonie.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                    <div className="bg-gradient-to-br from-[#004D33] to-[#003d29] p-8 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mb-4">
                        <Icon className="w-10 h-10 text-[#004D33]" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {ceremonie.titre}
                      </h3>
                      <span className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-sm font-medium">
                        {ceremonie.frequence}
                      </span>
                    </div>

                    <div className="lg:col-span-3 p-8">
                      <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                        {ceremonie.description}
                      </p>

                      <div className="mb-6">
                        <h4 className="font-bold text-[#004D33] mb-4">Déroulement :</h4>
                        <div className="space-y-3">
                          {ceremonie.deroulement.map((etape, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-[#4A4A4A]">{etape}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#E8F5E9] rounded-lg p-4 border-l-4 border-[#D4AF37]">
                        <p className="text-sm text-[#004D33]">
                          <strong>Particularité :</strong> {ceremonie.particularite}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Organisation Sociale */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              Organisation Sociale de la Communauté
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {organisationSociale.map((org, index) => (
              <div
                key={index}
                className="bg-[#F9F7F2] rounded-xl p-8 border-t-4 border-[#D4AF37] hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-[#004D33] mb-4">
                  {org.titre}
                </h3>
                <p className="text-[#4A4A4A] mb-6 leading-relaxed">
                  {org.description}
                </p>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-[#004D33]">
                    <strong>Rôle :</strong> {org.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Une Communauté Vivante
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            L'organisation de Tivaouane est un modèle d'harmonie sociale et spirituelle. 
            Chaque membre a son rôle, chaque cérémonie son sens, chaque moment son importance. 
            C'est cette structure qui permet à la Tariqa de perdurer et de rayonner à travers 
            les générations.
          </p>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا وَلَا تَفَرَّقُوا
              <br />
              "Et cramponnez-vous tous ensemble au câble d'Allah et ne soyez pas divisés"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CeremoniesReligieuses;