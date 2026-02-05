import { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../components/VideoCard";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Gallery = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchVideos();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  };

  const fetchVideos = async (category = "", search = "") => {
    setLoading(true);
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;

      const response = await axios.get(`${API}/videos`, { params });
      setVideos(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des vidéos:", error);
      toast.error("Erreur lors du chargement des vidéos");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchVideos(category, searchQuery);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos(selectedCategory, searchQuery);
  };

  return (
    <div className="min-h-screen py-12 islamic-pattern" data-testid="gallery-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#004D33] mb-4">
            Galerie de Vidéos
          </h1>
          <p className="text-lg text-[#4A4A4A] max-w-2xl mx-auto">
            Explorez notre collection complète de conférences, événements et récitations
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3" data-testid="search-form">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <Input
                  type="text"
                  placeholder="Rechercher une vidéo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="search-input"
                  className="pl-12 h-12 border-gray-200 focus:border-[#004D33] focus:ring-[#004D33] rounded-lg"
                />
              </div>
              <Button
                type="submit"
                data-testid="search-button"
                className="bg-[#004D33] hover:bg-[#003d29] text-white h-12 px-8 rounded-lg transition-colors"
              >
                Rechercher
              </Button>
            </div>
          </form>

          {/* Category Filter */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#004D33]" />
              <h3 className="font-semibold text-[#004D33]">Filtrer par catégorie</h3>
            </div>
            
            <div className="flex flex-wrap gap-3" data-testid="category-filters">
              <button
                onClick={() => handleCategoryChange("")}
                data-testid="category-filter-all"
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === ""
                    ? "bg-[#004D33] text-white shadow-md"
                    : "bg-gray-100 text-[#4A4A4A] hover:bg-[#E8F5E9] hover:text-[#004D33]"
                }`}
              >
                Toutes
              </button>
              
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  data-testid={`category-filter-${category.name}`}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.name
                      ? "bg-[#004D33] text-white shadow-md"
                      : "bg-gray-100 text-[#4A4A4A] hover:bg-[#E8F5E9] hover:text-[#004D33]"
                  }`}
                >
                  {category.name_fr} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20" data-testid="loading-spinner">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#004D33]"></div>
          </div>
        ) : videos.length > 0 ? (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-testid="videos-grid"
          >
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl" data-testid="no-videos-message">
            <p className="text-[#888888] text-lg">
              Aucune vidéo trouvée
              {(selectedCategory || searchQuery) && " pour cette recherche"}
            </p>
            {(selectedCategory || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory("");
                  setSearchQuery("");
                  fetchVideos();
                }}
                data-testid="reset-filters-button"
                className="mt-4 text-[#004D33] hover:text-[#D4AF37] font-medium transition-colors"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
