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
    origins: "Les Origines",
    maodo: "Maodo (El Hadji Malick Sy)",
    heirsLineage: "Lignée des Héritiers",
    familyTree: "Arbre Généalogique",
    sacredGeography: "Géographie Sacrée",
    interactiveMap: "Carte Interactive",
    pillars: "Piliers de la Tariqa",
    school: "L'École de Tivaouane",
    referenceWorks: "Ouvrages de Référence",
    gamou: "Le Gamou",
    annualZiarra: "Ziarra Annuelles",
    religiousCeremonies: "Cérémonies Religieuses",
    
    // Common
    readMore: "En savoir plus",
    seeAll: "Voir tout",
    subscribe: "S'inscrire",
    search: "Rechercher...",
    learnMore: "En savoir plus",
    discover: "Découvrir",
    
    // Home
    heroTitle: "L'empreinte de Tivaouane",
    heroSubtitle: "dans la Tariqa Tidiane",
    heroDescription: "Découvrez l'héritage spirituel d'El Hadji Malick Sy et les enseignements de la Tijaniyya",
    quoteOfDay: "Citation du Jour",
    upcomingEvents: "Événements à Venir",
    featuredVideos: "Vidéos en Vedette",
    welcomeMessage: "Bienvenue sur le portail officiel de la Tariqa Tidiane de Tivaouane",
    exploreHistory: "Explorer l'Histoire",
    
    // Newsletter
    stayInformed: "Restez Informé",
    newsletterDesc: "Inscrivez-vous pour recevoir les dates des événements et les actualités de Tivaouane",
    enterEmail: "Entrez votre adresse email",
    subscribing: "Inscription...",
    thankYou: "Merci pour votre inscription !",
    
    // Footer
    allRightsReserved: "Tous droits réservés",
    quickLinks: "Liens Rapides",
    followUs: "Suivez-nous",
    aboutSite: "À propos du site",
    
    // Stats
    statsTitle: "La Tariqa Tidiane en Chiffres",
    pilgrims: "Pèlerins au Gamou",
    onlineFollowers: "Disciples en ligne",
    daysOfDevotion: "Jours de dévotion",
    countriesRepresented: "Pays représentés",
    
    // Pages
    pageNotFound: "Page non trouvée",
    backToHome: "Retour à l'accueil"
  },
  en: {
    // Navigation
    home: "Home",
    history: "History",
    teachings: "Teachings",
    events: "Events",
    archives: "Archives",
    media: "Media Library",
    contact: "Contact",
    origins: "The Origins",
    maodo: "Maodo (El Hadji Malick Sy)",
    heirsLineage: "Lineage of Heirs",
    familyTree: "Family Tree",
    sacredGeography: "Sacred Geography",
    interactiveMap: "Interactive Map",
    pillars: "Pillars of the Tariqa",
    school: "The School of Tivaouane",
    referenceWorks: "Reference Works",
    gamou: "The Gamou",
    annualZiarra: "Annual Ziarra",
    religiousCeremonies: "Religious Ceremonies",
    
    // Common
    readMore: "Read more",
    seeAll: "See all",
    subscribe: "Subscribe",
    search: "Search...",
    learnMore: "Learn more",
    discover: "Discover",
    
    // Home
    heroTitle: "The Legacy of Tivaouane",
    heroSubtitle: "in the Tidiane Tariqa",
    heroDescription: "Discover the spiritual heritage of El Hadji Malick Sy and the teachings of the Tijaniyya",
    quoteOfDay: "Quote of the Day",
    upcomingEvents: "Upcoming Events",
    featuredVideos: "Featured Videos",
    welcomeMessage: "Welcome to the official portal of the Tidiane Tariqa of Tivaouane",
    exploreHistory: "Explore History",
    
    // Newsletter
    stayInformed: "Stay Informed",
    newsletterDesc: "Subscribe to receive event dates and news from Tivaouane",
    enterEmail: "Enter your email address",
    subscribing: "Subscribing...",
    thankYou: "Thank you for subscribing!",
    
    // Footer
    allRightsReserved: "All rights reserved",
    quickLinks: "Quick Links",
    followUs: "Follow Us",
    aboutSite: "About this site",
    
    // Stats
    statsTitle: "The Tidiane Tariqa in Numbers",
    pilgrims: "Pilgrims at the Gamou",
    onlineFollowers: "Online followers",
    daysOfDevotion: "Days of devotion",
    countriesRepresented: "Countries represented",
    
    // Pages
    pageNotFound: "Page not found",
    backToHome: "Back to home"
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
    origins: "الأصول",
    maodo: "مودو (الحاج مالك سي)",
    heirsLineage: "سلالة الورثة",
    familyTree: "شجرة العائلة",
    sacredGeography: "الجغرافيا المقدسة",
    interactiveMap: "الخريطة التفاعلية",
    pillars: "أركان الطريقة",
    school: "مدرسة تيفاوان",
    referenceWorks: "المؤلفات المرجعية",
    gamou: "المولد",
    annualZiarra: "الزيارة السنوية",
    religiousCeremonies: "المراسم الدينية",
    
    // Common
    readMore: "اقرأ المزيد",
    seeAll: "عرض الكل",
    subscribe: "اشترك",
    search: "بحث...",
    learnMore: "اعرف المزيد",
    discover: "اكتشف",
    
    // Home
    heroTitle: "بصمة تيفاوان",
    heroSubtitle: "في الطريقة التجانية",
    heroDescription: "اكتشف الإرث الروحي للشيخ الحاج مالك سي وتعاليم الطريقة التجانية",
    quoteOfDay: "اقتباس اليوم",
    upcomingEvents: "الفعاليات القادمة",
    featuredVideos: "فيديوهات مميزة",
    welcomeMessage: "مرحبا بكم في البوابة الرسمية للطريقة التجانية في تيفاوان",
    exploreHistory: "استكشف التاريخ",
    
    // Newsletter
    stayInformed: "ابق على اطلاع",
    newsletterDesc: "اشترك لتلقي تواريخ الفعاليات وأخبار تيفاوان",
    enterEmail: "أدخل بريدك الإلكتروني",
    subscribing: "جاري التسجيل...",
    thankYou: "شكرا لاشتراكك!",
    
    // Footer
    allRightsReserved: "جميع الحقوق محفوظة",
    quickLinks: "روابط سريعة",
    followUs: "تابعنا",
    aboutSite: "عن الموقع",
    
    // Stats
    statsTitle: "الطريقة التجانية بالأرقام",
    pilgrims: "حجاج المولد",
    onlineFollowers: "المتابعون عبر الإنترنت",
    daysOfDevotion: "أيام العبادة",
    countriesRepresented: "الدول الممثلة",
    
    // Pages
    pageNotFound: "الصفحة غير موجودة",
    backToHome: "العودة للرئيسية"
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
    origins: "Ndoorte yi",
    maodo: "Maodo (El Hadji Maalik Si)",
    heirsLineage: "Warisaay yi",
    familyTree: "Garab njàmbaar",
    sacredGeography: "Suuf bu sell",
    interactiveMap: "Kart bi",
    pillars: "Tënk yi",
    school: "Daara Tiwaawaan",
    referenceWorks: "Téere yi",
    gamou: "Gamou gi",
    annualZiarra: "Ziarra yi",
    religiousCeremonies: "Bëgg-bëgg diine yi",
    
    // Common
    readMore: "Gën a xam",
    seeAll: "Xool lépp",
    subscribe: "Bindu",
    search: "Seet...",
    learnMore: "Gën a xam",
    discover: "Gis",
    
    // Home
    heroTitle: "Tiwaawaan",
    heroSubtitle: "ci Tariqa Tijaan",
    heroDescription: "Seetlu njàmbar bu El Hadji Maalik Si ak jàng Tijaan yi",
    quoteOfDay: "Kàddu bu bés bi",
    upcomingEvents: "Mbir yu ñëw",
    featuredVideos: "Bidiyo yu rafet",
    welcomeMessage: "Dalal jàmm ci portal Tariqa Tijaan Tiwaawaan",
    exploreHistory: "Seetlu taariix bi",
    
    // Newsletter
    stayInformed: "Xam li am",
    newsletterDesc: "Bindu ngir am xibaar yi ak bés yi",
    enterEmail: "Dugal sa email",
    subscribing: "Bindu...",
    thankYou: "Jërëjëf!",
    
    // Footer
    allRightsReserved: "Sañ-sañ yi ci kow",
    quickLinks: "Lien gaaw yi",
    followUs: "Toppalu nu",
    aboutSite: "Ci biir site bi",
    
    // Stats
    statsTitle: "Tariqa Tijaan ci limbi",
    pilgrims: "Ajibi Gamou gi",
    onlineFollowers: "Taalibe ci internet",
    daysOfDevotion: "Bés ibaada yi",
    countriesRepresented: "Réew yi"
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
      { code: 'en', label: 'English', flag: '🇬🇧' },
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
