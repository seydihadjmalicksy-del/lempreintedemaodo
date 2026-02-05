import { Crown, BookOpen, Building, Scale, Shield, Users, Heart, Star } from "lucide-react";

const LigneeKhalifes = () => {
  const khalifes = [
    {
      name: "Serigne Babacar Sy",
      title: "Le Premier Khalife",
      period: "1922 - 1957",
      icon: Crown,
      description: "Fils aîné de Maodo, il fut le premier successeur. Homme de rigueur et d'organisation, il structura la Tariqa en créant le système des Dahiras (cercles d'études et de dhikr) qui allait assurer le rayonnement de Tivaouane à travers le Sénégal.",
      contributions: [
        "Création du système des Dahiras",
        "Organisation de la première Ziarra Générale en 1930",
        "Consolidation de l'unité des disciples après le décès de Maodo"
      ],
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      name: "Serigne Moustapha Sy Djamil",
      title: "L'Ascète de Fass - Borom Fass",
      period: "1916 - 1993",
      icon: Heart,
      description: "Né le 16 juin 1916 à Louga, petit-fils aîné de Maodo et fils aîné de Serigne Babacar Sy. Surnommé 'Djamil' (le Beau) par Serigne Abdou Aziz Sy Dabakh pour sa beauté physique et morale. Lors de son baptême, son doigt s'accrocha au chapelet de Maodo qui dit : « Il ne veut pas lâcher mon chapelet ». Son père déclara : « Moustapha est le domaine réservé de Dieu ; nous en avons seulement la garde ».",
      contributions: [
        "Fondateur du quartier Fass à Dakar (en référence à Fez et au Prophète)",
        "Vie d'ascète et de retraite spirituelle pendant 40 ans",
        "Enseignement et éducation des enfants dans la voie de Maodo",
        "Préservation du legs spirituel de son grand-père"
      ],
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      name: "Serigne Mansour Sy 'Balkhawmi'",
      title: "Le Savant Multidimensionnel",
      period: "1957 - 1957",
      icon: BookOpen,
      description: "Érudit exceptionnel, poète mystique et juriste, il incarnait la fusion parfaite entre science et spiritualité. Ses cours magistraux attiraient des centaines d'étudiants venus de toute l'Afrique de l'Ouest.",
      contributions: [
        "Enseignement approfondi des sciences islamiques",
        "Composition de poèmes en l'honneur du Prophète (PSL)",
        "Formation de générations de muqqadams et d'imams"
      ],
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      name: "Serigne Abdoul Aziz Sy 'Dabakh'",
      title: "Le Régulateur Social",
      period: "1957 - 1997",
      icon: Scale,
      description: "Figure de l'unité nationale, il a joué un rôle médiateur crucial dans les crises politiques et sociales du Sénégal. Son charisme et sa sagesse ont fait de lui un interlocuteur respecté de tous.",
      contributions: [
        "Médiation dans les crises socio-politiques",
        "Promotion du dialogue interreligieux",
        "Modernisation des infrastructures de Tivaouane"
      ],
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      name: "Serigne Mansour Sy 'Borom Darayi'",
      title: "Le Protecteur du Savoir",
      period: "1997 - 2012",
      icon: Shield,
      description: "Gardien de l'orthodoxie et défenseur des valeurs islamiques, il a veillé à la préservation de l'enseignement authentique de Maodo face aux dérives modernes.",
      contributions: [
        "Protection de l'héritage spirituel de Maodo",
        "Renforcement de l'éducation islamique",
        "Expansion des écoles coraniques (daaras)"
      ],
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      name: "Serigne Abdoul Aziz Sy Al Amine",
      title: "Le Bâtisseur et Diplomate",
      period: "2012 - 2017",
      icon: Building,
      description: "Homme de projets et de vision, il a lancé de grands chantiers d'infrastructure à Tivaouane tout en renforçant les liens avec la communauté tidiane internationale.",
      contributions: [
        "Construction de la nouvelle aile de la Grande Mosquée",
        "Développement des œuvres sociales (hôpitaux, écoles)",
        "Renforcement des liens avec les disciples de la diaspora"
      ],
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      name: "Serigne Babacar Sy Mansour",
      title: "Le Guide Actuel",
      period: "2017 - Aujourd'hui",
      icon: Users,
      description: "L'actuel Khalife, garant de l'orthodoxie et de la continuité. Il poursuit l'œuvre de ses prédécesseurs en adaptant l'enseignement aux défis contemporains tout en préservant l'authenticité de la Tariqa.",
      contributions: [
        "Modernisation de la communication (médias numériques)",
        "Renforcement de l'unité des disciples",
        "Adaptation de l'enseignement aux réalités du 21e siècle"
      ],
      image: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg",
      current: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="khalifes-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              La Lignée des Héritiers
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              Les Successeurs de Maodo : Gardiens de l'Héritage Spirituel
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              Depuis le rappel à Dieu d'El Hadji Malick Sy en 1922, six khalifes se sont succédé à la tête 
              de la Tariqa Tidiane de Tivaouane. Chacun d'eux a apporté sa pierre à l'édifice, contribuant 
              à faire rayonner l'enseignement de Maodo à travers le temps et l'espace.
            </p>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed">
              Le principe de succession (Khilafa) dans la Tariqa Tidiane de Tivaouane suit une logique de 
              <strong className="text-[#004D33]"> primogéniture spirituelle</strong>, privilégiant généralement 
              les fils de Maodo, tout en tenant compte des qualités de science et de piété.
            </p>
          </div>
        </div>
      </section>

      {/* Liste des Khalifes */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {khalifes.map((khalife, index) => {
              const Icon = khalife.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    khalife.current ? 'ring-4 ring-[#D4AF37]' : ''
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    {/* Image */}
                    <div className="relative h-64 lg:h-auto">
                      <img
                        src={khalife.image}
                        alt={khalife.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="w-16 h-16 bg-[#004D33] rounded-full flex items-center justify-center shadow-lg">
                          <Icon className="w-8 h-8 text-[#D4AF37]" />
                        </div>
                      </div>
                      {khalife.current && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-[#D4AF37] text-[#004D33] px-4 py-2 rounded-full text-center font-bold">
                            Khalife Actuel
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-2 p-8 lg:p-12">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="px-4 py-2 bg-[#E8F5E9] text-[#004D33] rounded-full text-sm font-bold">
                          {khalife.period}
                        </span>
                      </div>

                      <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-2">
                        {khalife.name}
                      </h2>
                      
                      <p className="text-xl text-[#D4AF37] font-semibold mb-6">
                        {khalife.title}
                      </p>

                      <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                        {khalife.description}
                      </p>

                      <div className="border-t-2 border-[#E8F5E9] pt-6">
                        <h3 className="text-lg font-bold text-[#004D33] mb-4">
                          Contributions Majeures :
                        </h3>
                        <ul className="space-y-3">
                          {khalife.contributions.map((contribution, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-[#4A4A4A]">{contribution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="py-16 bg-gradient-to-r from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Une Chaîne Spirituelle Ininterrompue
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            De Maodo à nos jours, la transmission de la Baraka (grâce spirituelle) s'est poursuivie 
            sans rupture. Chaque Khalife a été le maillon d'une chaîne qui remonte au Prophète Muhammad 
            (PSL) à travers Cheikh Ahmed Tijani.
          </p>
          
          <p className="text-lg text-white/80 leading-relaxed">
            Cette continuité est le gage de l'authenticité de la voie et de la fidélité à l'enseignement originel.
          </p>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              رَضِيَ اللهُ عَنْهُمْ أَجْمَعِينَ
              <br />
              Que Allah les agrée tous
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LigneeKhalifes;