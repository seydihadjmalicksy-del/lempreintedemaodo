import { Book, Heart, Users, Sparkles } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Book,
      title: "Enseignement",
      description: "Transmission des savoirs islamiques et des sciences spirituelles selon la tradition prophétique"
    },
    {
      icon: Heart,
      title: "Purification",
      description: "Élévation spirituelle à travers le dhikr, la méditation et les pratiques soufies"
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Fraternité et solidarité entre les disciples guidés par l'amour du Prophète"
    },
    {
      icon: Sparkles,
      title: "Lumière",
      description: "Illumination des cœurs par la connaissance divine et la proximité avec Allah"
    }
  ];

  return (
    <div className="min-h-screen" data-testid="about-page">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-30"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold text-[#004D33] mb-6">
              <span className="text-[#D4AF37]">L'empreinte de Maodo</span>
            </h1>
            <p className="text-xl text-[#4A4A4A] max-w-3xl mx-auto">
              Une voie soufie authentique fondée sur les enseignements du Prophète Muhammad (PSL) 
              et transmise par Cheikh Ahmed Tijani
            </p>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 lg:py-24 bg-white" data-testid="history-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl relative">
                <img
                  src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
                  alt="Grande Mosquée de Tivaouane"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#004D33]/20 to-transparent"></div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-6">
                Histoire et Origine
              </h2>
              
              <div className="space-y-4 text-[#4A4A4A] leading-relaxed">
                <p>
                  La <strong className="text-[#004D33]">Tijaniyya</strong> a été fondée par 
                  Cheikh Ahmed Tijani (1737-1815) au Maroc. Cette voie soufie authentique s'est 
                  répandue en Afrique de l'Ouest grâce aux efforts de grands maîtres spirituels.
                </p>
                
                <p>
                  À <strong className="text-[#004D33]">Tivaouane</strong>, au Sénégal, le Foyer Tidiane 
                  a été établi par <strong className="text-[#004D33]">Cheikh El Hadj Malick Sy</strong> 
                  (1855-1922), un érudit exceptionnel qui a consacré sa vie à l'enseignement de l'islam 
                  et à la guidance spirituelle.
                </p>

                <p>
                  Cheikh Malick Sy était reconnu pour sa piété, son érudition exceptionnelle en sciences 
                  islamiques, et sa capacité à éduquer des générations de disciples. Il a fait de Tivaouane 
                  un centre majeur d'enseignement islamique et de spiritualité en Afrique de l'Ouest.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 islamic-pattern" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              Nos Valeurs Fondamentales
            </h2>
            <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
              Les piliers qui guident notre cheminement spirituel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                data-testid={`value-card-${index}`}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-[#D4AF37]"
              >
                <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-[#004D33]" />
                </div>
                
                <h3 className="text-xl font-bold text-[#004D33] mb-3">
                  {value.title}
                </h3>
                
                <p className="text-[#4A4A4A] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachings Section */}
      <section className="py-16 lg:py-24 bg-white" data-testid="teachings-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-8 text-center">
              Les Enseignements
            </h2>

            <div className="space-y-8">
              <div className="bg-[#F9F7F2] border-l-4 border-[#D4AF37] rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#004D33] mb-3">Le Wird Tidiane</h3>
                <p className="text-[#4A4A4A] leading-relaxed">
                  Le Wird est l'ensemble des invocations et litanies quotidiennes prescrites aux disciples. 
                  Il comprend la récitation du Djawharatoul Kamal, la prière sur le Prophète (Salat Fatih), 
                  et l'invocation de la Istighfar.
                </p>
              </div>

              <div className="bg-[#F9F7F2] border-l-4 border-[#D4AF37] rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#004D33] mb-3">La Wazifa</h3>
                <p className="text-[#4A4A4A] leading-relaxed">
                  Récitation collective hebdomadaire effectuée le vendredi après-midi, réunissant les disciples 
                  dans une pratique spirituelle commune de dhikr et d'invocations.
                </p>
              </div>

              <div className="bg-[#F9F7F2] border-l-4 border-[#D4AF37] rounded-lg p-6">
                <h3 className="text-xl font-bold text-[#004D33] mb-3">Le Gamou</h3>
                <p className="text-[#4A4A4A] leading-relaxed">
                  Célébration annuelle du Mawlid (naissance du Prophète Muhammad) qui rassemble des milliers 
                  de fidèles à Tivaouane pour honorer le Prophète et renouveler leur engagement spirituel.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white" data-testid="legacy-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full px-6 py-2 mb-8">
              <span className="text-[#D4AF37] text-sm font-medium">Héritage Spirituel</span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Un Héritage qui Perdure
            </h2>
            
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Aujourd'hui, le Foyer Tidiane de Tivaouane continue de rayonner à travers le monde, 
              guidant des millions de disciples sur le chemin de la purification spirituelle et de 
              la proximité divine. Les enseignements de Cheikh Malick Sy continuent d'inspirer et 
              d'éclairer les cœurs des croyants.
            </p>

            <div className="inline-block">
              <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
              <p className="text-white/70 text-sm italic">
                "Celui qui connaît Allah aime Allah, et celui qui aime Allah Le mentionne"
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
