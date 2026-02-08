import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import Newsletter from "../components/Newsletter";
import StatsCounter from "../components/StatsCounter";
import ShareButtons from "../components/ShareButtons";
import { ArrowRight, Sparkles, Calendar, MapPin, Quote } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize data if needed
        await axios.post(`${API}/init-data`).catch(() => {});
        
        // Seed database with initial content
        await axios.post(`${API}/admin/seed`).catch(() => {});
        
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
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#004D33]"></div>
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33] via-[#004D33]/80 to-[#004D33]/60"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full px-6 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm font-medium">{t('welcomeMessage')}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-[#D4AF37]">{t('heroTitle')}</span>
            <br />
            {t('heroSubtitle')}
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

        {/* Gold Border at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
      </section>

      {/* Citation du Jour & Calendrier */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Citation du Jour */}
            <div className="bg-gradient-to-br from-[#004D33] to-[#003d29] rounded-2xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Quote className="w-8 h-8 text-[#D4AF37]" />
                <h3 className="text-xl font-bold">{t('quoteOfDay')}</h3>
              </div>
              {dailyQuote ? (
                <>
                  <blockquote className="text-2xl font-light italic leading-relaxed mb-6">
                    "{getQuoteText()}"
                  </blockquote>
                  <p className="text-[#D4AF37] font-semibold">
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
            <div className="bg-[#F9F7F2] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-8 h-8 text-[#004D33]" />
                <h3 className="text-xl font-bold text-[#004D33]">{t('upcomingEvents')}</h3>
              </div>
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? upcomingEvents.slice(0, 3).map((event, index) => (
                  <div 
                    key={event.id || index}
                    className={`flex items-start gap-4 p-4 rounded-xl bg-white ${
                      event.event_type === 'gamou' ? 'border-l-4 border-[#D4AF37]' : 
                      event.event_type === 'ziarra' ? 'border-l-4 border-[#004D33]' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-[#004D33]">{getEventText(event, 'name')}</h4>
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
                className="inline-flex items-center gap-2 text-[#004D33] font-semibold mt-4 hover:text-[#D4AF37] transition-colors"
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
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
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
                  className="inline-flex items-center gap-2 bg-white border-2 border-[#004D33] text-[#004D33] hover:bg-[#004D33] hover:text-white rounded-full px-8 py-3 font-medium transition-all duration-300 shadow-md hover:shadow-lg"
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
              <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-6">
                {t('heroTitle')} {t('heroSubtitle')}
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
                className="inline-flex items-center gap-2 text-[#004D33] hover:text-[#D4AF37] font-medium transition-colors group"
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
              <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-[#D4AF37] rounded-xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#004D33] text-white py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">{t('heroTitle')} {t('heroSubtitle')}</h3>
            <p className="text-white/70">
              {language === 'en' ? 'On the path of spiritual purification' : 
               language === 'ar' ? 'على طريق التزكية الروحية' :
               language === 'wo' ? 'Ci yoon wu sell' :
               'Sur la voie de la purification spirituelle'}
            </p>
          </div>
          
          <div className="border-t border-[#D4AF37]/30 pt-6">
            <p className="text-white/60 text-sm">
              © 2025 CRAT. {t('allRightsReserved')}.
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
