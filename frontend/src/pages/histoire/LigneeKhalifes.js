import { Crown, BookOpen, Building, Scale, Shield, Users, Heart, Star } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const LigneeKhalifes = () => {
  const { t, language } = useLanguage();

  const khalifes = [
    {
      name: "Serigne Babacar Sy",
      title: { fr: "Le Premier Khalife", en: "The First Khalife", ar: "الخليفة الأول", wo: "Xaliifa bu njëkk" },
      period: "1885 - 1957",
      icon: Crown,
      description: {
        fr: "Fils aîné de Maodo, il fut le premier successeur. Homme de rigueur et d'organisation, il structura la Tariqa en créant le système des Dahiras (cercles d'études et de dhikr) qui allait assurer le rayonnement de Tivaouane à travers le Sénégal.",
        en: "The eldest son of Maodo, he was the first successor. A man of rigor and organization, he structured the Tariqa by creating the Dahira system (circles of study and dhikr) that would ensure Tivaouane's influence throughout Senegal.",
        ar: "الابن الأكبر لمودو، كان أول خليفة. رجل صارم ومنظم، أسس نظام الداهيرة (حلقات الدراسة والذكر) الذي ضمن إشعاع تيفاوان في جميع أنحاء السنغال.",
        wo: "Doom bu njëkk Maodo, moo njëkk warisaay. Nit ku sell ak organizatër, mu tabax sistem Dahira yi (cercle jàng ak dikr) buy def Tiwaawaan wéy ci Senegaal."
      },
      contributions: {
        fr: ["Création du système des Dahiras", "Organisation de la première Ziarra Générale en 1930", "Consolidation de l'unité des disciples après le décès de Maodo"],
        en: ["Creation of the Dahira system", "Organization of the first General Ziarra in 1930", "Consolidation of the unity of disciples after Maodo's death"],
        ar: ["إنشاء نظام الداهيرة", "تنظيم أول زيارة عامة في 1930", "توحيد التلاميذ بعد وفاة مودو"],
        wo: ["Sos sistem Dahira yi", "Organise njëkk Ziarra Générale ci 1930", "Bokk taalibe yi ginnaaw dee Maodo"]
      },
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/z7luqn3z_FB_IMG_1770339992610.jpg"
    },
    {
      name: "Serigne Mansour Sy 'Balkhawmi'",
      title: { fr: "Le Savant Multidimensionnel", en: "The Multidimensional Scholar", ar: "العالم متعدد الأبعاد", wo: "Borom xam-xam bu bari" },
      period: "1900 - 1957",
      icon: BookOpen,
      description: {
        fr: "Érudit exceptionnel, poète mystique et juriste, il incarnait la fusion parfaite entre science et spiritualité. Ses cours magistraux attiraient des centaines d'étudiants venus de toute l'Afrique de l'Ouest.",
        en: "Exceptional scholar, mystical poet and jurist, he embodied the perfect fusion of science and spirituality. His masterful lectures attracted hundreds of students from all over West Africa.",
        ar: "عالم استثنائي وشاعر صوفي وفقيه، جسد الاندماج الكامل بين العلم والروحانية. جذبت دروسه المئات من الطلاب من جميع أنحاء غرب أفريقيا.",
        wo: "Borom xam-xam bu baax, woykat suufi ak juriste, muy bokk xam-xam ak diine bu sell. Jàng yi muy def di jël ay téeméer jàngkat yu jóge Afrik àll-géej yépp."
      },
      contributions: {
        fr: ["Enseignement approfondi des sciences islamiques", "Composition de poèmes en l'honneur du Prophète (PSL)", "Formation de générations de muqqadams et d'imams"],
        en: ["In-depth teaching of Islamic sciences", "Composition of poems in honor of the Prophet (PBUH)", "Training of generations of muqqadams and imams"],
        ar: ["تعليم معمق للعلوم الإسلامية", "تأليف قصائد في مدح النبي (ص)", "تكوين أجيال من المقدمين والأئمة"],
        wo: ["Jàngale xam-xam Islaam", "Bind woy ci Yonent bi (YWS)", "Forme ay jamano muqqadam ak imam"]
      },
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/s4o5buj7_FB_IMG_1770340053073.jpg"
    },
    {
      name: "Serigne Abdoul Aziz Sy 'Dabakh'",
      title: { fr: "Le Régulateur Social", en: "The Social Regulator", ar: "المنظم الاجتماعي", wo: "Régulateur social" },
      period: "1904 - 1997",
      icon: Scale,
      description: {
        fr: "Figure de l'unité nationale, il a joué un rôle médiateur crucial dans les crises politiques et sociales du Sénégal. Son charisme et sa sagesse ont fait de lui un interlocuteur respecté de tous.",
        en: "A figure of national unity, he played a crucial mediating role in Senegal's political and social crises. His charisma and wisdom made him a respected interlocutor by all.",
        ar: "رمز الوحدة الوطنية، لعب دوراً وسيطاً حاسماً في الأزمات السياسية والاجتماعية في السنغال. جعلته كاريزمته وحكمته محترماً من الجميع.",
        wo: "Nit ku bokk réew mi, mu dimbali ci crise politique ak social Senegaal yi. Charisme ak xel bu baax moo def ko nit ku ñépp di hormat."
      },
      contributions: {
        fr: ["Médiation dans les crises socio-politiques", "Promotion du dialogue interreligieux", "Modernisation des infrastructures de Tivaouane"],
        en: ["Mediation in socio-political crises", "Promotion of interreligious dialogue", "Modernization of Tivaouane's infrastructure"],
        ar: ["الوساطة في الأزمات السياسية والاجتماعية", "تعزيز الحوار بين الأديان", "تحديث البنية التحتية لتيفاوان"],
        wo: ["Dimbali ci crise socio-politique yi", "Yëngu waxtan diine yi", "Yëggo infrastruktiir Tiwaawaan"]
      },
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/qa8yxjql_FB_IMG_1770340203424.jpg"
    },
    {
      name: "Serigne Mouhammadoul Habib Sy",
      title: { fr: "L'Infatigable Serviteur", en: "The Tireless Servant", ar: "الخادم الدؤوب", wo: "Jaam bu dul sew" },
      period: "1906 - 1992",
      icon: Star,
      description: {
        fr: "Fils cadet d'El Hadji Malick Sy et de Sokhna Safiétou Niang, il reçut sa formation islamique auprès de son père, puis de Serigne Saer Gueye et Mouhamadou Hady Touré.",
        en: "Youngest son of El Hadji Malick Sy and Sokhna Safiétou Niang, he received his Islamic education from his father, then from Serigne Saer Gueye and Mouhamadou Hady Touré.",
        ar: "الابن الأصغر للحاج مالك سي وسخنة صفية نيانغ، تلقى تعليمه الإسلامي من والده، ثم من سرين سير غي ومحمدو هادي توري.",
        wo: "Doom bu ndaw El Hadji Maalik Si ak Sokhna Safiétou Niang, mu jàng Islaam ci baay bi, ci Serigne Saer Gueye ak Mouhamadou Hady Touré."
      },
      contributions: {
        fr: ["Premier président du comité de suivi des travaux de la Grande Mosquée de Tivaouane (1976)", "Engagement dans l'agriculture et la gestion des daaras à Diacksao", "Direction de nombreux Gamous"],
        en: ["First president of the monitoring committee for the Grand Mosque of Tivaouane (1976)", "Commitment to agriculture and daara management in Diacksao", "Direction of numerous Gamous"],
        ar: ["أول رئيس للجنة متابعة أعمال المسجد الكبير بتيفاوان (1976)", "الالتزام بالزراعة وإدارة الدار في دياكساو", "إدارة العديد من المولد"],
        wo: ["Njëkk président comité suivi liggéey Jàkka bu mag bi Tiwaawaan (1976)", "Liggéey ci ndox ak daara yi ci Diacksao", "Yoonu ay Gamou yu bari"]
      },
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/zk7vtiqg_FB_IMG_1770340169935.jpg"
    },
    {
      name: "Serigne Moustapha Sy Djamil",
      title: { fr: "L'Ascète de Fass - Borom Fass", en: "The Ascetic of Fass - Borom Fass", ar: "زاهد فاس - بوروم فاس", wo: "Zahid Fass - Borom Fass" },
      period: "1916 - 1993",
      icon: Heart,
      description: {
        fr: "Né le 16 juin 1916 à Louga, petit-fils aîné de Maodo et fils aîné de Serigne Babacar Sy. Surnommé 'Djamil' (le Beau) par Serigne Abdou Aziz Sy Dabakh pour sa beauté physique et morale.",
        en: "Born June 16, 1916 in Louga, eldest grandson of Maodo and eldest son of Serigne Babacar Sy. Nicknamed 'Djamil' (the Beautiful) by Serigne Abdou Aziz Sy Dabakh for his physical and moral beauty.",
        ar: "ولد في 16 يونيو 1916 في لوغا، الحفيد الأكبر لمودو والابن الأكبر لسرين باباكار سي. لقب بـ'جميل' من قبل سرين عبد العزيز سي داباخ لجماله الجسدي والأخلاقي.",
        wo: "Juddu ci 16 juin 1916 ci Louga, njëkk doom-u-doom Maodo ak njëkk doom Serigne Babacar Sy. Tur gi 'Djamil' (Rafet) Serigne Abdou Aziz Sy Dabakh jox ko ngir rafet bu yaram ak bu xel."
      },
      contributions: {
        fr: ["Fondateur du quartier Fass à Dakar", "Vie d'ascète et de retraite spirituelle pendant 40 ans", "Enseignement et éducation des enfants"],
        en: ["Founder of the Fass neighborhood in Dakar", "40 years of ascetic life and spiritual retreat", "Teaching and educating children"],
        ar: ["مؤسس حي فاس في داكار", "40 سنة من الحياة الزهدية والخلوة الروحية", "تعليم وتربية الأطفال"],
        wo: ["Tëkkikat kër Fass ci Dakar", "Dund zahid ak retraite spirituelle ci 40 at", "Jàngale ak éduqué xale yi"]
      },
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/p7vxoses_FB_IMG_1770340283848.jpg"
    },
    {
      name: "Serigne Mansour Sy 'Borom Daradji'",
      title: { fr: "Le Protecteur du Savoir", en: "The Protector of Knowledge", ar: "حامي المعرفة", wo: "Sàmmukat xam-xam" },
      period: "1925 - 2012",
      icon: Shield,
      description: {
        fr: "Gardien de l'orthodoxie et défenseur des valeurs islamiques, il a veillé à la préservation de l'enseignement authentique de Maodo face aux dérives modernes.",
        en: "Guardian of orthodoxy and defender of Islamic values, he ensured the preservation of Maodo's authentic teaching against modern deviations.",
        ar: "حارس الأرثوذكسية ومدافع عن القيم الإسلامية، حرص على الحفاظ على تعاليم مودو الأصيلة ضد الانحرافات الحديثة.",
        wo: "Sàmmukat ortodoksi ak défenseur valeur Islaam yi, mu sàmm jàng bu dëgg Maodo ci kanam dérives modern yi."
      },
      contributions: {
        fr: ["Protection de l'héritage spirituel de Maodo", "Renforcement de l'éducation islamique", "Expansion des écoles coraniques (daaras)"],
        en: ["Protection of Maodo's spiritual heritage", "Strengthening Islamic education", "Expansion of Quranic schools (daaras)"],
        ar: ["حماية الإرث الروحي لمودو", "تعزيز التعليم الإسلامي", "توسيع المدارس القرآنية (الدار)"],
        wo: ["Sàmm njàmbaar bu sell Maodo", "Yokku éducation Islaam", "Yàgg daara yi"]
      },
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/mg7xetxg_FB_IMG_1770340311886.jpg"
    },
    {
      name: "Serigne Cheikh Ahmed Tidiane Sy 'Al Maktoum'",
      title: { fr: "Le Visionnaire Multidimensionnel", en: "The Multidimensional Visionary", ar: "الرؤيوي متعدد الأبعاد", wo: "Visionnaire bu bari" },
      period: "1925 - 2017",
      icon: Star,
      description: {
        fr: "Né à Saint-Louis, petit-fils d'El Hadji Malick Sy et fils de Serigne Babacar Sy. Reconnu pour sa précocité intellectuelle, il fonda le dahira Moustarchidine Wal Moustarchidati.",
        en: "Born in Saint-Louis, grandson of El Hadji Malick Sy and son of Serigne Babacar Sy. Known for his intellectual precociousness, he founded the Moustarchidine Wal Moustarchidati dahira.",
        ar: "ولد في سان لويس، حفيد الحاج مالك سي وابن سرين باباكار سي. معروف بذكائه المبكر، أسس داهيرة مسترشدين ومسترشدات.",
        wo: "Juddu ci Ndar, doom-u-doom El Hadji Maalik Si ak doom Serigne Babacar Sy. Xam bu gaaw xel, mu sos dahira Moustarchidine Wal Moustarchidati."
      },
      contributions: {
        fr: ["Fondation du dahira Moustarchidine Wal Moustarchidati", "Création de la première association culturelle islamique du Sénégal (1950)", "Initiation du COSKAS pour l'organisation du Gamou (1968)"],
        en: ["Foundation of the Moustarchidine Wal Moustarchidati dahira", "Creation of the first Islamic cultural association in Senegal (1950)", "Initiation of COSKAS for Gamou organization (1968)"],
        ar: ["تأسيس داهيرة مسترشدين ومسترشدات", "إنشاء أول جمعية ثقافية إسلامية في السنغال (1950)", "تأسيس كوسكاس لتنظيم المولد (1968)"],
        wo: ["Sos dahira Moustarchidine Wal Moustarchidati", "Sos njëkk association culturelle islamique Senegaal (1950)", "Njëkk COSKAS ngir organise Gamou (1968)"]
      },
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/jtrbkp29_IMG-20260206-WA0053.jpg"
    },
    {
      name: "Serigne Abdoul Aziz Sy Al Amine",
      title: { fr: "Le Bâtisseur et Diplomate", en: "The Builder and Diplomat", ar: "الباني والدبلوماسي", wo: "Tabaxkat ak diplomate" },
      period: "1928 - 2017",
      icon: Building,
      description: {
        fr: "Homme de projets et de vision, il a lancé de grands chantiers d'infrastructure à Tivaouane tout en renforçant les liens avec la communauté tidiane internationale.",
        en: "A man of projects and vision, he launched major infrastructure projects in Tivaouane while strengthening ties with the international Tidiane community.",
        ar: "رجل المشاريع والرؤية، أطلق مشاريع بنية تحتية كبرى في تيفاوان مع تعزيز الروابط مع المجتمع التجاني الدولي.",
        wo: "Nit ku projet ak vision, mu tabax infrastruktiir yu mag ci Tiwaawaan te mu yokku lien ak komunite tijaan international bi."
      },
      contributions: {
        fr: ["Construction de la nouvelle aile de la Grande Mosquée", "Développement des œuvres sociales (hôpitaux, écoles)", "Renforcement des liens avec les disciples de la diaspora"],
        en: ["Construction of the new wing of the Grand Mosque", "Development of social works (hospitals, schools)", "Strengthening ties with diaspora disciples"],
        ar: ["بناء الجناح الجديد للمسجد الكبير", "تطوير الأعمال الاجتماعية (المستشفيات، المدارس)", "تعزيز الروابط مع تلاميذ المهجر"],
        wo: ["Tabax barab bu bees bu Jàkka bu mag bi", "Yàgg liggéey social yi (opital, ekol)", "Yokku lien ak taalibe diaspora yi"]
      },
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/dwimysfs_FB_IMG_1770340522540.jpg"
    },
    {
      name: "Serigne Babacar Sy Mansour",
      title: { fr: "Le Guide Actuel", en: "The Current Guide", ar: "المرشد الحالي", wo: "Guide tey" },
      period: "1932 - Aujourd'hui",
      icon: Users,
      description: {
        fr: "L'actuel Khalife, garant de l'orthodoxie et de la continuité. Il poursuit l'œuvre de ses prédécesseurs en adaptant l'enseignement aux défis contemporains tout en préservant l'authenticité de la Tariqa.",
        en: "The current Khalife, guarantor of orthodoxy and continuity. He continues the work of his predecessors by adapting teaching to contemporary challenges while preserving the authenticity of the Tariqa.",
        ar: "الخليفة الحالي، ضامن الأرثوذكسية والاستمرارية. يواصل عمل أسلافه بتكييف التعليم مع التحديات المعاصرة مع الحفاظ على أصالة الطريقة.",
        wo: "Xaliifa tey, garant ortodoksi ak continuité. Mu topp liggéey ya ñëwoon di yëggo jàng ci défis tey yi te di sàmm dëgg Tariqa."
      },
      contributions: {
        fr: ["Modernisation de la communication (médias numériques)", "Renforcement de l'unité des disciples", "Adaptation de l'enseignement aux réalités du 21e siècle"],
        en: ["Modernization of communication (digital media)", "Strengthening the unity of disciples", "Adaptation of teaching to 21st century realities"],
        ar: ["تحديث الاتصالات (الوسائط الرقمية)", "تعزيز وحدة التلاميذ", "تكييف التعليم مع واقع القرن الحادي والعشرين"],
        wo: ["Yëggo komunikaasion (média numérique)", "Yokku bokk taalibe yi", "Yëggo jàng ci réalité 21e siècle"]
      },
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/2yhxnkcb_FB_IMG_1770340630966.jpg",
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
              {t('lineageOfHeirs')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              {t('heirsSubtitle')}
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
              {t('heirsIntro')}
            </p>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed">
              {t('successionPrinciple')}
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
                    <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] flex items-center justify-center p-6 lg:p-8">
                      <div className="relative">
                        <img
                          src={khalife.image}
                          alt={khalife.name}
                          className="max-h-80 lg:max-h-96 w-auto object-contain rounded-lg shadow-2xl"
                        />
                        <div className="absolute -top-3 -left-3">
                          <div className="w-14 h-14 bg-[#004D33] rounded-full flex items-center justify-center shadow-lg border-2 border-[#D4AF37]">
                            <Icon className="w-7 h-7 text-[#D4AF37]" />
                          </div>
                        </div>
                      </div>
                      {khalife.current && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-[#D4AF37] text-[#004D33] px-4 py-2 rounded-full text-center font-bold text-sm">
                            {t('currentKhalife')}
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
                        {khalife.title[language] || khalife.title.fr}
                      </p>

                      <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                        {khalife.description[language] || khalife.description.fr}
                      </p>

                      <div className="border-t-2 border-[#E8F5E9] pt-6">
                        <h3 className="text-lg font-bold text-[#004D33] mb-4">
                          {t('majorContributionsLabel')}
                        </h3>
                        <ul className="space-y-3">
                          {(khalife.contributions[language] || khalife.contributions.fr).map((contribution, idx) => (
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
            {t('unbrokenChain')}
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            {t('chainText')}
          </p>
          
          <p className="text-lg text-white/80 leading-relaxed">
            {t('continuityGuarantee')}
          </p>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              رَضِيَ اللهُ عَنْهُمْ أَجْمَعِينَ
              <br />
              {t('mayAllahBePleasedWithThemAll')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LigneeKhalifes;