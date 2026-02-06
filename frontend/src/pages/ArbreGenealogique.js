import { useState } from "react";
import { Users, ChevronDown, ChevronRight, Star, Crown, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const ArbreGenealogique = () => {
  const [expandedNodes, setExpandedNodes] = useState(['maodo']);
  const { t, language } = useLanguage();

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  // Données de l'arbre généalogique
  const familyTree = {
    id: 'maodo',
    nom: "El Hadji Malick Sy",
    surnom: "Maodo",
    dates: "1855 - 1922",
    titre: {
      fr: "Fondateur de la Zawiya de Tivaouane",
      en: "Founder of the Zawiya of Tivaouane",
      ar: "مؤسس زاوية تيفاوان",
      wo: "Tëkkikat Zawiya Tiwaawaan"
    },
    image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/ypec6ou8_FB_IMG_1770343497173.jpg",
    epouses: [
      { nom: "Sokhna Rokhaya Ndiaye", enfants: ["babacar"] },
      { nom: "Sokhna Safiétou Niang", enfants: ["habib"] }
    ],
    enfants: [
      {
        id: 'babacar',
        nom: "Serigne Babacar Sy",
        dates: "1885 - 1957",
        titre: {
          fr: "Premier Khalife (1922-1957)",
          en: "First Khalife (1922-1957)",
          ar: "الخليفة الأول (1922-1957)",
          wo: "Njëkk Xaliifa (1922-1957)"
        },
        image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/z7luqn3z_FB_IMG_1770339992610.jpg",
        enfants: [
          {
            id: 'djamil',
            nom: "Serigne Moustapha Sy Djamil",
            dates: "1916 - 1993",
            titre: { fr: "Borom Fass", en: "Borom Fass", ar: "بوروم فاس", wo: "Borom Fass" },
            image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/p7vxoses_FB_IMG_1770340283848.jpg",
            enfants: []
          },
          {
            id: 'maktoum',
            nom: "Serigne Cheikh Ahmed Tidiane Sy",
            surnom: "Al Maktoum",
            dates: "1925 - 2017",
            titre: { fr: "Fondateur Moustarchidine", en: "Founder Moustarchidine", ar: "مؤسس مسترشدين", wo: "Tëkkikat Moustarchidine" },
            image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/jtrbkp29_IMG-20260206-WA0053.jpg",
            enfants: [
              {
                id: 'moustapha_maktoum',
                nom: "Serigne Moustapha Sy",
                dates: "1956 -",
                titre: { fr: "Guide Moustarchidine Wal Moustarchidati", en: "Guide Moustarchidine Wal Moustarchidati", ar: "مرشد مسترشدين ومسترشدات", wo: "Guide Moustarchidine Wal Moustarchidati" },
                image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/q42z1ms8_FB_IMG_1770323089322.jpg",
                enfants: []
              }
            ]
          }
        ]
      },
      {
        id: 'mansour_balkhawmi',
        nom: "Serigne Mansour Sy",
        surnom: "Balkhawmi",
        dates: "1900 - 1957",
        titre: {
          fr: "Le Savant (Khalife quelques mois en 1957)",
          en: "The Scholar (Khalife for a few months in 1957)",
          ar: "العالم (خليفة لبضعة أشهر في 1957)",
          wo: "Borom xam-xam (Xaliifa ay weer ci 1957)"
        },
        image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/s4o5buj7_FB_IMG_1770340053073.jpg",
        enfants: []
      },
      {
        id: 'dabakh',
        nom: "Serigne Abdoul Aziz Sy",
        surnom: "Dabakh",
        dates: "1904 - 1997",
        titre: { fr: "Khalife (1957-1997)", en: "Khalife (1957-1997)", ar: "الخليفة (1957-1997)", wo: "Xaliifa (1957-1997)" },
        image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/qa8yxjql_FB_IMG_1770340203424.jpg",
        enfants: [
          {
            id: 'mansour_daradji',
            nom: "Serigne Mansour Sy",
            surnom: "Borom Daradji",
            dates: "1925 - 2012",
            titre: { fr: "Khalife (1997-2012)", en: "Khalife (1997-2012)", ar: "الخليفة (1997-2012)", wo: "Xaliifa (1997-2012)" },
            image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/mg7xetxg_FB_IMG_1770340311886.jpg",
            enfants: [
              {
                id: 'babacar_mansour',
                nom: "Serigne Babacar Sy Mansour",
                dates: "1932 -",
                titre: {
                  fr: "Khalife Actuel (depuis 2017)",
                  en: "Current Khalife (since 2017)",
                  ar: "الخليفة الحالي (منذ 2017)",
                  wo: "Xaliifa tey (dale 2017)"
                },
                image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/2yhxnkcb_FB_IMG_1770340630966.jpg",
                current: true,
                enfants: []
              }
            ]
          },
          {
            id: 'alamine',
            nom: "Serigne Abdoul Aziz Sy",
            surnom: "Al Amine",
            dates: "1928 - 2017",
            titre: { fr: "Khalife (2012-2017)", en: "Khalife (2012-2017)", ar: "الخليفة (2012-2017)", wo: "Xaliifa (2012-2017)" },
            image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/dwimysfs_FB_IMG_1770340522540.jpg",
            enfants: []
          }
        ]
      },
      {
        id: 'habib',
        nom: "Serigne Mouhammadoul Habib Sy",
        dates: "1906 - 1992",
        titre: {
          fr: "Fils cadet de Maodo",
          en: "Youngest son of Maodo",
          ar: "الابن الأصغر لمودو",
          wo: "Doom bu ndaw Maodo"
        },
        image: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/zk7vtiqg_FB_IMG_1770340169935.jpg",
        enfants: []
      }
    ]
  };

  const renderFamilyMember = (member, level = 0) => {
    const hasChildren = member.enfants && member.enfants.length > 0;
    const isExpanded = expandedNodes.includes(member.id);
    const isRoot = level === 0;
    const titre = typeof member.titre === 'object' ? (member.titre[language] || member.titre.fr) : member.titre;

    return (
      <div key={member.id} className={`${level > 0 ? 'ml-8 mt-4' : ''}`}>
        <div 
          className={`relative flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
            member.current 
              ? 'bg-[#D4AF37]/20 border-2 border-[#D4AF37]' 
              : isRoot 
                ? 'bg-[#004D33] text-white' 
                : 'bg-white hover:bg-[#E8F5E9] shadow-md'
          }`}
          onClick={() => hasChildren && toggleNode(member.id)}
        >
          {/* Ligne de connexion */}
          {level > 0 && (
            <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-[#D4AF37]"></div>
          )}

          {/* Photo */}
          <div className="relative flex-shrink-0">
            <img 
              src={member.image} 
              alt={member.nom}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
            />
            {member.current && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <Crown className="w-4 h-4 text-[#004D33]" />
              </div>
            )}
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={`font-bold truncate ${isRoot ? 'text-white' : 'text-[#004D33]'}`}>
                {member.nom}
              </h3>
              {member.surnom && (
                <span className={`text-sm ${isRoot ? 'text-[#D4AF37]' : 'text-[#D4AF37]'}`}>
                  "{member.surnom}"
                </span>
              )}
            </div>
            <p className={`text-sm ${isRoot ? 'text-white/80' : 'text-[#888888]'}`}>
              {member.dates}
            </p>
            <p className={`text-xs ${isRoot ? 'text-[#D4AF37]' : 'text-[#004D33]'}`}>
              {titre}
            </p>
          </div>

          {/* Indicateur d'expansion */}
          {hasChildren && (
            <div className={`flex-shrink-0 ${isRoot ? 'text-[#D4AF37]' : 'text-[#004D33]'}`}>
              {isExpanded ? (
                <ChevronDown className="w-6 h-6" />
              ) : (
                <ChevronRight className="w-6 h-6" />
              )}
            </div>
          )}
        </div>

        {/* Enfants */}
        {hasChildren && isExpanded && (
          <div className="relative ml-8 mt-2 pl-4 border-l-2 border-[#D4AF37]/30">
            {member.enfants.map((child) => renderFamilyMember(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="arbre-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 rounded-full px-6 py-3 mb-6">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-white font-semibold">{t('spiritualLineage')}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('familyTreeTitle')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              {t('familyTreeSubtitle')}
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6"></div>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#4A4A4A]">
            <Star className="w-4 h-4 inline mr-2 text-[#D4AF37]" />
            {t('clickToExpand')}
          </p>
        </div>
      </section>

      {/* Arbre */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderFamilyMember(familyTree)}
        </div>
      </section>

      {/* Note */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F9F7F2] rounded-2xl p-8 border-l-4 border-[#D4AF37]">
            <h3 className="text-xl font-bold text-[#004D33] mb-4">{t('aboutThisTree')}</h3>
            <p className="text-[#4A4A4A] mb-4">
              {t('treeDescription')}
            </p>
            <p className="text-[#4A4A4A] mb-4">
              {t('extendedFamily')}
            </p>
            <Link 
              to="/histoire/khalifes"
              className="inline-flex items-center gap-2 text-[#004D33] font-semibold hover:text-[#D4AF37] transition-colors"
            >
              {t('viewDetailedPage')}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Légende */}
      <section className="py-8 bg-[#F9F7F2]">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-center font-bold text-[#004D33] mb-4">{t('legend')}</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#004D33] rounded"></div>
              <span className="text-sm text-[#4A4A4A]">{t('founder')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#D4AF37]/30 border-2 border-[#D4AF37] rounded"></div>
              <span className="text-sm text-[#4A4A4A]">{t('currentKhalife')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <span className="text-sm text-[#4A4A4A]">{t('descendants')}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArbreGenealogique;
