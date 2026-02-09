import { useState, useEffect } from "react";
import { Globe, Users, Book, ArrowRight, Loader2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import usePageContent from "../../hooks/usePageContent";

const iconMap = { Globe, Users, Book };

const Origines = () => {
  const { t, language } = useLanguage();
  const { content, loading, error, getSection, getSectionMetadata } = usePageContent("origines");

  // Parse timeline data
  const timeline = (() => {
    try {
      const data = getSection("timeline");
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  })();

  // Parse characteristics data
  const characteristics = (() => {
    try {
      const data = getSection("characteristics");
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  })();

  // Parse expansion data
  const expansion = (() => {
    try {
      const data = getSection("expansion");
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  })();

  const introduction = getSection("introduction") || "";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center" data-testid="origines-loading">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#004D33] animate-spin mx-auto mb-4" />
          <p className="text-[#4A4A4A]">{t('loading') || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="origines-page">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
            alt="Grande Mosquée de Tivaouane"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/95 via-[#004D33]/85 to-[#004D33]/75"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                {t('originesTitle') || 'Les Origines'}
                <br />
                <span className="text-[#D4AF37]">{t('originesSubtitle') || 'De Fès à Tivaouane'}</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                {t('originesHeroDesc') || "L'histoire d'une voie soufie qui a traversé les siècles et les continents"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-[#004D33] mb-6">
              {t('originesGenesisTitle') || 'La Genèse de la Tariqa Tidiane'}
            </h2>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              {introduction || t('originesIntroText')}
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-[#004D33] italic mb-0">
                <strong>{t('foundingEvent') || "L'événement fondateur"} :</strong> {t('foundingEventDesc') || "En 1781, à l'âge de 44 ans, Cheikh Ahmed Tijani reçoit en état de veille (yaqdha) la visite spirituelle du Prophète Muhammad (PSL) qui lui ordonne de fonder une nouvelle voie soufie et lui transmet directement le Wird (litanies quotidiennes)."}
              </p>
            </div>

            <p className="text-lg text-[#4A4A4A] leading-relaxed">
              {t('directTransmissionDesc') || "Cette révélation marque la naissance d'une Tariqa unique dans l'histoire du soufisme : contrairement aux autres voies qui s'appuient sur une chaîne (silsila) de maîtres remontant au Prophète, la Tidjanidya revendique une transmission directe, sans intermédiaire humain."}
            </p>
          </div>
        </div>
      </section>

      {/* Chronologie */}
      {timeline.length > 0 && (
        <section className="py-16 bg-[#F9F7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
                {t('expansionChronology') || 'Chronologie de l\'Expansion'}
              </h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
            </div>

            <div className="space-y-6">
              {timeline.map((event, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-[#D4AF37]"
                  data-testid={`timeline-item-${index}`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                    <div className="lg:col-span-1">
                      <div className="text-center lg:text-left">
                        <div className="inline-block bg-[#004D33] text-white px-6 py-3 rounded-full font-bold text-lg mb-2">
                          {event.period}
                        </div>
                        <p className="text-[#888888] text-sm flex items-center justify-center lg:justify-start gap-2 mt-2">
                          <Globe className="w-4 h-4" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-3">
                      <h3 className="text-2xl font-bold text-[#004D33] mb-3">
                        {event.title}
                      </h3>
                      <p className="text-[#4A4A4A] leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Caractéristiques */}
      {characteristics.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
                {t('tariqaSpecificities') || 'Les Spécificités de la Tariqa'}
              </h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {characteristics.map((char, index) => {
                const Icon = iconMap[char.icon] || Book;
                return (
                  <div
                    key={index}
                    className="bg-[#F9F7F2] rounded-xl p-8 text-center hover:shadow-lg transition-shadow border-t-4 border-[#D4AF37]"
                    data-testid={`characteristic-${index}`}
                  >
                    <div className="w-16 h-16 bg-[#004D33] rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-[#004D33] mb-4">
                      {char.title}
                    </h3>
                    
                    <p className="text-[#4A4A4A] leading-relaxed">
                      {char.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {expansion.length > 0 && (
              <div className="bg-[#F9F7F2] rounded-xl p-8 lg:p-12">
                <h3 className="text-2xl font-bold text-[#004D33] mb-6">
                  {t('arrivalWestAfrica') || "L'Arrivée en Afrique de l'Ouest"}
                </h3>
                
                <div className="space-y-6 text-lg text-[#4A4A4A] leading-relaxed">
                  <p>
                    {t('arrivalIntro') || "La Tariqa Tidiane arrive en Afrique de l'Ouest au début du 19e siècle par plusieurs voies :"}
                  </p>

                  <ul className="space-y-4 ml-6">
                    {expansion.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                        <span>
                          <strong className="text-[#004D33]">{item.name} :</strong> {item.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Conclusion */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t('universalHeritage') || 'Un Héritage Universel'}
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            {t('universalHeritageDesc') || "Aujourd'hui, la Tariqa Tidiane compte des millions de disciples à travers le monde, du Maroc au Nigeria, de la Mauritanie au Soudan. Tivaouane demeure l'un de ses centres spirituels les plus rayonnants, perpétuant l'enseignement authentique de Cheikh Ahmed Tijani à travers la lignée de Maodo."}
          </p>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              رَضِيَ اللهُ عَنْهُمْ وَأَرْضَاهُمْ
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Origines;
