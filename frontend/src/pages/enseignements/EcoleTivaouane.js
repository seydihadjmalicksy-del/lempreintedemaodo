import { GraduationCap, BookOpen, Users, Award, Globe, Star } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

const EcoleTivaouane = () => {
  const { t, language } = useLanguage();

  const methodePedagogique = [
    {
      icon: BookOpen,
      title: t('integralTeaching'),
      description: t('integralTeachingDesc')
    },
    {
      icon: Users,
      title: t('oralPedagogy'),
      description: t('oralPedagogyDesc')
    },
    {
      icon: Award,
      title: t('spiritualFormation'),
      description: t('spiritualFormationDesc')
    }
  ];

  const grandsErudits = [
    {
      name: {
        fr: "Serigne Mansour Sy 'Balkhawmi'",
        en: "Serigne Mansour Sy 'Balkhawmi'",
        ar: "سرين منصور سي 'بلخومي'",
        wo: "Serigne Mansour Sy 'Balkhawmi'"
      },
      period: "1925-1980",
      specialites: {
        fr: "Exégèse coranique, Jurisprudence, Poésie mystique",
        en: "Quranic exegesis, Jurisprudence, Mystical poetry",
        ar: "التفسير القرآني، الفقه، الشعر الصوفي",
        wo: "Tafsir, Fiqh, Téere soufie"
      },
      contribution: {
        fr: "A formé des centaines d'imams et de muqqadams qui ont essaimé la Tariqa à travers le Sénégal",
        en: "Trained hundreds of imams and muqqadams who spread the Tariqa throughout Senegal",
        ar: "درّب مئات الأئمة والمقدمين الذين نشروا الطريقة في جميع أنحاء السنغال",
        wo: "Jàngale ay téeméer imam ak muqqadam yi yéngu Tariqa bi ci Senegaal yépp"
      }
    },
    {
      name: {
        fr: "Serigne Abdoul Aziz Sy 'Dabakh'",
        en: "Serigne Abdoul Aziz Sy 'Dabakh'",
        ar: "سرين عبد العزيز سي 'دباخ'",
        wo: "Serigne Abdoul Aziz Sy 'Dabakh'"
      },
      period: "1904-1997",
      specialites: {
        fr: "Tafsir, Hadith, Médiation sociale",
        en: "Tafsir, Hadith, Social mediation",
        ar: "التفسير، الحديث، الوساطة الاجتماعية",
        wo: "Tafsir, Hadith, Jagle"
      },
      contribution: {
        fr: "Ses causeries radiodiffusées ont éduqué des millions de Sénégalais pendant des décennies",
        en: "His broadcast talks educated millions of Senegalese for decades",
        ar: "ثقّفت محاضراته الإذاعية ملايين السنغاليين لعقود",
        wo: "Causeries am yi ci radio jàngale ay million Senegaalees ay fukki at"
      }
    },
    {
      name: {
        fr: "Serigne Rawane Mbaye",
        en: "Serigne Rawane Mbaye",
        ar: "سرين راوان مباي",
        wo: "Serigne Rawane Mbaye"
      },
      period: "1890-1960",
      specialites: {
        fr: "Grammaire arabe, Logique, Sciences coraniques",
        en: "Arabic grammar, Logic, Quranic sciences",
        ar: "النحو العربي، المنطق، علوم القرآن",
        wo: "Grammaire arabe, Logique, Xam-xam Coran"
      },
      contribution: {
        fr: "Maître réputé qui a formé une génération d'arabisants de haut niveau",
        en: "Renowned master who trained a generation of high-level Arabists",
        ar: "معلم مشهور درّب جيلاً من المستعربين رفيعي المستوى",
        wo: "Maître bu ñuy xam moo jàngale ab génération arabisants yu mag"
      }
    },
    {
      name: {
        fr: "Serigne Souhaibou Mbacké",
        en: "Serigne Souhaibou Mbacké",
        ar: "سرين صهيب مباكي",
        wo: "Serigne Souhaibou Mbacké"
      },
      period: "1925-2008",
      specialites: {
        fr: "Fiqh Maliki, Usul al-Fiqh",
        en: "Maliki Fiqh, Usul al-Fiqh",
        ar: "الفقه المالكي، أصول الفقه",
        wo: "Fiqh Maliki, Usul al-Fiqh"
      },
      contribution: {
        fr: "Juriste exceptionnel consulté pour les questions complexes de droit islamique",
        en: "Exceptional jurist consulted for complex Islamic law questions",
        ar: "فقيه استثنائي يُستشار في مسائل الشريعة الإسلامية المعقدة",
        wo: "Juriste bu baax bu ñuy laaj ngir questions yu xóot ci droit islamique"
      }
    }
  ];

  const niveauxEnseignement = [
    {
      niveau: t('elementaryCycle'),
      duree: {
        fr: "3-5 ans",
        en: "3-5 years",
        ar: "3-5 سنوات",
        wo: "3-5 at"
      },
      contenu: t('elementaryCycleDesc')
    },
    {
      niveau: t('middleCycle'),
      duree: {
        fr: "5-7 ans",
        en: "5-7 years",
        ar: "5-7 سنوات",
        wo: "5-7 at"
      },
      contenu: t('middleCycleDesc')
    },
    {
      niveau: t('superiorCycle'),
      duree: {
        fr: "Variable",
        en: "Variable",
        ar: "متغير",
        wo: "Wéet"
      },
      contenu: t('superiorCycleDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="ecole-page">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
            alt={t('ecoleTitle')}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D33]/95 via-[#004D33]/85 to-[#004D33]/75"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 backdrop-blur-sm border border-[#D4AF37]/30 rounded-full px-6 py-2 mb-6">
                <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#D4AF37] text-sm font-medium">{t('popularUniversity')}</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                {t('ecoleTitle')}
                <br />
                <span className="text-[#D4AF37]">{t('ecoleSubtitle')}</span>
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed">
                {t('ecoleHeroDesc')}
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
              {t('ecoleIntro1')}
            </p>
            
            <p className="text-lg text-[#4A4A4A] leading-relaxed mb-6">
              {t('ecoleIntro2')}
            </p>

            <div className="bg-[#E8F5E9] border-l-4 border-[#D4AF37] p-6 rounded-lg my-8">
              <p className="text-[#004D33] italic mb-0">
                <strong>{t('maodoVision')} :</strong> "{t('maodoVisionQuote')}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Méthode Pédagogique */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              {t('pedagogicalMethod')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {methodePedagogique.map((methode, index) => {
              const Icon = methode.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 border-t-4 border-[#D4AF37]"
                >
                  <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-[#004D33]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#004D33] mb-4">
                    {methode.title}
                  </h3>
                  
                  <p className="text-[#4A4A4A] leading-relaxed">
                    {methode.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl p-8 lg:p-12 shadow-lg">
            <h3 className="text-2xl font-bold text-[#004D33] mb-6">
              {t('guidingPrinciples')}
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#004D33] mb-2">{t('freeEducation')}</h4>
                  <p className="text-[#4A4A4A]">
                    {t('freeEducationDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#004D33] mb-2">{t('scienceSpiritualityBalance')}</h4>
                  <p className="text-[#4A4A4A]">
                    {t('scienceSpiritualityBalanceDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#004D33] mb-2">{t('communityService')}</h4>
                  <p className="text-[#4A4A4A]">
                    {t('communityServiceDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Niveaux d'Enseignement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              {t('teachingCycles')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {niveauxEnseignement.map((niveau, index) => (
              <div
                key={index}
                className="bg-[#F9F7F2] rounded-xl p-8 border-l-4 border-[#D4AF37]"
              >
                <div className="mb-4">
                  <span className="inline-block bg-[#004D33] text-white px-4 py-2 rounded-full text-sm font-bold">
                    {niveau.duree[language] || niveau.duree.fr}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-[#004D33] mb-4">
                  {niveau.niveau}
                </h3>
                
                <p className="text-[#4A4A4A] leading-relaxed">
                  {niveau.contenu}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grands Érudits */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
              {t('greatMasters')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              {t('greatMastersDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {grandsErudits.map((erudit, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#004D33] mb-1">
                      {erudit.name[language] || erudit.name.fr}
                    </h3>
                    <p className="text-sm text-[#888888]">{erudit.period}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-[#004D33] mb-2">{t('specialties')} :</h4>
                    <p className="text-[#4A4A4A]">{erudit.specialites[language] || erudit.specialites.fr}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[#004D33] mb-2">{t('contribution')} :</h4>
                    <p className="text-[#4A4A4A]">{erudit.contribution[language] || erudit.contribution.fr}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Héritage Actuel */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t('lastingLegacy')}
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            {t('lastingLegacyDesc')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">50+</div>
              <p className="text-white/80">{t('activeDaaras')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">10K+</div>
              <p className="text-white/80">{t('currentStudents')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl font-bold text-[#D4AF37] mb-2">120+</div>
              <p className="text-white/80">{t('yearsOfHistory')}</p>
            </div>
          </div>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
            <p className="text-white/70 text-sm italic">
              اطْلُبُوا الْعِلْمَ مِنَ الْمَهْدِ إِلَى اللَّحْدِ
              <br />
              "{t('seekKnowledge')}"
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EcoleTivaouane;
