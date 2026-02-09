import { useState, useEffect } from "react";
import { MapPin, Home, Church, Heart, Loader2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import usePageContent from "../../hooks/usePageContent";

const iconMap = { MapPin, Home, Church, Heart };

const GeographieSacree = () => {
  const { t, language } = useLanguage();
  const { content, loading, error } = usePageContent("geographie", language);

  // Parse lieux data
  const lieux = (() => {
    try {
      const data = content?.lieux?.text;
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  })();

  // Parse organisation data
  const organisation = (() => {
    try {
      const data = content?.organisation?.text;
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  })();

  const introduction = content?.introduction?.text || "";
  const demographics = content?.demographics?.text || "";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center" data-testid="geographie-loading">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#004D33] animate-spin mx-auto mb-4" />
          <p className="text-[#4A4A4A]">{t('loading') || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="geographie-page">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
            alt="Tivaouane - Vue aérienne"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/90 via-[#004D33]/80 to-[#004D33]/70"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                {t('sacredGeography') || 'Géographie Sacrée'}
                <br />
                <span className="text-[#D4AF37]">{t('holyCity') || 'Tivaouane, la Cité Sainte'}</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                {t('geographieHeroDesc') || "Pourquoi Tivaouane est devenue le centre névralgique de la Tidjanidya"}
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
              {t('tivaouaneTransformation') || "Tivaouane : D'un Village à une Métropole Spirituelle"}
            </h2>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              {introduction || t('tivaouaneIntro')}
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold text-[#004D33] mb-3">{t('whyTivaouane') || 'Pourquoi Tivaouane ?'}</h3>
              <p className="text-[#4A4A4A] mb-3">
                {t('whyTivaouaneDesc') || "Le choix de Tivaouane par Maodo n'était pas le fruit du hasard. Plusieurs facteurs stratégiques ont guidé cette décision :"}
              </p>
              <ul className="space-y-2 text-[#4A4A4A]">
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span><strong>{t('distanceFromPower') || 'Distance vis-à-vis du pouvoir colonial'} :</strong> {t('distanceFromPowerDesc') || "Contrairement à Saint-Louis, capitale coloniale où il enseignait, Tivaouane offrait plus d'autonomie"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span><strong>{t('centralPosition') || 'Position géographique centrale'} :</strong> {t('centralPositionDesc') || "Carrefour entre plusieurs régions, facilitant l'afflux de disciples"}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#D4AF37] mt-1">•</span>
                  <span><strong>{t('fertileLand') || 'Terre fertile et paisible'} :</strong> {t('fertileLandDesc') || "Propice à l'étude et à la méditation"}</span>
                </li>
              </ul>
            </div>

            <p className="text-lg text-[#4A4A4A] leading-relaxed">
              {t('rapidTransformation') || "En l'espace de quelques années, Tivaouane se transforma en pôle intellectuel et spirituel. Des étudiants affluèrent de tout le Sénégal, de la Gambie, de la Mauritanie et même de la Guinée pour étudier auprès de Maodo."}
            </p>
          </div>
        </div>
      </section>

      {/* Les Lieux Sacrés */}
      {lieux.length > 0 && (
        <section className="py-16 bg-[#F9F7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
                {t('emblematicPlaces') || 'Les Lieux Emblématiques'}
              </h2>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {lieux.map((lieu, index) => {
                const Icon = iconMap[lieu.icon] || MapPin;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    data-testid={`lieu-${index}`}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={lieu.image}
                        alt={lieu.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <div className="w-16 h-16 bg-[#004D33]/90 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Icon className="w-8 h-8 text-[#D4AF37]" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-[#004D33] mb-4">
                        {lieu.title}
                      </h3>
                      <p className="text-[#4A4A4A] leading-relaxed">
                        {lieu.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Organisation Urbaine */}
      {organisation.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-6">
                  {t('cityOrganization') || "L'Organisation de la Cité"}
                </h2>
                
                <div className="space-y-6 text-lg text-[#4A4A4A] leading-relaxed">
                  <p>
                    {t('cityOrgIntro') || "Tivaouane s'organise aujourd'hui autour de trois pôles principaux :"}
                  </p>

                  <div className="space-y-4">
                    {organisation.map((item, index) => (
                      <div key={index} className="bg-[#F9F7F2] p-6 rounded-xl border-l-4 border-[#D4AF37]">
                        <h4 className="font-bold text-[#004D33] mb-2">{item.title}</h4>
                        <p className="text-base">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
                    alt="Organisation urbaine de Tivaouane"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full border-4 border-[#D4AF37] rounded-xl -z-10"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Impact Démographique */}
      {demographics && (
        <section className="py-16 bg-[#F9F7F2]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl p-8 lg:p-12 shadow-lg">
              <h2 className="text-3xl font-bold text-[#004D33] mb-6">
                {t('demographicMetamorphosis') || 'Une Métamorphose Démographique'}
              </h2>
              
              <div className="space-y-6 text-lg text-[#4A4A4A] leading-relaxed">
                <p>{demographics}</p>

                <div className="bg-[#E8F5E9] p-6 rounded-lg my-6">
                  <p className="text-[#004D33] font-semibold mb-0">
                    {t('uniqueCase') || "Cette transformation fait de Tivaouane un cas unique en Afrique de l'Ouest : une ville dont l'identité et la prospérité sont entièrement liées à sa dimension spirituelle."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Conclusion */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t('moreThanaCity') || "Tivaouane : Plus qu'une Ville, un État d'Esprit"}
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            {t('moreThanaDesc') || "Tivaouane n'est pas seulement un lieu géographique. C'est un projet spirituel, une utopie réalisée où le savoir et la piété cohabitent, où les disciples de tous horizons se retrouvent dans l'amour du Prophète (PSL) et l'enseignement de Maodo."}
          </p>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              تواون - مدينة النور
              <br />
              Tivaouane - {t('cityOfLight') || 'Cité de la Lumière'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeographieSacree;
