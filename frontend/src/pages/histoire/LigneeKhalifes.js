import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Users, Crown, Star, Sparkles, Heart, BookOpen, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Icon mapping
const iconMap = {
  Crown, Star, Sparkles, Heart, BookOpen, Users
};

const LigneeKhalifes = () => {
  const [khalifes, setKhalifes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedKhalife, setExpandedKhalife] = useState(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchKhalifes = async () => {
      try {
        const response = await axios.get(`${API}/khalifes`);
        // Filter active khalifes and sort by order
        const activeKhalifes = (response.data || [])
          .filter(k => k.active)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        setKhalifes(activeKhalifes);
      } catch (error) {
        console.error("Error fetching khalifes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchKhalifes();
  }, []);

  const getText = (obj) => {
    if (!obj) return "";
    return obj[language] || obj.fr || obj.en || "";
  };

  const getContributions = (contributions) => {
    if (!contributions) return [];
    const list = contributions[language] || contributions.fr || contributions.en || [];
    return Array.isArray(list) ? list : [];
  };

  const getIcon = (iconName) => {
    return iconMap[iconName] || Crown;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#004D33] mx-auto mb-4"></div>
          <p className="text-[#4A4A4A]">Chargement...</p>
        </div>
      </div>
    );
  }

  // Find current khalife
  const currentKhalife = khalifes.find(k => k.current);

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Hero Section */}
      <section className="relative h-[400px] lg:h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-[#004D33] to-[#006644]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/95 via-[#004D33]/85 to-[#004D33]/75"></div>
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-[#D4AF37]/20 rounded-full">
                  <Users className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <span className="text-[#D4AF37] font-medium uppercase tracking-wider text-sm">
                  {t('history')}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {t('lineageOfHeirs') || 'La Lignée des Héritiers'}
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                {t('heirsSubtitle') || "Les Héritiers de Maodo : Gardiens de l'Héritage Spirituel"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-[#4A4A4A] leading-relaxed text-center">
              {t('heirsIntro') || "L'œuvre de Mawlaya El Hadji Malick Sy (rta) ne s'est pas éteinte avec lui en 1922. Elle a été portée par une lignée d'hommes d'exception : ses fils et ses disciples. Si la direction officielle de la confrérie (le Califat) a suivi une lignée précise, chaque héritier, qu'il ait accédé au trône de la Khadra ou non, a été un gardien vigilant du temple du savoir."}
            </p>
          </div>
        </div>
      </section>

      {/* Current Khalife Highlight */}
      {currentKhalife && (
        <section className="py-12 bg-gradient-to-br from-[#004D33] to-[#003d29]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#004D33] rounded-full font-semibold">
                <Crown className="w-5 h-5" />
                {t('currentKhalife') || 'Khalife Actuel'}
              </span>
            </div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="md:flex">
                {currentKhalife.image && (
                  <div className="md:w-1/3">
                    <img 
                      src={currentKhalife.image} 
                      alt={currentKhalife.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                )}
                <div className={`p-8 ${currentKhalife.image ? 'md:w-2/3' : 'w-full'}`}>
                  <h2 className="text-3xl font-bold text-[#004D33] mb-2">{currentKhalife.name}</h2>
                  <p className="text-[#D4AF37] font-medium mb-4">{getText(currentKhalife.title)}</p>
                  <p className="text-[#4A4A4A] leading-relaxed mb-6">{getText(currentKhalife.description)}</p>
                  {getContributions(currentKhalife.contributions).length > 0 && (
                    <div>
                      <h4 className="font-semibold text-[#004D33] mb-3">
                        {language === 'en' ? 'Major Contributions:' : 'Contributions Majeures :'}
                      </h4>
                      <ul className="space-y-2">
                        {getContributions(currentKhalife.contributions).map((contrib, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[#4A4A4A]">
                            <Star className="w-4 h-4 text-[#D4AF37] mt-1 flex-shrink-0" />
                            <span>{contrib}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Timeline of Khalifes */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#004D33] text-center mb-12">
            {language === 'en' ? 'The Heirs Through the Ages' : 'Les Héritiers à Travers les Âges'}
          </h2>
          
          <div className="space-y-6">
            {khalifes.filter(k => !k.current).map((khalife, index) => {
              const IconComponent = getIcon(khalife.icon);
              const isExpanded = expandedKhalife === khalife.id;
              
              return (
                <div 
                  key={khalife.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Collapsed View */}
                  <div 
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedKhalife(isExpanded ? null : khalife.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-[#004D33]/10 flex items-center justify-center">
                          {khalife.image ? (
                            <img 
                              src={khalife.image} 
                              alt={khalife.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <IconComponent className="w-8 h-8 text-[#004D33]" />
                          )}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-[#004D33]">{khalife.name}</h3>
                        <p className="text-[#D4AF37] font-medium">{getText(khalife.title)}</p>
                        {khalife.period && (
                          <p className="text-sm text-[#888888]">{khalife.period}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-[#004D33]" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-[#004D33]" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded View */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <div className="mt-6 md:flex gap-8">
                        {khalife.image && (
                          <div className="md:w-1/3 mb-6 md:mb-0">
                            <img 
                              src={khalife.image} 
                              alt={khalife.name}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className={khalife.image ? 'md:w-2/3' : 'w-full'}>
                          <p className="text-[#4A4A4A] leading-relaxed mb-6">
                            {getText(khalife.description)}
                          </p>
                          {getContributions(khalife.contributions).length > 0 && (
                            <div>
                              <h4 className="font-semibold text-[#004D33] mb-3">
                                {language === 'en' ? 'Major Contributions:' : 'Contributions Majeures :'}
                              </h4>
                              <ul className="space-y-2">
                                {getContributions(khalife.contributions).map((contrib, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-[#4A4A4A]">
                                    <Star className="w-4 h-4 text-[#D4AF37] mt-1 flex-shrink-0" />
                                    <span>{contrib}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Spiritual Chain Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#004D33]/10 rounded-full">
              <Heart className="w-10 h-10 text-[#004D33]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#004D33] mb-6">
            {t('unbrokenChain') || 'Une Chaîne Spirituelle Ininterrompue'}
          </h2>
          <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
            {t('chainText') || "De Maodo à nos jours, la transmission de la Baraka (grâce spirituelle) s'est poursuivie sans rupture. Chaque Khalife a été le maillon d'une chaîne qui remonte au Prophète Muhammad (PSL) à travers Cheikh Ahmed Tijani."}
          </p>
          <p className="text-[#D4AF37] font-medium italic">
            {t('continuityGuarantee') || "Cette continuité est le gage de l'authenticité de la voie et de la fidélité à l'enseignement originel."}
          </p>
        </div>
      </section>

      {/* Link to Family Tree */}
      <section className="py-12 bg-[#F9F7F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link 
            to="/arbre-genealogique"
            className="inline-flex items-center gap-3 bg-[#004D33] hover:bg-[#003d29] text-white px-8 py-4 rounded-full font-medium transition-colors duration-300"
          >
            <Users className="w-5 h-5" />
            {t('viewDetailedPage') || 'Voir la page détaillée des Héritiers'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Prayer */}
      <section className="py-12 bg-gradient-to-br from-[#004D33] to-[#003d29]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-2xl text-white font-arabic leading-relaxed mb-4">
            رضي الله عنهم جميعا
          </p>
          <p className="text-[#D4AF37] font-medium">
            {t('mayAllahBePleasedWithThemAll') || 'Que Allah les agrée tous'}
          </p>
        </div>
      </section>
    </div>
  );
};

export default LigneeKhalifes;
