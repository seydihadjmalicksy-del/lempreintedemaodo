import { Star, BookOpen, MapPin, Calendar, Heart, Award, Quote, Users, Image } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { usePageContent, getContentText } from "../../hooks/usePageContent";

const Maodo = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const { t, language } = useLanguage();
  
  // Fetch dynamic content from MongoDB
  const { content, loading: contentLoading } = usePageContent("maodo", language);

  const photos = [
    {
      url: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ypec6ou8_FB_IMG_1770343497173.jpg",
      caption: {
        fr: "Portrait de Maodo avec la Grande Mosquée de Tivaouane en arrière-plan",
        en: "Portrait of Maodo with the Grand Mosque of Tivaouane in the background",
        ar: "صورة مودو مع المسجد الكبير في تيفاوان في الخلفية",
        wo: "Nataal Maodo ak Jàkka bu mag bi ci ginnaaw"
      }
    },
    {
      url: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/d5prlzpy_FB_IMG_1770343515975.jpg",
      caption: {
        fr: "El Hadji Malick Sy tenant son chapelet - Photo historique",
        en: "El Hadji Malick Sy holding his rosary - Historic photo",
        ar: "الحاج مالك سي يحمل مسبحته - صورة تاريخية",
        wo: "El Hadji Maalik Si muy tegu chapelet bi - Nataal taariix"
      }
    },
    {
      url: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/4jvj34rl_FB_IMG_1770343569579.jpg",
      caption: {
        fr: "Maodo accompagné de ses disciples à Tivaouane",
        en: "Maodo accompanied by his disciples in Tivaouane",
        ar: "مودو برفقة تلاميذه في تيفاوان",
        wo: "Maodo ak taalibe yi ci Tiwaawaan"
      }
    },
    {
      url: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ov0hfotv_FB_IMG_1770343528749.jpg",
      caption: {
        fr: "Portrait sépia d'El Hadji Malick Sy",
        en: "Sepia portrait of El Hadji Malick Sy",
        ar: "صورة بنية اللون للحاج مالك سي",
        wo: "Nataal sépia El Hadji Maalik Si"
      }
    }
  ];

  // Helper function to parse JSON content from API
  const parseJsonContent = (section, fallback) => {
    try {
      const text = content?.[section]?.text;
      if (text) {
        return JSON.parse(text);
      }
    } catch (e) {
      console.log(`Using fallback for ${section}`);
    }
    return fallback;
  };

  // Static fallback data
  const staticTimeline = [
    { year: "1855", event: t('birthDesc') },
    { year: "1855-1862", event: t('quranMemorizationDesc') },
    { year: "1862-1884", event: t('islamicStudiesDesc') },
    { year: "1884", event: t('saintLouisSettlementDesc') },
    { year: "1886-1888", event: t('hajjPilgrimageDesc') },
    { year: "1892", event: t('zawiyaNdarDesc') },
    { year: "1900", event: t('tivaouaneSettlementDesc') },
    { year: "1902", event: t('zawiyaTivaouaneDesc') },
    { year: "1922", event: t('returnToGodDesc') }
  ];

  const staticContributions = [
    { title: t('gamouFounder'), description: t('gamouFounderDesc') },
    { title: t('schoolBuilder'), description: t('schoolBuilderDesc') },
    { title: t('tijaniyyaSpreader'), description: t('tijaniyyaSpreaderDesc') },
    { title: t('manOfPeace'), description: t('manOfPeaceDesc') },
    { title: t('prolificAuthor'), description: t('prolificAuthorDesc') },
    { title: t('sunnaReviver'), description: t('sunnaReviverDesc') }
  ];

  // Use dynamic content or fallback
  const timeline = parseJsonContent("timeline", staticTimeline);
  const contributions = parseJsonContent("contributions", staticContributions);
  const oeuvresData = parseJsonContent("oeuvres", null);

  const oeuvres = {
    fr: [
      "Khilâçu-Dhahab (L'Or Décanté) - 30 tableaux poétiques sur la vie du Prophète",
      "Fâkihat at-Tullâb - Principes de la Tariqa Tijaniyya",
      "Kifâyat ar-Râghibîn - Traité sur le soufisme",
      "Ifhâm al-Munkir al-Jânî - Défense de la Tariqa",
      "Wassilatoul Mouna (Tayssir) - Invocations des Noms d'Allah"
    ],
    en: [
      "Khilâçu-Dhahab (The Decanted Gold) - 30 poetic tableaux on the Prophet's life",
      "Fâkihat at-Tullâb - Principles of the Tijaniyya Tariqa",
      "Kifâyat ar-Râghibîn - Treatise on Sufism",
      "Ifhâm al-Munkir al-Jânî - Defense of the Tariqa",
      "Wassilatoul Mouna (Tayssir) - Invocations of the Names of Allah"
    ],
    ar: [
      "خلاص الذهب - 30 لوحة شعرية عن حياة النبي",
      "فاكهة الطلاب - مبادئ الطريقة التجانية",
      "كفاية الراغبين - رسالة في التصوف",
      "إفهام المنكر الجاني - الدفاع عن الطريقة",
      "وسيلة المنى (تيسير) - أدعية أسماء الله"
    ],
    wo: [
      "Khilâçu-Dhahab (Wurus wu sell) - 30 woy ci dundu Yonent bi",
      "Fâkihat at-Tullâb - Tënk Tariqa Tijaan",
      "Kifâyat ar-Râghibîn - Téere ci tasawwuf",
      "Ifhâm al-Munkir al-Jânî - Dimbali Tariqa",
      "Wassilatoul Mouna (Tayssir) - Ñaan Turi Yàlla"
    ]
  };

  const contributions = [
    { title: t('gamouFounder'), description: t('gamouFounderDesc'), icon: Calendar },
    { title: t('schoolBuilder'), description: t('schoolBuilderDesc'), icon: BookOpen },
    { title: t('tijaniyyaSpreader'), description: t('tijaniyyaSpreaderDesc'), icon: Users },
    { title: t('manOfPeace'), description: t('manOfPeaceDesc'), icon: Heart },
    { title: t('prolificAuthor'), description: t('prolificAuthorDesc'), icon: BookOpen },
    { title: t('sunnaReviver'), description: t('sunnaReviverDesc'), icon: Star }
  ];

  const citations = [
    { texte: t('quote1'), contexte: t('onAction') },
    { texte: t('quote2'), contexte: t('onDivineKnowledge') },
    { texte: t('quote3'), contexte: t('onPropheticLove') }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="maodo-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-3 mb-6">
              <Star className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-semibold">{t('theFounder')}</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-4">
              El Hadji Malick Sy
            </h1>
            <p className="text-2xl text-[#D4AF37] font-semibold mb-4">
              Maodo - مودّو
            </p>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              (1855 - 1922)
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              {t('scholarSaint')}
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-8"></div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-[#4A4A4A] leading-relaxed mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-[#004D33] first-letter:float-left first-letter:mr-3">
              {/* Dynamic content from MongoDB or fallback to static */}
              {getContentText(content, "hero", t('maodoIntro'))}
            </p>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              {getContentText(content, "biography", t('maodoBio'))}
            </p>

            <div className="bg-[#F9F7F2] border-l-4 border-[#D4AF37] p-6 rounded-r-lg my-8">
              <Quote className="w-8 h-8 text-[#D4AF37] mb-4" />
              <p className="text-lg italic text-[#4A4A4A]">
                "{getContentText(content, "quote", t('maodoQuote'))}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie Photos */}
      <section className="py-16 bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-3 mb-4">
              <Image className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-semibold">{t('historicPhotos')}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {t('portraitsOfMaodo')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Photo principale */}
            <div className="lg:col-span-3">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={photos[selectedPhoto].url}
                  alt={photos[selectedPhoto].caption[language] || photos[selectedPhoto].caption.fr}
                  className="w-full h-auto max-h-[500px] object-contain bg-black"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <p className="text-white text-lg">{photos[selectedPhoto].caption[language] || photos[selectedPhoto].caption.fr}</p>
                </div>
              </div>
            </div>

            {/* Vignettes */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhoto(index)}
                  className={`relative rounded-xl overflow-hidden aspect-square transition-all ${
                    selectedPhoto === index 
                      ? 'ring-4 ring-[#D4AF37] scale-95' 
                      : 'hover:ring-2 ring-white/50'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption[language] || photo.caption.fr}
                    className="w-full h-full object-cover"
                  />
                  {selectedPhoto === index && (
                    <div className="absolute inset-0 bg-[#D4AF37]/20"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              {t('lifePath')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-[#D4AF37]/30 transform lg:-translate-x-1/2"></div>

            <div className="space-y-8">
              {timeline.map((event, index) => {
                const Icon = event.icon;
                const isLeft = index % 2 === 0;
                return (
                  <div key={index} className={`relative flex items-start gap-8 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Content */}
                    <div className={`flex-1 ml-16 lg:ml-0 ${isLeft ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                        <span className="inline-block bg-[#004D33] text-white px-4 py-1 rounded-full text-sm font-bold mb-3">
                          {event.year}
                        </span>
                        <h3 className="text-xl font-bold text-[#004D33] mb-2">{event.title}</h3>
                        <p className="text-[#4A4A4A]">{event.description}</p>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="absolute left-8 lg:left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#004D33] rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10">
                      <Icon className="w-5 h-5 text-[#D4AF37]" />
                    </div>

                    {/* Empty space for alternating layout */}
                    <div className="hidden lg:block flex-1"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Contributions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              {t('majorContributions')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributions.map((contribution, index) => {
              const Icon = contribution.icon;
              return (
                <div
                  key={index}
                  className="bg-[#F9F7F2] rounded-xl p-6 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-[#004D33] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#D4AF37] transition-colors">
                    <Icon className="w-7 h-7 text-[#D4AF37] group-hover:text-[#004D33] transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#004D33] mb-2">{contribution.title}</h3>
                  <p className="text-[#4A4A4A]">{contribution.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Oeuvres */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('literaryWorks')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-white/80">
              {t('literaryHeritage')}
            </p>
          </div>

          <div className="space-y-4">
            {(oeuvres[language] || oeuvres.fr).map((oeuvre, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center gap-4 hover:bg-white/20 transition-colors"
              >
                <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-[#004D33]" />
                </div>
                <p className="text-white">{oeuvre}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="/enseignements/ouvrages"
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-6 py-3 rounded-full font-bold transition-colors"
            >
              {t('viewAllWorks')}
            </a>
          </div>
        </div>
      </section>

      {/* Citations */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
              {t('wordsOfWisdom')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {citations.map((citation, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                <Quote className="w-8 h-8 text-[#D4AF37] mb-4" />
                <p className="text-lg text-[#004D33] font-medium italic mb-4">
                  "{citation.texte}"
                </p>
                <p className="text-sm text-[#888888]">{citation.contexte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Héritage */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-6">
            {t('eternalLegacy')}
          </h2>
          
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
            {t('legacyText')}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/histoire/khalifes"
              className="inline-flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-6 py-3 rounded-full font-bold transition-colors"
            >
              <Users className="w-5 h-5" />
              {t('hisSuccessors')}
            </a>
            <a
              href="/evenements/gamou"
              className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-6 py-3 rounded-full font-bold transition-colors"
            >
              <Calendar className="w-5 h-5" />
              {t('theGamou')}
            </a>
          </div>
        </div>
      </section>

      {/* Quote finale */}
      <section className="py-12 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-[#D4AF37] text-5xl mb-4">☪</p>
          <p className="text-xl italic text-white/90 mb-4">
            رَضِيَ اللهُ عَنْهُ وَأَرْضَاهُ
          </p>
          <p className="text-white/70">
            {t('mayAllahBePleasedWithHim')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Maodo;
