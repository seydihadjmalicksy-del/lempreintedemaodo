import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import Newsletter from "../components/Newsletter";
import StatsCounter from "../components/StatsCounter";
import ShareButtons from "../components/ShareButtons";
import { ArrowRight, Sparkles, Calendar, MapPin, Quote, Heart, Phone, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [homepageSections, setHomepageSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch homepage sections (Wattu promo, Donations, etc.)
        const sectionsResponse = await axios.get(`${API}/homepage-sections/`);
        if (sectionsResponse.data) {
          setHomepageSections(sectionsResponse.data);
        }
        
        // Fetch featured videos
        const videosResponse = await axios.get(`${API}/videos/featured`);
        setFeaturedVideos(videosResponse.data);
        
        // Fetch daily quote
        const quoteResponse = await axios.get(`${API}/quotes/daily`);
        if (quoteResponse.data) {
          setDailyQuote(quoteResponse.data);
        }
        
        // Fetch upcoming events
        const eventsResponse = await axios.get(`${API}/events`);
        if (eventsResponse.data?.events) {
          setUpcomingEvents(eventsResponse.data.events);
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get text based on language
  const getText = (textObj) => {
    if (!textObj) return "";
    return textObj[language] || textObj.fr || textObj.en || "";
  };

  // Get quote text based on language
  const getQuoteText = () => {
    if (!dailyQuote) return "";
    switch(language) {
      case 'en': return dailyQuote.text_en || dailyQuote.text_fr;
      case 'ar': return dailyQuote.text_ar || dailyQuote.text_fr;
      case 'wo': return dailyQuote.text_wo || dailyQuote.text_fr;
      default: return dailyQuote.text_fr;
    }
  };

  // Get event text based on language
  const getEventText = (event, field) => {
    const langField = `${field}_${language}`;
    return event[langField] || event[`${field}_fr`] || event[field];
  };

  // Format event date for display
  const formatEventDate = (dateStr, recurrencePattern) => {
    if (recurrencePattern === 'weekly') {
      return language === 'en' ? 'Every Friday' : 
             language === 'ar' ? 'كل جمعة' : 
             language === 'wo' ? 'Ajjuma bu nekk' : 
             'Tous les vendredis';
    }
    const date = new Date(dateStr);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#006B47]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center overflow-hidden"
        data-testid="hero-section"
      >
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
            alt="Grande Mosquée de Tivaouane"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#006B47] via-[#006B47]/85 to-[#006B47]/70"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E6B800]/25 backdrop-blur-sm border border-[#FFD54F]/40 rounded-full px-6 py-2 mb-8 glow-gold">
            <Sparkles className="w-4 h-4 text-[#FFD54F]" />
            <span className="text-[#FFD54F] text-sm font-medium">{t('welcomeMessage')}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-gradient-gold drop-shadow-lg">{t('heroTitle')}</span>
          </h1>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/gallery"
              data-testid="hero-cta-gallery"
              className="btn-primary inline-flex items-center gap-2"
            >
              {language === 'en' ? 'Explore Gallery' : language === 'ar' ? 'استكشف المعرض' : language === 'wo' ? 'Seetlu galerie bi' : 'Explorer la Galerie'}
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              to="/about"
              data-testid="hero-cta-about"
              className="btn-secondary"
            >
              {t('learnMore')}
            </Link>
          </div>
        </div>

        {/* Gold Border at Bottom with Shimmer */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#FFD54F] to-transparent shimmer"></div>
      </section>

      {/* Section Bienvenue avec Logo */}
      <section className="py-16 bg-gradient-to-b from-[#FFFEF8] to-white" data-testid="welcome-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/logo-vf.png" 
              alt="L'empreinte de Maodo - Logo" 
              className="h-40 w-40 md:h-48 md:w-48 mx-auto rounded-full object-cover shadow-xl border-4 border-[#E6B800] glow-gold"
            />
          </div>
          
          {/* Titre de bienvenue */}
          <h2 className="text-3xl md:text-4xl font-bold text-[#006B47] mb-6">
            {language === 'en' ? 'Welcome to L\'empreinte de Maodo' : 
             language === 'ar' ? 'مرحباً بكم في بصمة مودو' : 
             language === 'wo' ? 'Dalal ak jàmm ci L\'empreinte de Maodo' : 
             'Bienvenue sur L\'empreinte de Maodo'}
          </h2>
          
          {/* Texte de présentation */}
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              {language === 'en' 
                ? 'This portal is dedicated to the preservation and transmission of the spiritual heritage of El Hadji Malick Sy (1855-1922), founder of the Khadra of Tivaouane and a major figure of the Tijaniyya in West Africa.'
                : language === 'ar'
                ? 'هذه البوابة مخصصة للحفاظ على التراث الروحي للحاج مالك سي (1855-1922) ونقله، مؤسس الخضراء في تيفاوان والشخصية البارزة في الطريقة التجانية في غرب أفريقيا.'
                : language === 'wo'
                ? 'Bii portal dañu ko sos ngir wattu ak yóbbu njàng bu El Hadji Malick Sy (1855-1922), ki sos Khadra gu Tivaouane te mooy kimm bu mag ci Tijâniyya ci Afrik sowwu jant.'
                : 'Ce portail est dédié à la préservation et à la transmission de l\'héritage spirituel d\'El Hadji Malick Sy (1855-1922), fondateur de la Khadra de Tivaouane et figure majeure de la Tijaniyya en Afrique de l\'Ouest.'}
            </p>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-8">
              {language === 'en'
                ? 'Here, you will discover the teachings, writings, and wisdom of a man who dedicated his life to Islamic education, social peace, and the spiritual elevation of souls.'
                : language === 'ar'
                ? 'هنا، ستكتشفون تعاليم وكتابات وحكمة رجل كرّس حياته للتعليم الإسلامي والسلام الاجتماعي والرقي الروحي للنفوس.'
                : language === 'wo'
                ? 'Fii, dangay gis njàng yi, bindu yi ak xam-xam ku jëlee dundam ngir jàng Islaam, jamm ci àddina ak yokk bakkan yi.'
                : 'Ici, vous découvrirez les enseignements, les écrits et la sagesse d\'un homme qui a consacré sa vie à l\'éducation islamique, à la paix sociale et à l\'élévation spirituelle des âmes.'}
            </p>
            
            {/* Citation inspirante */}
            <div className="bg-[#006B47]/5 border-l-4 border-[#E6B800] rounded-r-lg p-6 shadow-md">
              <p className="text-xl italic text-[#006B47] font-medium">
                {language === 'en'
                  ? '"Knowledge is a light that God places in the heart of whomever He wills."'
                  : language === 'ar'
                  ? '"العلم نور يقذفه الله في قلب من يشاء"'
                  : language === 'wo'
                  ? '"Xam-xam mooy leer bu Yàlla def ci xol ku ko neex."'
                  : '"La connaissance est une lumière que Dieu dépose dans le cœur de qui Il veut."'}
              </p>
              <p className="text-[#E6B800] font-semibold mt-3">— El Hadji Malick Sy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Homepage Sections (Wattu, Dons, etc.) */}
      {homepageSections.map((section) => {
        if (section.section_type === "wattu_promo") {
          return (
            <section key={section.id} className="py-16 bg-gradient-to-br from-[#006B47] to-[#004D33]" data-testid="wattu-section">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <BookOpen className="w-10 h-10 text-[#FFD54F]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {getText(section.title)}
                </h2>
                <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto">
                  {getText(section.description)}
                </p>
                <Link
                  to={section.content?.link || "/wattu"}
                  data-testid="wattu-access-btn"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFD54F] to-[#E6B800] hover:from-[#E6B800] hover:to-[#FFD54F] text-[#004D33] font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 glow-gold"
                >
                  <BookOpen className="w-6 h-6" />
                  {getText(section.content?.button_text) || "Accéder à Wattu"}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </section>
          );
        }
        
        if (section.section_type === "donations") {
          return (
            <section key={section.id} className="py-16 bg-[#006B47]" data-testid="donations-section">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#FFD54F] to-[#E6B800] p-6 text-center">
                    <Heart className="w-12 h-12 text-white mx-auto mb-3 drop-shadow-md" />
                    <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm">
                      {getText(section.title)}
                    </h2>
                  </div>
                  
                  <div className="p-8">
                    <p className="text-lg text-[#4A4A4A] text-center mb-8 leading-relaxed">
                      {getText(section.description)}
                    </p>
                    
                    {/* Informations de paiement */}
                    <div className="bg-[#006B47]/5 rounded-xl p-6 text-center">
                      <h3 className="text-xl font-bold text-[#006B47] mb-4">
                        {getText(section.content?.how_to_donate_title) || "Comment faire un don"}
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {section.content?.payment_methods?.map((method, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-shadow">
                            <Phone className="w-6 h-6 text-[#E6B800]" />
                            <div className="text-left">
                              <p className="text-sm text-[#888888]">{method.label}</p>
                              <p className="text-xl font-bold text-[#006B47]">{method.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {section.content?.quote && (
                        <p className="text-sm text-[#888888] mt-6 italic">
                          {getText(section.content.quote)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }
        
        return null;
      })}

      {/* Citation du Jour & Calendrier */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Citation du Jour */}
            <div className="bg-gradient-to-br from-[#006B47] to-[#004D33] rounded-2xl p-8 text-white shadow-xl glow-emerald">
              <div className="flex items-center gap-3 mb-6">
                <Quote className="w-8 h-8 text-[#FFD54F]" />
                <h3 className="text-xl font-bold">{t('quoteOfDay')}</h3>
              </div>
              {dailyQuote ? (
                <>
                  <blockquote className="text-2xl font-light italic leading-relaxed mb-6">
                    "{getQuoteText()}"
                  </blockquote>
                  <p className="text-[#FFD54F] font-semibold">
                    — {dailyQuote.author}
                  </p>
                </>
              ) : (
                <blockquote className="text-2xl font-light italic leading-relaxed mb-6">
                  "{t('quote1')}"
                </blockquote>
              )}
            </div>

            {/* Calendrier des Événements */}
            <div className="bg-[#FFFEF8] rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-8 h-8 text-[#006B47]" />
                <h3 className="text-xl font-bold text-[#006B47]">{t('upcomingEvents')}</h3>
              </div>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? upcomingEvents.slice(0, 3).map((event, index) => (
                  <div 
                    key={event.id || index}
                    className={`flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow ${
                      event.event_type === 'gamou' ? 'border-l-4 border-[#E6B800]' : 
                      event.event_type === 'ziarra' ? 'border-l-4 border-[#006B47]' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-[#006B47]">{getEventText(event, 'name')}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-[#888888]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatEventDate(event.date, event.recurrence_pattern)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-[#888888]">{t('noFeaturedVideos')}</p>
                )}
              </div>
              <Link 
                to="/evenements/gamou"
                className="inline-flex items-center gap-2 text-[#006B47] font-semibold mt-4 hover:text-[#E6B800] transition-colors"
              >
                {t('seeAll')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Videos Section */}
      <section className="py-16 lg:py-24 islamic-pattern" data-testid="featured-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#006B47] mb-4">
              {t('featuredVideos')}
            </h2>
            <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
              {language === 'en' ? 'Discover our most popular and inspiring content' : 
               language === 'ar' ? 'اكتشف محتوانا الأكثر شعبية وإلهاماً' :
               language === 'wo' ? 'Gis njàmbaar yi ci kow' :
               'Découvrez nos contenus les plus populaires et inspirants'}
            </p>
          </div>

          {featuredVideos.length > 0 ? (
            <>
              {/* Bento Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Large Featured Video */}
                {featuredVideos[0] && (
                  <div className="lg:row-span-2">
                    <VideoCard video={featuredVideos[0]} featured={true} />
                  </div>
                )}

                {/* Two Smaller Videos */}
                {featuredVideos.slice(1, 3).map((video) => (
                  <div key={video.id}>
                    <VideoCard video={video} featured={true} />
                  </div>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12">
                <Link
                  to="/gallery"
                  data-testid="view-all-videos-btn"
                  className="inline-flex items-center gap-2 bg-white border-2 border-[#006B47] text-[#006B47] hover:bg-[#006B47] hover:text-white rounded-full px-8 py-3 font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  {t('seeAll')}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#888888]">
                {language === 'en' ? 'No featured videos available' : 
                 language === 'ar' ? 'لا تتوفر فيديوهات مميزة' :
                 language === 'wo' ? 'Amul bidiyo rafet' :
                 'Aucune vidéo en vedette disponible'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 lg:py-24 bg-white" data-testid="about-preview-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#006B47] mb-6">
                {t('heroTitle')}
              </h2>
              <p className="text-lg text-[#4A4A4A] mb-6 leading-relaxed">
                {language === 'en' ? 
                  'The Tidiane Foyer of Tivaouane is a Sufi brotherhood founded by Sheikh El Hadj Malick Sy, a great scholar and spiritual guide. It represents a path of spiritual purification and elevation of the soul through dhikr and prophetic teachings.' :
                 language === 'ar' ? 
                  'مركز التجانية في تيفاوان هو طريقة صوفية أسسها الشيخ الحاج مالك سي، العالم الكبير والمرشد الروحي. وهي تمثل طريق التزكية الروحية والارتقاء بالنفس من خلال الذكر والتعاليم النبوية.' :
                 language === 'wo' ?
                  'Foyer Tijaan Tiwaawaan dafa nekk tariqa suufi bu El Hadji Maalik Si tëkki, borom xam-xam bu mag ak guide spirituel. Moo di yoon wu sell wu ruu bi di ko yokk ci jëfandikoo dikr ak jàng yi ñu jël ci Yonent bi.' :
                  'Le Foyer Tidiane de Tivaouane est une confrérie soufie fondée par Cheikh El Hadj Malick Sy, un grand érudit et guide spirituel. Elle représente une voie de purification spirituelle et d\'élévation de l\'âme à travers le dhikr et les enseignements prophétiques.'}
              </p>
              <Link
                to="/about"
                data-testid="about-learn-more-btn"
                className="inline-flex items-center gap-2 text-[#006B47] hover:text-[#E6B800] font-medium transition-colors group"
              >
                {t('readMore')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
                  alt="Grande Mosquée de Tivaouane"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative Gold Border */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-[#E6B800] rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#006B47] to-[#004D33] text-white py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{t('heroTitle')}</h3>
            <p className="text-white/70">
              {language === 'en' ? 'On the path of spiritual purification' : 
               language === 'ar' ? 'على طريق التزكية الروحية' :
               language === 'wo' ? 'Ci yoon wu sell' :
               'Sur la voie de la purification spirituelle'}
            </p>
          </div>
          
          <div className="border-t border-[#E6B800]/30 pt-6">
            <p className="text-white/60 text-sm">
              © 2026 CRAT. {t('allRightsReserved')}.
            </p>
          </div>
        </div>
      </footer>

      {/* Newsletter */}
      <Newsletter />

      {/* Stats Counter */}
      <StatsCounter />
    </div>
  );
};

export default Home;
