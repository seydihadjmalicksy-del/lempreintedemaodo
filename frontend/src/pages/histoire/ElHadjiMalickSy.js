import { BookOpen, MapPin, Heart, Star } from "lucide-react";

const ElHadjiMalickSy = () => {
  const milestones = [
    {
      year: "1855",
      title: "Naissance",
      description: "Naissance à Gaya (Sénégal) dans une famille de lettres et de saints"
    },
    {
      year: "1888",
      title: "Pèlerinage à La Mecque",
      description: "Voyage initiatique qui marque sa consécration spirituelle"
    },
    {
      year: "1902",
      title: "Installation à Tivaouane",
      description: "Fondation de la Zawiya qui deviendra le centre névralgique de la Tidjanidya"
    },
    {
      year: "1922",
      title: "Rappel à Dieu",
      description: "Décès à Tivaouane, laissant un héritage spirituel immense"
    }
  ];

  const qualities = [
    {
      icon: BookOpen,
      title: "L'Érudit",
      description: "Maître incontesté des sciences islamiques : Fikh, Tafsir, Hadith, Logique et Grammaire arabe"
    },
    {
      icon: Heart,
      title: "Le Guide Spirituel",
      description: "Éducateur de l'âme qui a formé des générations de disciples dans la voie soufie"
    },
    {
      icon: Star,
      title: "Le Bâtisseur",
      description: "Fondateur d'une université populaire accessible à tous, sans distinction"
    },
    {
      icon: MapPin,
      title: "Le Visionnaire",
      description: "Stratège qui a su implanter Tivaouane comme centre de résistance culturelle face au colonialisme"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="malick-sy-page">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
            alt="Grande Mosquée de Tivaouane"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/95 via-[#004D33]/85 to-[#004D33]/75"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-block bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full px-6 py-2 mb-6">
                <span className="text-[#D4AF37] text-sm font-medium">1855 - 1922</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                El Hadji Malick Sy
                <br />
                <span className="text-[#D4AF37]">Maodo - Le Pôle Spirituel</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                Celui qui a fait de Tivaouane le phare de la science et de la spiritualité en Afrique de l'Ouest
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
              Seydi El Hadji Malick Sy (que la miséricorde d'Allah soit sur lui) est une figure monumentale 
              de l'Islam ouest-africain. Érudit exceptionnel, guide spirituel éclairé et réformateur social, 
              il a consacré sa vie à l'enseignement et à l'élévation spirituelle de ses disciples.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-[#E8F5E9] p-6 rounded-xl">
                <h3 className="text-lg font-bold text-[#004D33] mb-3">Son Nom Complet</h3>
                <p className="text-[#4A4A4A] mb-0">
                  Seydi El Hadji Malick Sy ibn Oustaze Ousmane Sy
                </p>
              </div>
              
              <div className="bg-[#E8F5E9] p-6 rounded-xl">
                <h3 className="text-lg font-bold text-[#004D33] mb-3">Son Titre</h3>
                <p className="text-[#4A4A4A] mb-0">
                  Maodo (Le Vénérable), Khalifatul Mashaïkh
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualités Majeures */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              Les Dimensions de sa Grandeur
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualities.map((quality, index) => {
              const Icon = quality.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-[#D4AF37]"
                >
                  <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-[#004D33]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#004D33] mb-3">
                    {quality.title}
                  </h3>
                  
                  <p className="text-[#4A4A4A] leading-relaxed">
                    {quality.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Parcours Chronologique */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              L'Épopée d'une Vie
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-[#004D33] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {milestone.year}
                  </div>
                </div>
                
                <div className="flex-1 bg-[#F9F7F2] rounded-xl p-6 border-l-4 border-[#D4AF37]">
                  <h3 className="text-2xl font-bold text-[#004D33] mb-3">
                    {milestone.title}
                  </h3>
                  <p className="text-[#4A4A4A] leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* L'Histoire Détaillée */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl p-8 lg:p-12 shadow-lg">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-8">
              Le Récit de son Installation à Tivaouane
            </h2>
            
            <div className="space-y-6 text-lg text-[#4A4A4A] leading-relaxed">
              <p>
                Après un séjour à <strong className="text-[#004D33]">Saint-Louis</strong>, capitale coloniale 
                où il enseignait déjà, El Hadji Malick Sy a pris la décision stratégique de s'installer à 
                <strong className="text-[#004D33]"> Tivaouane en 1902</strong>. Cette décision n'était pas fortuite.
              </p>
              
              <p>
                Face aux pressions de l'administration coloniale française qui tentait de contrôler les chefs 
                religieux et d'instrumentaliser leur influence, Maodo a choisi la voie de l'indépendance spirituelle. 
                Tivaouane, bourgade tranquille à l'époque, allait devenir sous son impulsion 
                <strong className="text-[#004D33]"> le centre névralgique de la Tidjanidya</strong> au Sénégal.
              </p>

              <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
                <p className="text-[#004D33] italic mb-0">
                  "Tivaouane n'était pas seulement un lieu géographique, c'était un projet : 
                  celui de bâtir une <strong>université populaire</strong> où le savoir islamique 
                  serait accessible à tous, du plus humble au plus instruit."
                </p>
              </div>
              
              <p>
                Il y fonda une <strong className="text-[#004D33]">Zawiya</strong> (école coranique et centre 
                spirituel) qui attira rapidement des milliers de disciples venus de tout le Sénégal et au-delà. 
                Son enseignement combinait la <strong className="text-[#004D33]">rigueur scientifique</strong> 
                (Fikh, Hadith, Tafsir) et l'<strong className="text-[#004D33]">éducation spirituelle</strong> 
                (Tassawuf, purification de l'âme).
              </p>
              
              <p>
                Contrairement à d'autres figures religieuses de l'époque qui ont collaboré avec le pouvoir colonial, 
                Maodo a maintenu une <strong className="text-[#004D33]">ligne de neutralité digne</strong>, 
                refusant toute compromission qui aurait pu aliéner l'identité musulmane de son peuple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Son Héritage */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Un Héritage Immortel
          </h2>
          
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-8"></div>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            À sa mort en 1922, El Hadji Malick Sy laissa derrière lui une œuvre colossale : 
            des milliers de disciples formés, des dizaines d'ouvrages écrits, et surtout, 
            une méthode d'éducation qui continue d'inspirer des générations entières.
          </p>
          
          <p className="text-xl text-white/90 leading-relaxed">
            Aujourd'hui encore, son enseignement résonne à travers les dahiras, les mosquées 
            et les cœurs de millions de Tidiane à travers le monde.
          </p>
          
          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              رَضِيَ اللهُ عَنْهُ وَأَرْضَاهُ
              <br />
              Que Allah l'agrée et le satisfasse
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ElHadjiMalickSy;