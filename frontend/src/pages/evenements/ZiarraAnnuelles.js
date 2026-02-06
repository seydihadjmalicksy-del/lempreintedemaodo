import { Calendar, Users, Heart } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const ZiarraAnnuelles = () => {
  const { t, language } = useLanguage();

  const ziarras = [
    {
      nom: t('ziarraGeneraleTitle'),
      date: t('ziarraGeneraleDate'),
      icon: Users,
      description: t('ziarraGeneraleDesc'),
      programme: {
        fr: [
          "Samedi 19 avril : Arrivée des pèlerins et Gamou traditionnel",
          "Dimanche matin : Grande prière à la mosquée",
          "Dimanche : Renouvellement de l'allégeance des Dahiras",
          "Dimanche soir : Allocution du Khalife et bénédictions",
          "Forum sur les Dahiras comme vecteurs de développement"
        ],
        en: [
          "Saturday April 19: Arrival of pilgrims and traditional Gamou",
          "Sunday morning: Grand prayer at the mosque",
          "Sunday: Renewal of Dahiras' allegiance",
          "Sunday evening: Khalife's address and blessings",
          "Forum on Dahiras as vectors of development"
        ],
        ar: [
          "السبت 19 أبريل: وصول الحجاج والمولد التقليدي",
          "صباح الأحد: الصلاة الكبرى في المسجد",
          "الأحد: تجديد بيعة الدوائر",
          "مساء الأحد: خطاب الخليفة والبركات",
          "منتدى حول الدوائر كناقلات للتنمية"
        ],
        wo: [
          "Gàww 19 avril: Ñëw ajibi yi ak Gamou traditionnel",
          "Dibéer suba: Julli bu mag ci jàkka bi",
          "Dibéer: Soppisaat bay'a Dahira yi",
          "Dibéer ngoon: Wax Xaliifa bi ak baraka yi",
          "Forum ci Dahiras yi ni vecteurs développement"
        ]
      },
      signification: {
        fr: "C'est le moment où chaque tidiane réaffirme son engagement spirituel et reçoit les orientations du guide pour l'année à venir.",
        en: "This is the moment when every Tidiane reaffirms their spiritual commitment and receives guidance from the guide for the coming year.",
        ar: "هذه هي اللحظة التي يؤكد فيها كل تجاني التزامه الروحي ويتلقى توجيهات المرشد للعام القادم.",
        wo: "Mooy waxtu bu Tijaan bu nekk di soppisaat jëf am bu sell te am orientations guide bi ngir at buy ñëw."
      }
    },
    {
      nom: t('ziarraMaodoTitle'),
      date: t('ziarraMaodoDate'),
      icon: Heart,
      description: t('ziarraMaodoDesc'),
      programme: {
        fr: [
          "Récitation du Coran au mausolée",
          "Khoutba retraçant la vie de Maodo",
          "Chants de qasidas à sa gloire",
          "Prières collectives",
          "Distribution de nourriture (Hadiya)"
        ],
        en: [
          "Quran recitation at the mausoleum",
          "Sermon retracing Maodo's life",
          "Qasida chants in his glory",
          "Collective prayers",
          "Food distribution (Hadiya)"
        ],
        ar: [
          "تلاوة القرآن في الضريح",
          "خطبة تستعرض حياة مودو",
          "أناشيد القصائد تمجيداً له",
          "صلوات جماعية",
          "توزيع الطعام (الهدية)"
        ],
        wo: [
          "Jang Alxuraan ci mausolée bi",
          "Khoutba buy wax dund Maodo",
          "Chants qasidas ngir ko hormale",
          "Julli mbooloo",
          "Seddale lekk (Hadiya)"
        ]
      },
      signification: {
        fr: "Honorer la mémoire de Maodo et se rappeler ses enseignements et son exemple.",
        en: "Honor Maodo's memory and remember his teachings and example.",
        ar: "تكريم ذكرى مودو وتذكر تعاليمه ومثاله.",
        wo: "Hormale xam-xam Maodo ak fàttaliku jàng yi ak exemple am."
      }
    },
    {
      nom: t('ziarraKhalifesTitle'),
      date: t('ziarraKhalifesDate'),
      icon: Calendar,
      description: t('ziarraKhalifesDesc'),
      programme: {
        fr: [
          "Visites aux mausolées respectifs",
          "Récits sur les contributions de chaque khalife",
          "Prières et invocations",
          "Rencontres communautaires"
        ],
        en: [
          "Visits to respective mausoleums",
          "Accounts of each khalife's contributions",
          "Prayers and invocations",
          "Community meetings"
        ],
        ar: [
          "زيارات للأضرحة المعنية",
          "روايات عن إسهامات كل خليفة",
          "الصلوات والأدعية",
          "لقاءات مجتمعية"
        ],
        wo: [
          "Ziarra ci mausolées yi",
          "Wax ci jëf yu xaliifa bu nekk",
          "Julli ak doua",
          "Ndaje communautaires"
        ]
      },
      signification: {
        fr: "Maintenir vivante la mémoire des guides successifs et leurs apports à la Tariqa.",
        en: "Keep alive the memory of successive guides and their contributions to the Tariqa.",
        ar: "الحفاظ على ذكرى المرشدين المتعاقبين وإسهاماتهم في الطريقة حية.",
        wo: "Sàmm fàttaliku guides yi topp ak li ñu jàpp ci Tariqa bi."
      }
    }
  ];

  const conseilsPelerins = [
    {
      titre: t('spiritualPreparation'),
      conseils: {
        fr: [
          "Formuler une intention sincère (Niya) avant le départ",
          "Se purifier spirituellement par le repentir",
          "Multiplier les prières sur le Prophète (PSL) durant le voyage"
        ],
        en: [
          "Formulate a sincere intention (Niya) before departure",
          "Purify yourself spiritually through repentance",
          "Multiply prayers upon the Prophet (PBUH) during the journey"
        ],
        ar: [
          "صياغة نية صادقة قبل المغادرة",
          "التطهر روحياً بالتوبة",
          "الإكثار من الصلاة على النبي (ص) أثناء الرحلة"
        ],
        wo: [
          "Am niya bu dëgg balaa dem",
          "Set sa xol ci tuub",
          "Yaatal julli ci Yonent bi (YWS) ci tukki bi"
        ]
      }
    },
    {
      titre: t('logisticalPreparation'),
      conseils: {
        fr: [
          "Réserver son hébergement à l'avance",
          "Prévoir des vêtements modestes et confortables",
          "Apporter son Wird et son chapelet",
          "Se munir d'argent pour les dons (Hadiya)"
        ],
        en: [
          "Book accommodation in advance",
          "Plan modest and comfortable clothing",
          "Bring your Wird and prayer beads",
          "Bring money for donations (Hadiya)"
        ],
        ar: [
          "حجز الإقامة مسبقاً",
          "تحضير ملابس محتشمة ومريحة",
          "إحضار الورد والسبحة",
          "إحضار المال للتبرعات (الهدية)"
        ],
        wo: [
          "Réserve paxas toog balaa",
          "Jàpp yéré yu sell te yu neex",
          "Yóbbu sa Wird ak sa chapelet",
          "Yóbbu xaalis ngir don (Hadiya)"
        ]
      }
    },
    {
      titre: t('onSite'),
      conseils: {
        fr: [
          "Respecter les consignes des organisateurs",
          "Participer aux prières collectives",
          "Visiter les lieux saints avec recueillement",
          "Maintenir la propreté des espaces publics"
        ],
        en: [
          "Follow the organizers' instructions",
          "Participate in collective prayers",
          "Visit holy places with reflection",
          "Maintain cleanliness of public spaces"
        ],
        ar: [
          "اتباع تعليمات المنظمين",
          "المشاركة في الصلوات الجماعية",
          "زيارة الأماكن المقدسة بتأمل",
          "الحفاظ على نظافة الأماكن العامة"
        ],
        wo: [
          "Topp consignes organisateurs yi",
          "Bokk ci julli mbooloo yi",
          "Ziarra paxas yu sell yi ak xel",
          "Sàmm set paxas yi"
        ]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="ziarra-page">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
            alt={t('ziarraTitle')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/90 via-[#004D33]/80 to-[#004D33]/70"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                {t('ziarraTitle')}
                <br />
                <span className="text-[#D4AF37]">{t('spiritualPilgrimages')}</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                {t('ziarraHeroDesc')}
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
              {t('ziarraIntro1')}
            </p>

            <p className="text-lg text-[#4A4A4A] leading-relaxed">
              {t('ziarraIntro2')}
            </p>
          </div>
        </div>
      </section>

      {/* Les Principales Ziarra */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              {t('mainZiarras')}
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
                        <h4 className="font-bold text-[#004D33] mb-4 text-lg">{t('program')} :</h4>
                        <ul className="space-y-3">
                          {(ziarra.programme[language] || ziarra.programme.fr).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-[#4A4A4A]">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-bold text-[#004D33] mb-4 text-lg">{t('spiritualSignificance')} :</h4>
                        <div className="bg-[#E8F5E9] rounded-lg p-6 border-l-4 border-[#D4AF37]">
                          <p className="text-[#4A4A4A] leading-relaxed">
                            {ziarra.signification[language] || ziarra.signification.fr}
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
              {t('pilgrimGuide')}
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
                  {(section.conseils[language] || section.conseils.fr).map((conseil, idx) => (
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
            {t('ziarraSoulJourney')}
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            {t('ziarraConclusion')}
          </p>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ZiarraAnnuelles;
