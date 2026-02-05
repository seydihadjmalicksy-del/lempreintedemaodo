import { Link } from "react-router-dom";
import { Video, Image, BookOpen, Headphones, Play, Eye } from "lucide-react";

const Mediatheque = () => {
  const categories = [
    {
      icon: Video,
      titre: "Vidéos",
      nombre: "8",
      description: "Conférences, enseignements et événements de Tivaouane",
      lien: "/gallery"
    },
    {
      icon: Image,
      titre: "Photothèque",
      nombre: "150+",
      description: "Photos historiques et actuelles de la Grande Mosquée et des cérémonies",
      lien: "/archives"
    },
    {
      icon: BookOpen,
      titre: "Manuscrits",
      nombre: "25",
      description: "Ouvrages numérisés d'El Hadji Malick Sy et autres érudits",
      lien: "/enseignements/ouvrages"
    },
    {
      icon: Headphones,
      titre: "Archives Audio",
      nombre: "50+",
      description: "Causeries, tafsirs et chants spirituels enregistrés",
      lien: "/archives"
    }
  ];

  const videosRecentes = [
    {
      titre: "Khoutba du Vendredi",
      duree: "45:30",
      vues: 1250,
      thumbnail: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      titre: "Gamou 2024",
      duree: "2:15:00",
      vues: 5430,
      thumbnail: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    },
    {
      titre: "Récitation du Wird",
      duree: "1:20:00",
      vues: 2340,
      thumbnail: "https://customer-assets.emergentagent.com/job_tidiane-tariqa/artifacts/1b6zos47_FB_IMG_1770232308810.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="mediatheque-page">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#004D33] to-[#003d29] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Médiathèque
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
              Explorez notre collection multimédia sur la Tariqa Tidiane
            </p>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-[#4A4A4A] leading-relaxed">
            La médiathèque de Tivaouane rassemble une collection exhaustive de contenus audiovisuels, 
            photographiques et écrits sur l'histoire, les enseignements et la vie spirituelle de la 
            Tariqa Tidiane. Notre objectif est de rendre accessible ce patrimoine au plus grand nombre.
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
                Vidéos Récentes
              </h2>
              <div className="w-24 h-1 bg-[#D4AF37]"></div>
            </div>
            <Link
              to="/gallery"
              className="text-[#004D33] hover:text-[#D4AF37] font-medium transition-colors flex items-center gap-2"
            >
              Voir tout
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videosRecentes.map((video, index) => (
              <div
                key={index}
                className="bg-[#F9F7F2] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.titre}
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
                  <h3 className="font-semibold text-[#004D33] mb-3 text-lg">
                    {video.titre}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[#888888]">
                    <Eye className="w-4 h-4" />
                    <span>{video.vues.toLocaleString()} vues</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bibliothèque Numérique */}
      <section className="py-16 bg-[#F9F7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#004D33] mb-4">
              Bibliothèque Numérique
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
                    Ouvrages de Maodo
                  </h3>
                  <p className="text-[#4A4A4A] leading-relaxed mb-4">
                    Kifâyat ar-Râghibîn, poèmes mystiques, correspondances et autres écrits 
                    d'El Hadji Malick Sy disponibles en téléchargement.
                  </p>
                  <span className="text-[#004D33] font-medium group-hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2">
                    Consulter la bibliothèque
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
                    Archives Historiques
                  </h3>
                  <p className="text-[#4A4A4A] leading-relaxed mb-4">
                    Photos anciennes, manuscrits, enregistrements audio et documents historiques 
                    préservant la mémoire de Tivaouane.
                  </p>
                  <span className="text-[#004D33] font-medium group-hover:text-[#D4AF37] transition-colors inline-flex items-center gap-2">
                    Explorer les archives
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
            Contribuez à la Médiathèque
          </h2>
          
          <p className="text-xl text-white/90 leading-relaxed mb-8">
            Vous possédez des documents, photos, enregistrements ou vidéos relatifs à Tivaouane ? 
            Aidez-nous à enrichir notre collection pour les générations futures.
          </p>

          <Link
            to="/contact"
            className="inline-block bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Soumettre un Document
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