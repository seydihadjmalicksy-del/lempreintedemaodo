import { MapPin, Navigation, Info, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const CarteTivaouane = () => {
  const { t, language } = useLanguage();
  const [selectedLieu, setSelectedLieu] = useState(null);

  const lieuxSacres = [
    {
      id: 1,
      nom: {
        fr: "Grande Mosquée de Tivaouane",
        en: "Grand Mosque of Tivaouane",
        ar: "المسجد الكبير في تيفاوان",
        wo: "Jàkka bu mag Tiwaawaan"
      },
      description: {
        fr: "Fondée par El Hadji Malick Sy en 1904, la Grande Mosquée est le cœur spirituel de Tivaouane. Elle peut accueillir plus de 10 000 fidèles et abrite le mausolée de Maodo.",
        en: "Founded by El Hadji Malick Sy in 1904, the Grand Mosque is the spiritual heart of Tivaouane. It can accommodate more than 10,000 worshippers and houses Maodo's mausoleum.",
        ar: "أسسه الحاج مالك سي عام 1904، المسجد الكبير هو القلب الروحي لتيفاوان. يمكنه استيعاب أكثر من 10,000 مصلٍ ويضم ضريح مودو.",
        wo: "El Hadji Maalik Si moo ko tëkki ci 1904, Jàkka bu mag bi mooy xol bu sell Tiwaawaan. Mën na jël gën 10 000 mu julli te ci biir am ñu nebbi Maodo."
      },
      coordonnees: { lat: 14.9508, lng: -16.8222 },
      type: "mosquee",
      horaires: t('openAllDay'),
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 2,
      nom: {
        fr: "Mausolée d'El Hadji Malick Sy",
        en: "Mausoleum of El Hadji Malick Sy",
        ar: "ضريح الحاج مالك سي",
        wo: "Mausolée El Hadji Maalik Si"
      },
      description: {
        fr: "Lieu de repos éternel du fondateur Maodo, situé à l'intérieur de la Grande Mosquée. Des milliers de fidèles viennent y recueillir chaque année.",
        en: "Eternal resting place of founder Maodo, located inside the Grand Mosque. Thousands of faithful come to pay their respects every year.",
        ar: "مثوى المؤسس مودو الأخير، يقع داخل المسجد الكبير. يأتي آلاف المؤمنين للتأمل فيه كل عام.",
        wo: "Paxas nebbi ba fàww tëkkikat Maodo, nekk na ci biir Jàkka bu mag bi. Ay mille mu gëm di ñëw fi at bu nekk."
      },
      coordonnees: { lat: 14.9508, lng: -16.8220 },
      type: "mausolee",
      horaires: t('accessibleDuringPrayer'),
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 3,
      nom: {
        fr: "Zawiya El Hadji Malick Sy",
        en: "Zawiya El Hadji Malick Sy",
        ar: "زاوية الحاج مالك سي",
        wo: "Zawiya El Hadji Maalik Si"
      },
      description: {
        fr: "Centre d'enseignement et de spiritualité fondé par Maodo. C'est ici que se tient la Hadratoul Joumah chaque vendredi.",
        en: "Teaching and spirituality center founded by Maodo. This is where Hadratoul Joumah is held every Friday.",
        ar: "مركز التعليم والروحانية الذي أسسه مودو. هنا تقام حضرة الجمعة كل جمعة.",
        wo: "Senter jàngale ak diine bu Maodo tëkki. Fii la Hadratoul Joumah di nekk Ajjuma bu nekk."
      },
      coordonnees: { lat: 14.9512, lng: -16.8225 },
      type: "zawiya",
      horaires: t('hadratoulJoumahTime'),
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 4,
      nom: {
        fr: "Champs de Courses (Gamou)",
        en: "Racecourse (Gamou)",
        ar: "ساحة السباق (المولد)",
        wo: "Champs de Courses (Gamou)"
      },
      description: {
        fr: "Vaste espace où se rassemblent les millions de pèlerins lors du Gamou annuel. Des tentes et installations temporaires y sont montées.",
        en: "Vast space where millions of pilgrims gather during the annual Gamou. Tents and temporary facilities are set up here.",
        ar: "مساحة واسعة يتجمع فيها ملايين الحجاج أثناء المولد السنوي. تُقام فيها الخيام والمرافق المؤقتة.",
        wo: "Paxas bu yàgg fi ay million ajibi di dajale ci Gamou at. Tënti ak jëfandikoo yu waxtu yu am fi."
      },
      coordonnees: { lat: 14.9480, lng: -16.8200 },
      type: "evenement",
      horaires: t('usedDuringGamou'),
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 5,
      nom: {
        fr: "Résidence du Khalife",
        en: "Khalife's Residence",
        ar: "مقر الخليفة",
        wo: "Kër Xaliifa bi"
      },
      description: {
        fr: "Demeure officielle du Khalife Général des Tidianes, Serigne Babacar Sy Mansour.",
        en: "Official residence of the General Khalife of the Tidianes, Serigne Babacar Sy Mansour.",
        ar: "المقر الرسمي للخليفة العام للتجانيين، سرين باباكار سي منصور.",
        wo: "Kër officiel Xaliifa Général Tijaan yi, Serigne Babacar Sy Mansour."
      },
      coordonnees: { lat: 14.9515, lng: -16.8218 },
      type: "residence",
      horaires: t('visitsByAppointment'),
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    },
    {
      id: 6,
      nom: {
        fr: "Bibliothèque Seydi El Hadji Malick Sy",
        en: "Seydi El Hadji Malick Sy Library",
        ar: "مكتبة سيدي الحاج مالك سي",
        wo: "Bibliothèque Seydi El Hadji Maalik Si"
      },
      description: {
        fr: "Bibliothèque regroupant les manuscrits, ouvrages et archives de Maodo et des érudits tidiane.",
        en: "Library containing manuscripts, works and archives of Maodo and Tidiane scholars.",
        ar: "مكتبة تضم مخطوطات وأعمال وأرشيفات مودو وعلماء التجانية.",
        wo: "Bibliothèque bu dajale manuscrits, téere yi ak archives Maodo ak borom xam-xam Tijaan yi."
      },
      coordonnees: { lat: 14.9505, lng: -16.8230 },
      type: "bibliotheque",
      horaires: t('libHours'),
      image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg"
    }
  ];

  const getTypeColor = (type) => {
    switch(type) {
      case 'mosquee': return 'bg-[#004D33]';
      case 'mausolee': return 'bg-[#D4AF37]';
      case 'zawiya': return 'bg-[#2E7D32]';
      case 'evenement': return 'bg-[#FF9800]';
      case 'residence': return 'bg-[#1565C0]';
      case 'bibliotheque': return 'bg-[#7B1FA2]';
      default: return 'bg-gray-500';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'mosquee': return t('mosque');
      case 'mausolee': return t('mausoleumType');
      case 'zawiya': return t('zawiyaType');
      case 'evenement': return t('eventPlace');
      case 'residence': return t('residence');
      case 'bibliotheque': return t('libraryType');
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="carte-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-3 mb-6">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-semibold">{t('sacredGeographyLabel')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('interactiveMapTitle')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {t('discoverHolyPlaces')}
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6"></div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des lieux */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="text-2xl font-bold text-[#004D33] mb-4">{t('holyPlaces')}</h2>
              
              {lieuxSacres.map((lieu) => (
                <button
                  key={lieu.id}
                  onClick={() => setSelectedLieu(lieu)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedLieu?.id === lieu.id 
                      ? 'bg-[#004D33] text-white shadow-lg' 
                      : 'bg-white hover:bg-[#E8F5E9] shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${getTypeColor(lieu.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <MapPin className={`w-5 h-5 ${selectedLieu?.id === lieu.id ? 'text-[#D4AF37]' : 'text-white'}`} />
                    </div>
                    <div>
                      <h3 className={`font-bold ${selectedLieu?.id === lieu.id ? 'text-white' : 'text-[#004D33]'}`}>
                        {lieu.nom[language] || lieu.nom.fr}
                      </h3>
                      <span className={`text-xs ${selectedLieu?.id === lieu.id ? 'text-[#D4AF37]' : 'text-[#888888]'}`}>
                        {getTypeLabel(lieu.type)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Carte et détails */}
            <div className="lg:col-span-2">
              {/* Carte Google Maps intégrée */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3857.8234567890123!2d-16.8222!3d14.9508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDU3JzAyLjkiTiAxNsKwNDknMTkuOSJX!5e0!3m2!1sfr!2ssn!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('interactiveMapTitle')}
                  className="w-full"
                ></iframe>
              </div>

              {/* Détails du lieu sélectionné */}
              {selectedLieu ? (
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <img 
                      src={selectedLieu.image} 
                      alt={selectedLieu.nom[language] || selectedLieu.nom.fr}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className={`inline-block ${getTypeColor(selectedLieu.type)} text-white text-xs px-3 py-1 rounded-full mb-2`}>
                        {getTypeLabel(selectedLieu.type)}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{selectedLieu.nom[language] || selectedLieu.nom.fr}</h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-[#4A4A4A] mb-4">{selectedLieu.description[language] || selectedLieu.description.fr}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-[#888888] mb-4">
                      <Info className="w-4 h-4" />
                      <span>{selectedLieu.horaires}</span>
                    </div>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedLieu.coordonnees.lat},${selectedLieu.coordonnees.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      {t('getDirections')}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <MapPin className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#004D33] mb-2">{t('selectPlace')}</h3>
                  <p className="text-[#4A4A4A]">
                    {t('selectPlaceDesc')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Légende */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#004D33] mb-6 text-center">{t('legendTitle')}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { type: 'mosquee', label: t('mosque') },
              { type: 'mausolee', label: t('mausoleumType') },
              { type: 'zawiya', label: t('zawiyaType') },
              { type: 'evenement', label: t('eventPlace') },
              { type: 'residence', label: t('residence') },
              { type: 'bibliotheque', label: t('libraryType') }
            ].map((item) => (
              <div key={item.type} className="flex items-center gap-2">
                <div className={`w-4 h-4 ${getTypeColor(item.type)} rounded-full`}></div>
                <span className="text-sm text-[#4A4A4A]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Informations pratiques */}
      <section className="py-12 bg-[#F9F7F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#004D33] mb-6">{t('howToGetThere')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-[#004D33] mb-2">{t('fromDakar')}</h3>
              <p className="text-sm text-[#4A4A4A]">{t('fromDakarDesc')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-[#004D33] mb-2">{t('fromThies')}</h3>
              <p className="text-sm text-[#4A4A4A]">{t('fromThiesDesc')}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-[#004D33] mb-2">{t('transport')}</h3>
              <p className="text-sm text-[#4A4A4A]">{t('transportDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarteTivaouane;
