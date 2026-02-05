import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, FileText, Video, Archive, Book } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState({
    pages: [],
    videos: [],
    archives: [],
    total: 0
  });
  const [loading, setLoading] = useState(true);

  // Contenu des pages pour la recherche
  const pagesContent = [
    {
      id: "histoire-origines",
      title: "Les Origines de la Tariqa Tidiane",
      path: "/histoire/origines",
      category: "Histoire",
      description: "De Cheikh Ahmed Tijani à Tivaouane. L'histoire d'une voie soufie qui a traversé les siècles.",
      keywords: ["cheikh ahmed tijani", "fès", "ain madhi", "tariqa", "tijaniyya", "fondation", "1781", "afrique ouest"]
    },
    {
      id: "histoire-malick-sy",
      title: "El Hadji Malick Sy - Maodo",
      path: "/histoire/el-hadji-malick-sy",
      category: "Histoire",
      description: "Biographie complète du fondateur de Tivaouane (1855-1922). Le Pôle Spirituel de l'Afrique de l'Ouest.",
      keywords: ["malick sy", "maodo", "1855", "1922", "érudit", "saint-louis", "1902", "installation"]
    },
    {
      id: "histoire-khalifes",
      title: "La Lignée des Khalifes",
      path: "/histoire/khalifes",
      category: "Histoire",
      description: "Les 6 successeurs d'El Hadji Malick Sy, gardiens de l'héritage spirituel.",
      keywords: ["khalife", "babacar sy", "mansour sy", "abdoul aziz sy", "dabakh", "succession"]
    },
    {
      id: "histoire-geographie",
      title: "Géographie Sacrée de Tivaouane",
      path: "/histoire/geographie",
      category: "Histoire",
      description: "Pourquoi Tivaouane est devenue le centre névralgique de la Tidjanidya.",
      keywords: ["tivaouane", "géographie", "mosquée", "zawiya", "mausolée", "cité sainte"]
    },
    {
      id: "enseignements-piliers",
      title: "Les Piliers de la Tariqa",
      path: "/enseignements/piliers",
      category: "Enseignements",
      description: "Wird, Wazifa, Hadratul Jummah : les fondements de la pratique spirituelle tidiane.",
      keywords: ["wird", "wazifa", "hadratul jummah", "dhikr", "litanie", "istighfar", "salat fatih"]
    },
    {
      id: "evenements-gamou",
      title: "Le Gamou de Tivaouane",
      path: "/evenements/gamou",
      category: "Événements",
      description: "Le plus grand rassemblement spirituel d'Afrique de l'Ouest en l'honneur du Prophète (PSL).",
      keywords: ["gamou", "maouloud", "mawlid", "bourde", "célébration", "pèlerinage", "12 rabi"]
    },
    {
      id: "archives",
      title: "Archives de la Khadra",
      path: "/archives",
      category: "Archives",
      description: "Manuscrits, photothèque, archives sonores et témoignages historiques.",
      keywords: ["archives", "manuscrits", "photos", "audio", "kifayat", "documents", "patrimoine"]
    },
    {
      id: "gallery",
      title: "Galerie Vidéos",
      path: "/gallery",
      category: "Médiathèque",
      description: "Collection de vidéos sur les enseignements, événements et cérémonies de Tivaouane.",
      keywords: ["vidéos", "conférences", "enseignements", "khoutba", "récitations"]
    }
  ];

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    setLoading(true);
    const lowerQuery = searchQuery.toLowerCase();

    try {
      // Recherche dans les pages
      const pageResults = pagesContent.filter(page => {
        const titleMatch = page.title.toLowerCase().includes(lowerQuery);
        const descMatch = page.description.toLowerCase().includes(lowerQuery);
        const keywordMatch = page.keywords.some(k => k.includes(lowerQuery));
        return titleMatch || descMatch || keywordMatch;
      });

      // Recherche dans les vidéos
      let videoResults = [];
      try {
        const response = await axios.get(`${API}/videos`, {
          params: { search: searchQuery }
        });
        videoResults = response.data;
      } catch (error) {
        console.error("Erreur recherche vidéos:", error);
      }

      // Simulation archives (à adapter selon votre backend)
      const archiveResults = [];

      setResults({
        pages: pageResults,
        videos: videoResults,
        archives: archiveResults,
        total: pageResults.length + videoResults.length + archiveResults.length
      });
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Histoire": return Book;
      case "Enseignements": return FileText;
      case "Événements": return Archive;
      case "Médiathèque": return Video;
      default: return FileText;
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center" data-testid="search-empty">
        <div className="text-center max-w-2xl px-4">
          <Search className="w-24 h-24 text-[#888888] mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#004D33] mb-4">
            Rechercher dans le site
          </h1>
          <p className="text-lg text-[#4A4A4A]">
            Utilisez la barre de recherche ci-dessus pour trouver des informations sur la Tariqa Tidiane, 
            l'histoire de Tivaouane, les enseignements et plus encore.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="search-results-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#004D33] mb-4">
            Résultats de recherche pour "{query}"
          </h1>
          {!loading && (
            <p className="text-lg text-[#888888]">
              {results.total} résultat{results.total > 1 ? 's' : ''} trouvé{results.total > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#004D33]"></div>
          </div>
        ) : results.total === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <Search className="w-16 h-16 text-[#888888] mx-auto mb-4" />
            <p className="text-xl text-[#888888] mb-4">Aucun résultat trouvé</p>
            <p className="text-[#4A4A4A]">
              Essayez avec d'autres mots-clés comme "Maodo", "Gamou", "Wird", "Khalife", etc.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pages Results */}
            {results.pages.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#004D33] mb-4 flex items-center gap-2">
                  <FileText className="w-6 h-6" />
                  Pages ({results.pages.length})
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {results.pages.map((page) => {
                    const Icon = getCategoryIcon(page.category);
                    return (
                      <Link
                        key={page.id}
                        to={page.path}
                        className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-[#D4AF37]"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-[#004D33]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-3 py-1 bg-[#E8F5E9] text-[#004D33] rounded-full text-xs font-bold">
                                {page.category}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-[#004D33] mb-2 hover:text-[#D4AF37] transition-colors">
                              {page.title}
                            </h3>
                            <p className="text-[#4A4A4A] leading-relaxed">
                              {page.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Videos Results */}
            {results.videos.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#004D33] mb-4 flex items-center gap-2">
                  <Video className="w-6 h-6" />
                  Vidéos ({results.videos.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.videos.map((video) => (
                    <Link
                      key={video.id}
                      to={`/video/${video.id}`}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                    >
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        <img
                          src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-[#004D33] mb-2 line-clamp-2">
                          {video.title}
                        </h3>
                        <p className="text-sm text-[#888888] line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;