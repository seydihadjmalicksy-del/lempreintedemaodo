import { Calendar, MapPin, Users, Heart, Book, Music } from "lucide-react";

const Gamou = () => {
  const phases = [
    {
      icon: Calendar,
      title: "10 Jours de Bourde",
      description: "Récitation du poème Al-Burda d'Al-Bousayri en l'honneur du Prophète (PSL), accompagnée de chants spirituels"
    },
    {
      icon: Book,
      title: "Causeries Nocturnes",
      description: "Grands tafsirs et enseignements dispensés par les érudits durant les nuits précédant le Maouloud"
    },
    {
      icon: Users,
      title: "Rassemblement Massif",
      description: "Convergence de millions de fidèles venus de toute l'Afrique et du monde entier"
    },
    {
      icon: Heart,
      title: "Nuit du Maouloud",
      description: "Point culminant des célébrations avec la grande prière collective et les bénédictions"
    }
  ];

  const practicalInfo = [
    {
      title: "Gamou 2025",
      icon: Calendar,
      content: "Nuit du jeudi 4 au vendredi 5 septembre 2025 (12 Rabi' al-Awwal)"
    },
    {
      icon: MapPin,
      title: "Lieu Principal",
      content: "Grande Mosquée de Tivaouane et ses alentours (Champs de courses)"
    },
    {
      icon: Users,
      title: "Affluence",
      content: "Plus de 5 millions de pèlerins attendus chaque année"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="gamou-page">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
            alt="Gamou de Tivaouane"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/90 via-[#004D33]/80 to-[#004D33]/70"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full px-6 py-2 mb-6">
                <Music className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-sm font-medium">Célébration Annuelle</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Le Gamou de Tivaouane
                <br />
                <span className="text-[#D4AF37]">Maouloud an-Nabawi</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Le plus grand rassemblement spirituel d'Afrique de l'Ouest en l'honneur 
                de la naissance du Prophète Muhammad (PSL)
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
              Le Gamou de Tivaouane est bien plus qu'une fête religieuse : c'est un moment de communion 
              spirituelle intense, un pèlerinage annuel qui réaffirme l'amour des Tidiane pour le Prophète 
              Muhammad (PSL) et leur attachement à son message.
            </p>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              Institué par El Hadji Malick Sy au début du XXe siècle, le Gamou de Tivaouane est devenu 
              le rendez-vous incontournable de la Tidjanidya sénégalaise et ouest-africaine. Chaque année, 
              au 12e jour du mois de Rabi' al-Awwal, des millions de fidèles convergent vers la cité sainte.
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-[#004D33] italic mb-0">
                <strong>L'esprit du Gamou :</strong> "Il ne s'agit pas seulement de commémorer une naissance, 
                mais de raviver en chaque cœur l'amour du Prophète (PSL) et de renouveler son engagement 
                sur la voie spirituelle."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historique */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Histoire du Gamou de Tivaouane
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6 text-lg text-[#4A4A4A] leading-relaxed">
                <p>
                  La célébration du Maouloud (naissance du Prophète) n'était pas systématique au Sénégal 
                  avant l'arrivée d'El Hadji Malick Sy. C'est lui qui institutionnalisa cette pratique à 
                  <strong className="text-[#004D33]"> Tivaouane dès le début du XXe siècle</strong>.
                </p>
                
                <p>
                  La première célébration organisée fut modeste, mais elle gagna rapidement en ampleur. 
                  Maodo y voyait une opportunité d'<strong className="text-[#004D33]">éduquer les masses</strong> : 
                  les 10 jours précédant le Maouloud étaient consacrés à la récitation du Bourde (poème mystique) 
                  et à l'enseignement des valeurs prophétiques.
                </p>

                <p>
                  Après la mort de Maodo en 1922, ses successeurs perpétuèrent la tradition. 
                  Le Gamou devint progressivement <strong className="text-[#004D33]">l'événement spirituel 
                  majeur</strong> du Sénégal, attirant des personnalités politiques, des intellectuels 
                  et surtout des millions de disciples.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl relative">
                <img
                  src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
                  alt="Grande Mosquée durant le Gamou"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004D33]/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Les Phases du Gamou */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Le Déroulement des Célébrations
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <div
                  key={index}
                  className="bg-[#F9F7F2] rounded-xl p-8 border-l-4 border-[#D4AF37] hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#004D33] rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#004D33] mb-3">
                        {phase.title}
                      </h3>
                      <p className="text-[#4A4A4A] leading-relaxed">
                        {phase.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Informations Pratiques */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Informations Pratiques
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {practicalInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-md text-center hover:shadow-xl transition-shadow"
                >
                  <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-[#004D33]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#004D33] mb-3">
                    {info.title}
                  </h3>
                  <p className="text-[#4A4A4A]">
                    {info.content}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-[#004D33] mb-6 text-center">
              Conseils aux Pèlerins
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#4A4A4A]">
              <div>
                <h4 className="font-bold text-[#004D33] mb-3">Avant le Départ</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Réserver son hébergement plusieurs semaines à l'avance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Prévoir des vêtements adaptés (tenues modestes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Se munir de son Wird et de son chapelet</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-[#004D33] mb-3">Sur Place</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Respecter l'ordre et la discipline des organisateurs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Participer aux séances de Bourde et de dhikr</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#D4AF37] mt-1">•</span>
                    <span>Préserver la propreté des lieux saints</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conclusion Spirituelle */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Un Rendez-vous avec l'Éternité
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            Le Gamou de Tivaouane n'est pas qu'un rassemblement de masse. C'est un moment où le ciel 
            et la terre se rejoignent, où les cœurs des fidèles vibrent à l'unisson dans l'amour du 
            meilleur des hommes, Muhammad (PSL).
          </p>
          
          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ
              <br />
              Que la paix et les bénédictions d'Allah soient sur lui
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gamou;