import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  fr: {
    // Navigation
    home: "Accueil",
    history: "Histoire",
    teachings: "Enseignements",
    events: "Événements",
    archives: "Archives",
    media: "Médiathèque",
    contact: "Contact",
    
    // Common
    readMore: "En savoir plus",
    seeAll: "Voir tout",
    subscribe: "S'inscrire",
    search: "Rechercher...",
    
    // Home
    heroTitle: "L'empreinte de Tivaouane",
    heroSubtitle: "dans la Tariqa Tidiane",
    heroDescription: "Découvrez l'héritage spirituel d'El Hadji Malick Sy et les enseignements de la Tijaniyya",
    quoteOfDay: "Citation du Jour",
    upcomingEvents: "Événements à Venir",
    featuredVideos: "Vidéos en Vedette",
    
    // Newsletter
    stayInformed: "Restez Informé",
    newsletterDesc: "Inscrivez-vous pour recevoir les dates des événements et les actualités de Tivaouane",
    enterEmail: "Entrez votre adresse email",
    subscribing: "Inscription...",
    thankYou: "Merci pour votre inscription !",
    
    // Footer
    allRightsReserved: "Tous droits réservés",
    quickLinks: "Liens Rapides",
    
    // Stats
    statsTitle: "La Tariqa Tidiane en Chiffres",
    pilgrims: "Pèlerins au Gamou",
    onlineFollowers: "Disciples en ligne",
    daysOfDevotion: "Jours de dévotion",
    countriesRepresented: "Pays représentés"
  },
  ar: {
    // Navigation
    home: "الرئيسية",
    history: "التاريخ",
    teachings: "التعاليم",
    events: "الفعاليات",
    archives: "الأرشيف",
    media: "المكتبة",
    contact: "اتصل بنا",
    
    // Common
    readMore: "اقرأ المزيد",
    seeAll: "عرض الكل",
    subscribe: "اشترك",
    search: "بحث...",
    
    // Home
    heroTitle: "بصمة تيفاوان",
    heroSubtitle: "في الطريقة التجانية",
    heroDescription: "اكتشف الإرث الروحي للشيخ الحاج مالك سي وتعاليم الطريقة التجانية",
    quoteOfDay: "اقتباس اليوم",
    upcomingEvents: "الفعاليات القادمة",
    featuredVideos: "فيديوهات مميزة",
    
    // Newsletter
    stayInformed: "ابق على اطلاع",
    newsletterDesc: "اشترك لتلقي تواريخ الفعاليات وأخبار تيفاوان",
    enterEmail: "أدخل بريدك الإلكتروني",
    subscribing: "جاري التسجيل...",
    thankYou: "شكرا لاشتراكك!",
    
    // Footer
    allRightsReserved: "جميع الحقوق محفوظة",
    quickLinks: "روابط سريعة",
    
    // Stats
    statsTitle: "الطريقة التجانية بالأرقام",
    pilgrims: "حجاج المولد",
    onlineFollowers: "المتابعون عبر الإنترنت",
    daysOfDevotion: "أيام العبادة",
    countriesRepresented: "الدول الممثلة"
  },
  wo: {
    // Navigation - Wolof
    home: "Ndakaaru",
    history: "Taariix",
    teachings: "Jàng",
    events: "Mbir yi",
    archives: "Dëgg yi",
    media: "Bidiyo yi",
    contact: "Jokkoo",
    
    // Common
    readMore: "Gën a xam",
    seeAll: "Xool lépp",
    subscribe: "Bindu",
    search: "Seet...",
    
    // Home
    heroTitle: "Tiwaawaan",
    heroSubtitle: "ci Tariqa Tijaan",
    heroDescription: "Seetlu njàmbar bu El Hadji Maalik Si ak jàng Tijaan yi",
    quoteOfDay: "Kàddu bu bés bi",
    upcomingEvents: "Mbir yu ñëw",
    featuredVideos: "Bidiyo yu rafet",
    
    // Newsletter
    stayInformed: "Xam li am",
    newsletterDesc: "Bindu ngir am xibaar yi ak bés yi",
    enterEmail: "Dugal sa email",
    subscribing: "Bindu...",
    thankYou: "Jërëjëf!",
    
    // Footer
    allRightsReserved: "Sañ-sañ yi ci kow",
    quickLinks: "Lien gaaw yi"
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations['fr'][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    isRTL: language === 'ar',
    availableLanguages: [
      { code: 'fr', label: 'Français', flag: '🇫🇷' },
      { code: 'ar', label: 'العربية', flag: '🇸🇦' },
      { code: 'wo', label: 'Wolof', flag: '🇸🇳' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
