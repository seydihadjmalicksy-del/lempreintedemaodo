import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, FileText, Video, Archive, Book, Users, Calendar, Download, Music, Loader2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = process.env.REACT_APP_BACKEND_URL;

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { language, t } = useLanguage();
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Static pages content for local search
  const pagesContent = [
    {
      type: "page",
      title: "Les Origines de la Tijaniyya",
      url: "/histoire/origines",
      description: "De Cheikh Ahmed Tijani à Tivaouane. L'histoire d'une voie soufie qui a traversé les siècles.",
      keywords: ["cheikh ahmed tijani", "fès", "ain madhi", "tariqa", "tijaniyya", "fondation", "1781"]
    },
    {
      type: "page",
      title: "El Hadji Malick Sy - Maodo",
      url: "/histoire/maodo",
      description: "Biographie complète du fondateur de Tivaouane (1855-1922). Le Pôle Spirituel de l'Afrique de l'Ouest.",
      keywords: ["malick sy", "maodo", "1855", "1922", "érudit", "saint-louis", "tivaouane"]
    },
    {
      type: "page",
      title: "La Lignée des Héritiers",
      url: "/histoire/khalifes",
      description: "Les héritiers d'El Hadji Malick Sy, gardiens de l'héritage spirituel.",
      keywords: ["khalife", "babacar sy", "mansour sy", "abdoul aziz sy", "dabakh", "succession"]
    },
    {
      type: "page",
      title: "Géographie Sacrée de Tivaouane",
      url: "/histoire/geographie",
      description: "Pourquoi Tivaouane est devenue le centre névralgique de la Tijaniyya.",
      keywords: ["tivaouane", "géographie", "mosquée", "zawiya", "mausolée", "cité sainte"]
    },
    {
      type: "page",
      title: "Les Piliers de la Tariqa",
      url: "/enseignements/piliers",
      description: "Wird, Wazifa, Hadratul Jummah : les fondements de la pratique spirituelle tidiane.",
      keywords: ["wird", "wazifa", "hadratul jummah", "dhikr", "litanie", "istighfar", "salat fatih"]
    },
    {
      type: "page",
      title: "Le Gamou de Tivaouane",
      url: "/evenements/gamou",
      description: "Le plus grand rassemblement spirituel d'Afrique de l'Ouest en l'honneur du Prophète (PSL).",
      keywords: ["gamou", "maouloud", "mawlid", "bourde", "célébration", "pèlerinage"]
    },
    {
      type: "page",
      title: "Ouvrages de Référence",
      url: "/enseignements/ouvrages",
      description: "Bibliothèque numérique des œuvres d'El Hadji Malick Sy et des savants de Tivaouane.",
      keywords: ["ouvrages", "livres", "pdf", "télécharger", "bibliothèque", "manuscrits", "khassaide"]
    },
    {
      type: "page",
      title: "Arbre Généalogique",
      url: "/histoire/arbre-genealogique",
      description: "L'arbre généalogique de la famille d'El Hadji Malick Sy.",
      keywords: ["arbre", "généalogie", "famille", "descendants", "lignée"]
    },
    {
      type: "page",
      title: "Archives de la Khadra",
      url: "/archives",
      description: "Manuscrits, photothèque, archives sonores et témoignages historiques.",
      keywords: ["archives", "manuscrits", "photos", "audio", "documents", "patrimoine"]
    },
    {
      type: "page",
      title: "Médiathèque",
      url: "/mediatheque",
      description: "Collection de vidéos, photos et ressources multimédias.",
      keywords: ["vidéos", "photos", "conférences", "enseignements", "média"]
    }
  ];

  // Translations
  const translations = {
    fr: {
      searchTitle: "Résultats de recherche",
      resultsFor: "pour",
      resultsFound: "résultat(s) trouvé(s)",
      noResults: "Aucun résultat trouvé",
      tryOther: "Essayez avec d'autres mots-clés comme \"Maodo\", \"Gamou\", \"Wird\", \"Khalife\", etc.",
      searchPrompt: "Rechercher dans le site",
      searchHint: "Utilisez la barre de recherche pour trouver des informations sur L'empreinte de Maodo.",
      all: "Tout",
      ouvrages: "Ouvrages",
      personnalites: "Personnalités",
      pages: "Pages",
      videos: "Vidéos",
      events: "Événements",
      archives: "Archives",
      download: "Télécharger"
    },
    en: {
      searchTitle: "Search Results",
      resultsFor: "for",
      resultsFound: "result(s) found",
      noResults: "No results found",
      tryOther: "Try other keywords like \"Maodo\", \"Gamou\", \"Wird\", \"Khalife\", etc.",
      searchPrompt: "Search the site",
      searchHint: "Use the search bar to find information about L'empreinte de Maodo.",
      all: "All",
      ouvrages: "Books",
      personnalites: "Personalities",
      pages: "Pages",
      videos: "Videos",
      events: "Events",
      archives: "Archives",
      download: "Download"
    },
    ar: {
      searchTitle: "نتائج البحث",
      resultsFor: "عن",
      resultsFound: "نتيجة",
      noResults: "لم يتم العثور على نتائج",
      tryOther: "جرب كلمات أخرى مثل \"مودو\"، \"ورد\"، \"خليفة\"، إلخ.",
      searchPrompt: "البحث في الموقع",
      searchHint: "استخدم شريط البحث للعثور على معلومات.",
      all: "الكل",
      ouvrages: "الكتب",
      personnalites: "الشخصيات",
      pages: "الصفحات",
      videos: "الفيديوهات",
      events: "الأحداث",
      archives: "الأرشيف",
      download: "تحميل"
    },
    wo: {
      searchTitle: "Résultats ci ceet",
      resultsFor: "ci",
      resultsFound: "résultat(s) gis",
      noResults: "Amul dara",
      tryOther: "Jéemaal beneen baat yu mel ni \"Maodo\", \"Gamou\", \"Wird\", \"Xaliifa\", etc.",
      searchPrompt: "Seet ci site bi",
      searchHint: "Jëfandikool barre recherche bi ngir gis xam-xam ci L'empreinte de Maodo.",
      all: "Lépp",
      ouvrages: "Téere yi",
      personnalites: "Nit ñi",
      pages: "Xët yi",
      videos: "Vidéo yi",
      events: "Événements yi",
      archives: "Archives yi",
      download: "Yéegal"
    }
  };

  const txt = translations[language] || translations.fr;

  const getTypeIcon = (type) => {
    switch (type) {
      case "ouvrage": return Download;
      case "personnalite":
      case "khalife":
      case "family_member": return Users;
      case "video": return Video;
      case "evenement":
      case "event": return Calendar;
      case "audio": return Music;
      case "citation":
      case "quote": return FileText;
      case "archive": return Archive;
      default: return Book;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "ouvrage": return txt.ouvrages;
      case "personnalite":
      case "khalife":
      case "family_member": return txt.personnalites;
      case "video": return txt.videos;
      case "evenement":
      case "event": return txt.events;
      case "audio":
      case "archive": return txt.archives;
      default: return txt.pages;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "ouvrage": return "bg-emerald-100 text-emerald-700";
      case "personnalite":
      case "khalife": return "bg-amber-100 text-amber-700";
      case "video": return "bg-blue-100 text-blue-700";
      case "evenement":
      case "event": return "bg-purple-100 text-purple-700";
      case "audio": return "bg-pink-100 text-pink-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const lowerQuery = searchQuery.toLowerCase();
    let allResults = [];

    try {
      // Fetch from API
      const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(searchQuery)}&lang=${language}`);
      if (response.ok) {
        const data = await response.json();
        allResults = data.results || [];
      }
    } catch (error) {
      console.error("API search error:", error);
    }

    // Also search in local pages content
    const localResults = pagesContent.filter(page => {
      const titleMatch = page.title.toLowerCase().includes(lowerQuery);
      const descMatch = page.description.toLowerCase().includes(lowerQuery);
      const keywordMatch = page.keywords.some(k => k.toLowerCase().includes(lowerQuery));
      return titleMatch || descMatch || keywordMatch;
    }).map(page => ({
      ...page,
      score: 0.5
    }));

    // Merge and deduplicate results
    const seenUrls = new Set(allResults.map(r => r.url));
    const mergedResults = [...allResults];
    
    for (const local of localResults) {
      if (!seenUrls.has(local.url)) {
        mergedResults.push(local);
        seenUrls.add(local.url);
      }
    }

    // Sort by score
    mergedResults.sort((a, b) => (b.score || 0) - (a.score || 0));

    setResults(mergedResults);
    setTotal(mergedResults.length);
    setLoading(false);
  }, [language]);

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setResults([]);
      setTotal(0);
      setLoading(false);
    }
  }, [query, performSearch]);

  // Filter results based on active filter
  const filteredResults = activeFilter === "all" 
    ? results 
    : results.filter(r => {
        if (activeFilter === "ouvrages") return r.type === "ouvrage";
        if (activeFilter === "personnalites") return ["personnalite", "khalife", "family_member"].includes(r.type);
        if (activeFilter === "videos") return r.type === "video";
        if (activeFilter === "events") return ["evenement", "event"].includes(r.type);
        if (activeFilter === "archives") return ["archive", "audio"].includes(r.type);
        if (activeFilter === "pages") return r.type === "page";
        return true;
      });

  // Count by category
  const counts = {
    ouvrages: results.filter(r => r.type === "ouvrage").length,
    personnalites: results.filter(r => ["personnalite", "khalife", "family_member"].includes(r.type)).length,
    videos: results.filter(r => r.type === "video").length,
    events: results.filter(r => ["evenement", "event"].includes(r.type)).length,
    archives: results.filter(r => ["archive", "audio"].includes(r.type)).length,
    pages: results.filter(r => r.type === "page").length
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center" data-testid="search-empty">
        <div className="text-center max-w-2xl px-4">
          <Search className="w-24 h-24 text-[#888888] mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#004D33] mb-4">
            {txt.searchPrompt}
          </h1>
          <p className="text-lg text-[#4A4A4A]">
            {txt.searchHint}
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
            {txt.searchTitle} {txt.resultsFor} "<span className="text-[#D4AF37]">{query}</span>"
          </h1>
          {!loading && (
            <p className="text-lg text-[#888888]">
              {total} {txt.resultsFound}
            </p>
          )}
        </div>

        {/* Filters */}
        {!loading && total > 0 && (
          <div className="flex flex-wrap gap-2 mb-8" data-testid="search-filters">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === "all"
                  ? "bg-[#004D33] text-white"
                  : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
              }`}
            >
              {txt.all} ({total})
            </button>
            {counts.ouvrages > 0 && (
              <button
                onClick={() => setActiveFilter("ouvrages")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "ouvrages"
                    ? "bg-[#004D33] text-white"
                    : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
                }`}
              >
                {txt.ouvrages} ({counts.ouvrages})
              </button>
            )}
            {counts.personnalites > 0 && (
              <button
                onClick={() => setActiveFilter("personnalites")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "personnalites"
                    ? "bg-[#004D33] text-white"
                    : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
                }`}
              >
                {txt.personnalites} ({counts.personnalites})
              </button>
            )}
            {counts.pages > 0 && (
              <button
                onClick={() => setActiveFilter("pages")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "pages"
                    ? "bg-[#004D33] text-white"
                    : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
                }`}
              >
                {txt.pages} ({counts.pages})
              </button>
            )}
            {counts.videos > 0 && (
              <button
                onClick={() => setActiveFilter("videos")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "videos"
                    ? "bg-[#004D33] text-white"
                    : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
                }`}
              >
                {txt.videos} ({counts.videos})
              </button>
            )}
            {counts.events > 0 && (
              <button
                onClick={() => setActiveFilter("events")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "events"
                    ? "bg-[#004D33] text-white"
                    : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
                }`}
              >
                {txt.events} ({counts.events})
              </button>
            )}
            {counts.archives > 0 && (
              <button
                onClick={() => setActiveFilter("archives")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === "archives"
                    ? "bg-[#004D33] text-white"
                    : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
                }`}
              >
                {txt.archives} ({counts.archives})
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-16 h-16 text-[#004D33] animate-spin" />
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <Search className="w-16 h-16 text-[#888888] mx-auto mb-4" />
            <p className="text-xl text-[#888888] mb-4">{txt.noResults}</p>
            <p className="text-[#4A4A4A]">{txt.tryOther}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result, index) => {
              const Icon = getTypeIcon(result.type);
              const isDownloadable = result.type === "ouvrage" && result.url?.startsWith("/ouvrages/");
              
              const ResultWrapper = isDownloadable ? 'a' : Link;
              const wrapperProps = isDownloadable 
                ? { href: result.url, download: true, target: "_blank", rel: "noopener noreferrer" }
                : { to: result.url };

              return (
                <ResultWrapper
                  key={`${result.type}-${result.url}-${index}`}
                  {...wrapperProps}
                  className="block bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-[#D4AF37]"
                  data-testid={`search-result-${index}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon or Image */}
                    <div className="flex-shrink-0">
                      {result.image ? (
                        <img 
                          src={result.image} 
                          alt={result.title}
                          className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6 text-[#004D33]" />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(result.type)}`}>
                          {getTypeLabel(result.type)}
                        </span>
                        {isDownloadable && (
                          <span className="px-3 py-1 bg-[#004D33] text-white rounded-full text-xs font-bold flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            PDF
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#004D33] mb-2 hover:text-[#D4AF37] transition-colors">
                        {result.title}
                      </h3>
                      {result.description && (
                        <p className="text-[#4A4A4A] leading-relaxed line-clamp-2">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </div>
                </ResultWrapper>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
