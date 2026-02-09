import { useState, useEffect } from "react";
import { Calendar, Users, Heart, Loader2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import usePageContent from "../../hooks/usePageContent";

const iconMap = { Calendar, Users, Heart };

const ZiarraAnnuelles = () => {
  const { t, language } = useLanguage();
  const { content, loading, error } = usePageContent("ziarra", language);

  // Parse ziarras data
  const ziarras = (() => {
    try {
      const data = content?.ziarras?.text;
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  })();

  // Parse pilgrim guide data
  const conseilsPelerins = (() => {
    try {
      const data = content?.pilgrim_guide?.text;
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center" data-testid="ziarra-loading">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#004D33] animate-spin mx-auto mb-4" />
          <p className="text-[#4A4A4A]">{t('loading') || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

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
                {t('ziarraTitle') || 'Les Ziarra Annuelles'}
                <br />
                <span className="text-[#D4AF37]">{t('spiritualPilgrimages') || 'Pèlerinages Spirituels'}</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                {t('ziarraHeroDesc') || "Les moments forts de communion spirituelle à Tivaouane"}
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
              {t('ziarraIntro1') || "La ziarra (visite pieuse) est un moment essentiel dans la vie d'un disciple tidiane. Elle représente l'occasion de renouveler son engagement spirituel et de se ressourcer auprès des lieux saints."}
            </p>

            <p className="text-lg text-[#4A4A4A] leading-relaxed">
              {t('ziarraIntro2') || "Tivaouane accueille plusieurs ziarra tout au long de l'année, chacune ayant sa propre signification et son propre programme."}
            </p>
          </div>
        </div>
      </section>

      {/* Les Principales Ziarra */}
      {ziarras.length > 0 && (
        <section className="py-16 bg-[#F9F7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
                {t('mainZiarras') || 'Les Principales Ziarra'}
              </h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
            </div>

            <div className="space-y-12">
              {ziarras.map((ziarra, index) => {
                const Icon = iconMap[ziarra.icon] || Calendar;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl overflow-hidden shadow-xl"
                    data-testid={`ziarra-card-${index}`}
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
                          <h4 className="font-bold text-[#004D33] mb-4 text-lg">{t('program') || 'Programme'} :</h4>
                          <ul className="space-y-3">
                            {(ziarra.programme || []).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="w-2 h-2 bg-[#D4AF37] rounded-full mt-2 flex-shrink-0"></span>
                                <span className="text-[#4A4A4A]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#004D33] mb-4 text-lg">{t('spiritualSignificance') || 'Signification spirituelle'} :</h4>
                          <div className="bg-[#E8F5E9] rounded-lg p-6 border-l-4 border-[#D4AF37]">
                            <p className="text-[#4A4A4A] leading-relaxed">
                              {ziarra.signification}
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
      )}

      {/* Guide du Pèlerin */}
      {conseilsPelerins.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
                {t('pilgrimGuide') || 'Guide du Pèlerin'}
              </h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {conseilsPelerins.map((section, index) => (
                <div
                  key={index}
                  className="bg-[#F9F7F2] rounded-xl p-8 border-t-4 border-[#D4AF37]"
                  data-testid={`guide-section-${index}`}
                >
                  <h3 className="text-xl font-bold text-[#004D33] mb-6">
                    {section.titre}
                  </h3>
                  <ul className="space-y-4">
                    {(section.conseils || []).map((conseil, idx) => (
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
      )}

      {/* Conclusion */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t('ziarraSoulJourney') || "La Ziarra : Un Voyage de l'Âme"}
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            {t('ziarraConclusion') || "Plus qu'un simple déplacement physique, la ziarra est une migration intérieure vers la présence divine. Elle permet au disciple de se détacher du monde matériel pour se concentrer sur l'essentiel : la relation avec Allah et l'amour du Prophète (PSL)."}
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
