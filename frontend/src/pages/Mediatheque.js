import { Link } from "react-router-dom";
import { Video, Image, BookOpen, Headphones, Play, Eye, ExternalLink, Download } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const Mediatheque = () => {
  const { t, language } = useLanguage();

  const categories = [
    {
      icon: Video,
      titre: t('videos'),
      nombre: "100+",
      description: t('videosDesc'),
      lien: "/gallery"
    },
    {
      icon: Image,
      titre: t('photoLibrary'),
      nombre: "150+",
      description: t('photoLibraryDesc'),
      lien: "/archives"
    },
    {
      icon: BookOpen,
      titre: t('manuscripts'),
      nombre: "25+",
      description: t('manuscriptsDesc'),
      lien: "/enseignements/ouvrages"
    },
    {
      icon: Headphones,
      titre: t('audioArchives'),
      nombre: "50+",
      description: t('audioArchivesDesc'),
      lien: "/archives"
    }
  ];

  const chainesYoutube = [
    {
      nom: "HABIBBA TV TIVAOUANE",
      description: {
        fr: "Chaîne officielle de diffusion des événements de Tivaouane",
        en: "Official broadcast channel for Tivaouane events",
        ar: "القناة الرسمية لبث فعاليات تيفاوان",
        wo: "Chaîne officielle bu yéngu mbir Tiwaawaan yi"
      },
      lien: "https://www.youtube.com/@HABIBBATV"
    },
    {
      nom: "TIVAOUANE 24 TV",
      description: {
        fr: "Actualités et programmes religieux en direct",
        en: "Live news and religious programs",
        ar: "أخبار وبرامج دينية مباشرة",
        wo: "Xibaar yi ak programmes diine yi en direct"
      },
      lien: "https://www.youtube.com/@Tivaouane24TV"
    },
    {
      nom: "Malikiya TV",
      description: {
        fr: "Documentaires et archives sur les guides de Tivaouane",
        en: "Documentaries and archives on Tivaouane guides",
        ar: "وثائقيات وأرشيفات عن مرشدي تيفاوان",
        wo: "Documentaires ak archives ci guides Tiwaawaan yi"
      },
      lien: "https://www.youtube.com/@MalikiyaTV"
    }
  ];

  const videosRecentes = [
    {
      titre: {
        fr: "Gamou 2024 - Nuit du Mawlid",
        en: "Gamou 2024 - Mawlid Night",
        ar: "المولد 2024 - ليلة المولد",
        wo: "Gamou 2024 - Guddi Maouloud"
      },
      duree: "3:45:00",
      vues: 125000,
      youtubeId: "BOxANuUYGbk",
      thumbnail: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      titre: {
        fr: "Bourda 2024 - 10 Nuits",
        en: "Bourda 2024 - 10 Nights",
        ar: "البردة 2024 - 10 ليالٍ",
        wo: "Bourda 2024 - 10 Guddi"
      },
      duree: "2:15:00",
      vues: 54300,
      youtubeId: "Gef2Tml5ea8",
      thumbnail: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      titre: {
        fr: "Hadratoul Joumah - Zawiya",
        en: "Hadratoul Joumah - Zawiya",
        ar: "حضرة الجمعة - الزاوية",
        wo: "Hadratoul Joumah - Zawiya"
      },
      duree: "1:20:00",
      vues: 23400,
      youtubeId: "tXNSmVriybU",
      thumbnail: "https://customer-assets.emergentagent.com/job_tariqa-tidiane/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    }
  ];

  const ressourcesTelechargement = [
    {
      titre: "Khilâçu-Dhahab (L'Or Décanté)",
      type: "PDF",
      taille: "2.5 MB",
      lien: "https://www.calameo.com/books/0022411818a800b8305c6"
    },
    {
      titre: "Wassilatoul Mouna (Tayssir)",
      type: "PDF",
      taille: "1.8 MB",
      lien: "https://ssmasenegal.com/wp-content/uploads/2024/07/WASSILATOUL-MOUNA-TAYSSIR-transcription-complete-et-traduction.pdf"
    },
    {
      titre: "Ifhâm al-Munkir - Thèse",
      type: "PDF",
      taille: "5.2 MB",
      lien: "https://fr.scribd.com/document/684807738/Ifham-Munkir-Al-Jaani-These-3-Rawane-Mbaye"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="mediatheque-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {t('mediathequeTitle')}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              {t('mediathequeSubtitle')}
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-[#4A4A4A] leading-relaxed">
            {t('mediathequeIntro')}
          </p>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={index}
                  to={cat.lien}
                  className="bg-white rounded-xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-[#D4AF37] group"
                >
                  <div className="w-20 h-20 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#004D33] transition-colors">
                    <Icon className="w-10 h-10 text-[#004D33] group-hover:text-[#D4AF37] transition-colors" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#004D33] mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {cat.titre}
                  </h3>
                  
                  <div className="text-3xl font-bold text-[#D4AF37] mb-4">
                    {cat.nombre}
                  </div>
                  
                  <p className="text-[#4A4A4A] leading-relaxed">
                    {cat.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vidéos Récentes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-[#004D33] mb-2">
                {t('recentVideos')}
              </h2>
              <div className="w-24 h-1 bg-[#D4AF37]"></div>
            </div>
            <Link
              to="/gallery"
              className="text-[#004D33] hover:text-[#D4AF37] font-medium transition-colors flex items-center gap-2"
            >
              {t('seeAll')}
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videosRecentes.map((video, index) => (
              <a
                key={index}
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F9F7F2] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.titre[language] || video.titre.fr}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-[#004D33] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-8 h-8 text-[#D4AF37] ml-1" fill="#D4AF37" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
                    {video.duree}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-[#004D33] mb-3 text-lg group-hover:text-[#D4AF37] transition-colors">
                    {video.titre[language] || video.titre.fr}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[#888888]">
                    <Eye className="w-4 h-4" />
                    <span>{video.vues.toLocaleString()} {t('views')}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Chaînes YouTube */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#004D33] mb-4">
              {t('officialChannels')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-4"></div>
            <p className="text-[#4A4A4A]">{t('followLiveEvents')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {chainesYoutube.map((chaine, index) => (
              <a
                key={index}
                href={chaine.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all group flex items-start gap-4"
              >
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Play className="w-7 h-7 text-white" fill="white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#004D33] group-hover:text-[#D4AF37] transition-colors mb-2">
                    {chaine.nom}
                  </h3>
                  <p className="text-sm text-[#4A4A4A] mb-3">{chaine.description[language] || chaine.description.fr}</p>
                  <span className="text-sm text-[#D4AF37] flex items-center gap-1">
                    <ExternalLink className="w-4 h-4" />
                    {t('subscribeChannel')}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Ressources Téléchargeables */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#004D33] mb-4">
              {t('downloadableResources')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-4"></div>
            <p className="text-[#4A4A4A]">{t('maodoWorksDigital')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ressourcesTelechargement.map((ressource, index) => (
              <a
                key={index}
                href={ressource.lien}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#F9F7F2] rounded-xl p-6 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#004D33] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#004D33] group-hover:text-[#D4AF37] transition-colors mb-1">
                      {ressource.titre}
                    </h3>
                    <p className="text-sm text-[#888888]">
                      {ressource.type} • {ressource.taille}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/enseignements/ouvrages"
              className="inline-flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-6 py-3 rounded-full font-bold transition-colors"
            >
              {t('viewAllWorks')}
            </Link>
          </div>
        </div>
      </section>

      {/* Bibliothèque Numérique */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#004D33] mb-4">
              {t('digitalLibrary')}
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Link
              to="/enseignements/ouvrages"
              className="bg-white rounded-xl p-8 lg:p-12 shadow-md hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#004D33] transition-colors">
                  <BookOpen className="w-8 h-8 text-[#004D33] group-hover:text-[#D4AF37] transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#004D33] mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {t('maodoWorks')}
                  </h3>
                  <p className="text-[#4A4A4A] leading-relaxed mb-4">
                    {t('maodoWorksDesc')}
                  </p>
                  <span className="text-[#004D33] font-medium group-hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2">
                    {t('consultLibrary')}
                    <span>→</span>
                  </span>
                </div>
              </div>
            </Link>

            <Link
              to="/archives"
              className="bg-white rounded-xl p-8 lg:p-12 shadow-md hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#004D33] transition-colors">
                  <Image className="w-8 h-8 text-[#004D33] group-hover:text-[#D4AF37] transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#004D33] mb-3 group-hover:text-[#D4AF37] transition-colors">
                    {t('historicalArchives')}
                  </h3>
                  <p className="text-[#4A4A4A] leading-relaxed mb-4">
                    {t('historicalArchivesDesc')}
                  </p>
                  <span className="text-[#004D33] font-medium group-hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2">
                    {t('exploreArchives')}
                    <span>→</span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-b from-[#004D33] to-[#003d29] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            {t('contributeMediatheque')}
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            {t('contributeDesc')}
          </p>

          <Link
            to="/contact"
            className="inline-block bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            {t('submitDocument')}
          </Link>

          <div className="mt-12">
            <div className="text-[#D4AF37] text-6xl mb-4 bismillah-text">☪</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mediatheque;
