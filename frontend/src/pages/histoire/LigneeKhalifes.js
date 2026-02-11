import { useState, useEffect } from "react";
import { Crown, BookOpen, Building, Scale, Shield, Users, Heart, Star, Sparkles, Loader2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Map icon names to components
const iconMap = {
  Crown,
  BookOpen,
  Building,
  Scale,
  Shield,
  Users,
  Heart,
  Star,
  Sparkles
};

const LigneeKhalifes = () => {
  const { t, language } = useLanguage();
  const [khalifes, setKhalifes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKhalifes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API}/khalifes`);
        // API returns array directly, not {khalifes: [...]}
        setKhalifes(Array.isArray(response.data) ? response.data : response.data.khalifes || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching khalifes:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchKhalifes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center" data-testid="khalifes-loading">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#004D33] animate-spin mx-auto mb-4" />
          <p className="text-[#4A4A4A]">{t('loading') || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center" data-testid="khalifes-error">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

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
          </div>
        </div>
      </section>

      {/* Liste des Khalifes */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {khalifes.map((khalife, index) => {
              const Icon = iconMap[khalife.icon] || Crown;
              return (
                <div
                  key={khalife.id || index}
                  className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
                    khalife.current ? 'ring-4 ring-[#D4AF37]' : ''
                  }`}
                  data-testid={`khalife-card-${index}`}
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
                        {khalife.title?.[language] || khalife.title?.fr || ''}
                      </p>

                      <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
                        {khalife.description?.[language] || khalife.description?.fr || ''}
                      </p>

                      <div className="border-t-2 border-[#E8F5E9] pt-6">
                        <h3 className="text-lg font-bold text-[#004D33] mb-4">
                          {t('majorContributionsLabel')}
                        </h3>
                        <ul className="space-y-3">
                          {(khalife.contributions?.[language] || khalife.contributions?.fr || []).map((contribution, idx) => (
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
