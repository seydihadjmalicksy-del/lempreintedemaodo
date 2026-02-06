import { Calendar, MapPin, Users, Heart } from "lucide-react";

const ZiarraAnnuelles = () => {
  const ziarras = [
    {
      nom: "Ziarra Générale 2025",
      date: "Dimanche 20 avril 2025",
      icon: Users,
      description: "La plus importante des ziarra, créée en 1930 par Serigne Babacar Sy. Elle rassemble des centaines de milliers de disciples venus renouveler leur pacte spirituel (bay'a) avec le Khalife Serigne Babacar Sy Mansour.",
      programme: [
        "Samedi 19 avril : Arrivée des pèlerins et Gamou traditionnel",
        "Dimanche matin : Grande prière à la mosquée",
        "Dimanche : Renouvellement de l'allégeance des Dahiras",
        "Dimanche soir : Allocution du Khalife et bénédictions",
        "Forum sur les Dahiras comme vecteurs de développement"
      ],
      signification: "C'est le moment où chaque tidiane réaffirme son engagement spirituel et reçoit les orientations du guide pour l'année à venir."
    },
    {
      nom: "Ziarra de Maodo",
      date: "Anniversaire du rappel à Dieu d'El Hadji Malick Sy (27 Jumada al-Thani)",
      icon: Heart,
      description: "Pèlerinage commémoratif en l'honneur du fondateur de Tivaouane. Les disciples se recueillent sur sa tombe et lisent des poèmes en son honneur.",
      programme: [
        "Récitation du Coran au mausolée",
        "Khoutba retraçant la vie de Maodo",
        "Chants de qasidas à sa gloire",
        "Prières collectives",
        "Distribution de nourriture (Hadiya)"
      ],
      signification: "Honorer la mémoire de Maodo et se rappeler ses enseignements et son exemple."
    },
    {
      nom: "Ziarra des Khalifes",
      date: "Dates variables selon les khalifes",
      icon: Calendar,
      description: "Commémorations des différents Khalifes successeurs de Maodo. Chaque khalife a sa propre journée de ziarra.",
      programme: [
        "Visites aux mausolées respectifs",
        "Récits sur les contributions de chaque khalife",
        "Prières et invocations",
        "Rencontres communautaires"
      ],
      signification: "Maintenir vivante la mémoire des guides successifs et leurs apports à la Tariqa."
    }
  ];

  const conseilsPelerins = [
    {
      titre: "Préparation Spirituelle",
      conseils: [
        "Formuler une intention sincère (Niya) avant le départ",
        "Se purifier spirituellement par le repentir",
        "Multiplier les prières sur le Prophète (PSL) durant le voyage"
      ]
    },
    {
      titre: "Préparation Logistique",
      conseils: [
        "Réserver son hébergement à l'avance",
        "Prévoir des vêtements modestes et confortables",
        "Apporter son Wird et son chapelet",
        "Se munir d'argent pour les dons (Hadiya)"
      ]
    },
    {
      titre: "Sur Place",
      conseils: [
        "Respecter les consignes des organisateurs",
        "Participer aux prières collectives",
        "Visiter les lieux saints avec recueillement",
        "Maintenir la propreté des espaces publics"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="ziarra-page">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
            alt="Ziarra à Tivaouane"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/90 via-[#004D33]/80 to-[#004D33]/70"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Les Ziarra Annuelles
                <br />
                <span className="text-[#D4AF37]">Pèlerinages Spirituels</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Les rendez-vous sacrés qui rythment la vie spirituelle des disciples tidiane
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
              Les <strong>Ziarra</strong> (زيارة, visites) sont des pèlerinages périodiques 
              que les disciples tidiane effectuent à Tivaouane pour se ressourcer spirituellement, 
              renouveler leur allégeance et recevoir les bénédictions (Baraka) du Khalife.
            </p>

            <p className="text-lg text-[#4A4A4A] leading-relaxed">
              Contrairement au Gamou qui est une célébration universelle du Maouloud, les Ziarra 
              sont des moments plus intimes de connexion entre les disciples et leur guide spirituel. 
              Elles permettent de maintenir vivant le lien (Râbita) qui unit chaque tidiane à la lignée 
              de Maodo.
            </p>
          </div>
        </div>
      </section>

      {/* Les Principales Ziarra */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Les Principales Ziarra
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="space-y-12">
            {ziarras.map((ziarra, index) => {
              const Icon = ziarra.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-xl"
                >
                  <div className="bg-gradient-to-r from-[#004D33] to-[#003d29] p-6 text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-[#004D33]" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{ziarra.nom}</h3>
                        <p className="text-[#D4AF37] flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {ziarra.date}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                      {ziarra.description}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold text-[#004D33] mb-4 text-lg">Programme :</h4>
                        <ul className="space-y-3">
                          {ziarra.programme.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-[#4A4A4A]">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-[#004D33] mb-4 text-lg">Signification Spirituelle :</h4>
                        <div className="bg-[#E8F5E9] rounded-lg p-6 border-l-4 border-[#D4AF37]">
                          <p className="text-[#4A4A4A] leading-relaxed">
                            {ziarra.signification}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Guide du Pèlerin */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Guide du Pèlerin
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {conseilsPelerins.map((section, index) => (
              <div
                key={index}
                className="bg-[#F9F7F2] rounded-xl p-8 border-t-4 border-[#D4AF37]"
              >
                <h3 className="text-xl font-bold text-[#004D33] mb-6">
                  {section.titre}
                </h3>
                <ul className="space-y-4">
                  {section.conseils.map((conseil, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-[#D4AF37] text-xl">✓</span>
                      <span className="text-[#4A4A4A]">{conseil}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            La Ziarra : Un Voyage de l'Âme
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            La ziarra n'est pas qu'un déplacement physique vers Tivaouane. C'est un voyage intérieur, 
            une migration spirituelle (Hijra) où le disciple quitte ses préoccupations matérielles 
            pour se rapprocher d'Allah à travers l'amour de son guide.
          </p>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ
              <br />
              "Et c'est un devoir envers Allah pour les gens qui ont les moyens, d'aller faire le pèlerinage de la Maison"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ZiarraAnnuelles;