import { Calendar, MapPin, Users, Heart, Book, Music } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import ShareButtons from "../../components/ShareButtons";
import AddToCalendar from "../../components/AddToCalendar";
import { usePageContent, getContentText } from "../../hooks/usePageContent";

const Gamou = () => {
  const { t, language } = useLanguage();
  
  // Fetch dynamic content from MongoDB
  const { content, loading: contentLoading } = usePageContent("gamou", language);

  const phases = [
    {
      icon: Calendar,
      title: t('tenDaysOfBourde'),
      description: t('tenDaysOfBourdeDesc')
    },
    {
      icon: Book,
      title: t('nightlyTalks'),
      description: t('nightlyTalksDesc')
    },
    {
      icon: Users,
      title: t('massGathering'),
      description: t('massGatheringDesc')
    },
    {
      icon: Heart,
      title: t('mawlidNight'),
      description: t('mawlidNightDesc')
    }
  ];

  const practicalInfo = [
    {
      title: t('gamou2025'),
      icon: Calendar,
      content: t('gamouDate')
    },
    {
      icon: MapPin,
      title: t('mainLocation'),
      content: t('mainLocationDesc')
    },
    {
      icon: Users,
      title: t('attendance'),
      content: t('attendanceDesc')
    }
  ];

  const beforeDepartureAdvice = {
    fr: [
      "Réserver son hébergement plusieurs semaines à l'avance",
      "Prévoir des vêtements adaptés (tenues modestes)",
      "Se munir de son Wird et de son chapelet"
    ],
    en: [
      "Book accommodation several weeks in advance",
      "Plan appropriate clothing (modest attire)",
      "Bring your Wird and prayer beads"
    ],
    ar: [
      "حجز الإقامة قبل عدة أسابيع",
      "تحضير ملابس مناسبة (لباس محتشم)",
      "إحضار الورد والسبحة"
    ],
    wo: [
      "Réserve paxas toog ay ayu-bés balaa",
      "Jàpp yéré yu rafet (yéré yu sell)",
      "Yóbbu sa Wird ak sa chapelet"
    ]
  };

  const onSiteAdvice = {
    fr: [
      "Respecter l'ordre et la discipline des organisateurs",
      "Participer aux séances de Bourde et de dhikr",
      "Préserver la propreté des lieux saints"
    ],
    en: [
      "Respect the order and discipline of the organizers",
      "Participate in Bourde and dhikr sessions",
      "Preserve the cleanliness of holy places"
    ],
    ar: [
      "احترام نظام وانضباط المنظمين",
      "المشاركة في جلسات البردة والذكر",
      "الحفاظ على نظافة الأماكن المقدسة"
    ],
    wo: [
      "Topp mbir organisateurs yi",
      "Bokk ci séances Bourde ak dhikr",
      "Sàmm set paxas yu sell yi"
    ]
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="gamou-page">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
            alt={t('gamouTitle')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/90 via-[#004D33]/80 to-[#004D33]/70"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full px-6 py-2 mb-6">
                <Music className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-sm font-medium">{t('annualCelebration')}</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                {t('gamouTitle')}
                <br />
                <span className="text-[#D4AF37]">{t('mawlidAnNabawi')}</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                {/* Dynamic content from MongoDB or fallback to static */}
                {getContentText(content, "hero", t('gamouHeroDesc'))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Share Buttons */}
          <div className="flex justify-end mb-6">
            <ShareButtons 
              url="/evenements/gamou" 
              title={t('gamouTitle')}
              description={getContentText(content, "hero", t('gamouHeroDesc'))}
            />
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[#004D33] font-semibold mb-6 leading-relaxed">
              {/* Dynamic intro content */}
              {getContentText(content, "intro", t('gamouIntro1'))}
            </p>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              {t('gamouIntro2')}
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-[#004D33] italic mb-0">
                <strong>{t('gamouSpirit')} :</strong> "{t('gamouSpiritText')}"
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
              {t('gamouHistoryTitle')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-6 text-lg text-[#4A4A4A] leading-relaxed">
                <p>{t('gamouHistory1')}</p>
                <p>{t('gamouHistory2')}</p>
                <p>{t('gamouHistory3')}</p>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl relative">
                <img
                  src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
                  alt={t('gamouTitle')}
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
              {t('celebrationProgram')}
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
              {t('practicalInfo')}
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

          {/* Add to Calendar Button */}
          <div className="flex justify-center mb-12">
            <AddToCalendar 
              event={{
                id: "gamou-2025",
                name_fr: "Gamou de Tivaouane 2025",
                name_en: "Gamou of Tivaouane 2025",
                description_fr: "Célébration annuelle de la naissance du Prophète Muhammad (PSL) à Tivaouane",
                description_en: "Annual celebration of the birth of Prophet Muhammad (PBUH) in Tivaouane",
                date: "2025-09-05",
                location: "Tivaouane, Sénégal"
              }}
            />
          </div>

          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-[#004D33] mb-6 text-center">
              {t('pilgrimAdvice')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[#4A4A4A]">
              <div>
                <h4 className="font-bold text-[#004D33] mb-3">{t('beforeDeparture')}</h4>
                <ul className="space-y-2">
                  {(beforeDepartureAdvice[language] || beforeDepartureAdvice.fr).map((advice, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">•</span>
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-[#004D33] mb-3">{t('onSite')}</h4>
                <ul className="space-y-2">
                  {(onSiteAdvice[language] || onSiteAdvice.fr).map((advice, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#D4AF37] mt-1">•</span>
                      <span>{advice}</span>
                    </li>
                  ))}
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
            {t('appointmentWithEternity')}
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            {t('gamouConclusion')}
          </p>
          
          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ
              <br />
              {t('peaceAndBlessings')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gamou;
