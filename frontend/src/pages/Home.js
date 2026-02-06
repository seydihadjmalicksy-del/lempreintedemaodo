import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import Newsletter from "../components/Newsletter";
import StatsCounter from "../components/StatsCounter";
import { ArrowRight, Sparkles, Calendar, MapPin, Quote } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Citations de Maodo
const citations = [
  {
    texte: "La science sans la pratique est comme un arbre sans fruit.",
    source: "El Hadji Malick Sy"
  },
  {
    texte: "Celui qui connaît Dieu, son cœur trouve la paix.",
    source: "El Hadji Malick Sy"
  },
  {
    texte: "L'amour du Prophète (PSL) est la clé de tout bien.",
    source: "El Hadji Malick Sy"
  },
  {
    texte: "Le savoir est une lumière qui illumine le cœur du croyant.",
    source: "El Hadji Malick Sy"
  },
  {
    texte: "La patience dans l'épreuve est le signe de la foi sincère.",
    source: "El Hadji Malick Sy"
  }
];

// Événements à venir
const evenementsAVenir = [
  {
    titre: "Ziarra Générale 2025",
    date: "20 avril 2025",
    lieu: "Tivaouane",
    type: "ziarra"
  },
  {
    titre: "Gamou 2025",
    date: "4-5 septembre 2025",
    lieu: "Tivaouane",
    type: "gamou"
  },
  {
    titre: "Hadratoul Joumah",
    date: "Tous les vendredis",
    lieu: "Zawiya El Hadji Malick Sy",
    type: "hebdomadaire"
  }
];

const Home = () => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initialize data if needed
        await axios.post(`${API}/init-data`);
        
        // Fetch featured videos
        const response = await axios.get(`${API}/videos/featured`);
        setFeaturedVideos(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des vidéos:", error);
        toast.error("Erreur lors du chargement des vidéos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <span className="text-[#D4AF37] text-sm font-medium">Bienvenue dans la lumière spirituelle</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="text-[#D4AF37]">L'empreinte de Tivaouane</span>
            <br />
            dans la Tariqa Tidiane
          </h1>

          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Découvrez les enseignements spirituels, les conférences et les cérémonies 
            du Foyer Tidiane à travers notre collection de vidéos
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/gallery"
              data-testid="hero-cta-gallery"
              className="btn-primary inline-flex items-center gap-2"
            >
              Explorer la Galerie
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              to="/about"
              data-testid="hero-cta-about"
              className="btn-secondary"
            >
              En Savoir Plus
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
                <h3 className="text-xl font-bold">Citation du Jour</h3>
              </div>
              <blockquote className="text-2xl font-light italic leading-relaxed mb-6">
                "{citations[Math.floor(Date.now() / 86400000) % citations.length].texte}"
              </blockquote>
              <p className="text-[#D4AF37] font-semibold">
                — {citations[Math.floor(Date.now() / 86400000) % citations.length].source}
              </p>
            </div>

            {/* Calendrier des Événements */}
            <div className="bg-[#F9F7F2] rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-8 h-8 text-[#004D33]" />
                <h3 className="text-xl font-bold text-[#004D33]">Événements à Venir</h3>
              </div>
              <div className="space-y-4">
                {evenementsAVenir.map((event, index) => (
                  <div 
                    key={index}
                    className={`flex items-start gap-4 p-4 rounded-xl bg-white ${
                      event.type === 'gamou' ? 'border-l-4 border-[#D4AF37]' : 
                      event.type === 'ziarra' ? 'border-l-4 border-[#004D33]' : ''
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-[#004D33]">{event.titre}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-[#888888]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.lieu}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/evenements/gamou"
                className="inline-flex items-center gap-2 text-[#004D33] font-semibold mt-4 hover:text-[#D4AF37] transition-colors"
              >
                Voir tous les événements
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
              Vidéos en Vedette
            </h2>
            <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
              Découvrez nos contenus les plus populaires et inspirants
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
                  Voir toutes les vidéos
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#888888]">Aucune vidéo en vedette disponible</p>
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
                L'empreinte de Tivaouane dans la Tariqa Tidiane
              </h2>
              <p className="text-lg text-[#4A4A4A] mb-6 leading-relaxed">
                Le Foyer Tidiane de Tivaouane est une confrérie soufie fondée par 
                Cheikh El Hadj Malick Sy, un grand érudit et guide spirituel. 
                Elle représente une voie de purification spirituelle et d'élévation 
                de l'âme à travers le dhikr et les enseignements prophétiques.
              </p>
              <Link
                to="/about"
                data-testid="about-learn-more-btn"
                className="inline-flex items-center gap-2 text-[#004D33] hover:text-[#D4AF37] font-medium transition-colors group"
              >
                En savoir plus sur notre histoire
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
            <h3 className="text-2xl font-bold mb-2">L'empreinte de Tivaouane dans la Tariqa Tidiane</h3>
            <p className="text-white/70">Sur la voie de la purification spirituelle</p>
          </div>
          
          <div className="border-t border-[#D4AF37]/30 pt-6">
            <p className="text-white/60 text-sm">
              © 2025 Tariqa Tidiane de Tivaouane. Tous droits réservés.
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
