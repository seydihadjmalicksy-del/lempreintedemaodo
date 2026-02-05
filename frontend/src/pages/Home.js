import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

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
            src="https://images.unsplash.com/photo-1643522058235-6530723ce22b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwxfHxncmFuZCUyMG1vc3F1ZSUyMHRpdmFvdWFuZSUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3NzAzMDgwMjd8MA&ixlib=rb-4.1.0&q=85"
            alt="Grande Mosquée"
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
            Le Foyer Tidiane
            <br />
            <span className="text-[#D4AF37]">l'empreinte de Tivaouane !</span>
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
                Le Foyer Tidiane
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
                  src="https://images.unsplash.com/photo-1769805495744-d11b35e50b89?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxzcGlyaXR1YWwlMjByZWFkaW5nJTIwcXVyYW4lMjBwZWFjZWZ1bHxlbnwwfHx8fDE3NzAzMDgwMzR8MA&ixlib=rb-4.1.0&q=85"
                  alt="Lecture spirituelle"
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
            <h3 className="text-2xl font-bold mb-2">Le Foyer Tidiane de Tivaouane</h3>
            <p className="text-white/70">Sur la voie de la purification spirituelle</p>
          </div>
          
          <div className="border-t border-[#D4AF37]/30 pt-6">
            <p className="text-white/60 text-sm">
              © 2024 Foyer Tidiane Tivaouane. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
