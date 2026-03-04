import { useState, useEffect } from "react";
import { Video, Plus, Pencil, Trash2, RefreshCw, Eye, Star, ExternalLink, X, Save } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const VideosTab = ({ getAuthHeaders, onDelete }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: { fr: "", en: "", ar: "" },
    description: { fr: "", en: "" },
    youtube_url: "",
    category: "general",
    featured: false
  });

  const categories = [
    { value: "khassida", label: "Khassida" },
    { value: "conference", label: "Conférence" },
    { value: "documentary", label: "Documentaire" },
    { value: "interview", label: "Interview" },
    { value: "general", label: "Général" }
  ];

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/videos`);
      setVideos(response.data || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Erreur lors du chargement des vidéos");
    } finally {
      setLoading(false);
    }
  };

  const extractYoutubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const getThumbnail = (url) => {
    const videoId = extractYoutubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  const resetForm = () => {
    setFormData({
      title: { fr: "", en: "", ar: "" },
      description: { fr: "", en: "" },
      youtube_url: "",
      category: "general",
      featured: false
    });
    setEditingVideo(null);
    setShowForm(false);
  };

  const handleEdit = (video) => {
    setFormData({
      title: video.title || { fr: "", en: "", ar: "" },
      description: video.description || { fr: "", en: "" },
      youtube_url: video.youtube_url || "",
      category: video.category || "general",
      featured: video.featured || false
    });
    setEditingVideo(video);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.fr || !formData.youtube_url) {
      toast.error("Titre (FR) et URL YouTube requis");
      return;
    }

    try {
      if (editingVideo) {
        await axios.put(`${API}/videos/${editingVideo.id}`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Vidéo mise à jour");
      } else {
        await axios.post(`${API}/videos`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Vidéo ajoutée");
      }
      resetForm();
      fetchVideos();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (videoId, title) => {
    if (!window.confirm(`Supprimer la vidéo "${title}" ?`)) return;
    
    try {
      await axios.delete(`${API}/videos/${videoId}`, {
        headers: getAuthHeaders()
      });
      setVideos(videos.filter(v => v.id !== videoId));
      toast.success("Vidéo supprimée");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-[#004D33]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="videos-tab">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Video className="w-5 h-5" />
            <span className="font-bold">{videos.length}</span> vidéo{videos.length > 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchVideos}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white hover:bg-[#C4A030] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter une vidéo
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-[#004D33]">
                {editingVideo ? "Modifier la vidéo" : "Ajouter une vidéo"}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL YouTube *
                </label>
                <input
                  type="url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                {formData.youtube_url && getThumbnail(formData.youtube_url) && (
                  <img 
                    src={getThumbnail(formData.youtube_url)} 
                    alt="Preview" 
                    className="mt-2 rounded-lg w-48"
                  />
                )}
              </div>

              {/* Title FR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre (Français) *
                </label>
                <input
                  type="text"
                  value={formData.title.fr}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    title: { ...formData.title, fr: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                  required
                />
              </div>

              {/* Title EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre (English)
                </label>
                <input
                  type="text"
                  value={formData.title.en}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    title: { ...formData.title, en: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                />
              </div>

              {/* Description FR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Français)
                </label>
                <textarea
                  value={formData.description.fr}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    description: { ...formData.description, fr: e.target.value }
                  })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
                />
                <label htmlFor="featured" className="text-sm text-gray-700">
                  Vidéo mise en avant
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-[#004D33] text-white rounded-lg hover:bg-[#003D28]"
                >
                  <Save className="w-4 h-4" />
                  {editingVideo ? "Mettre à jour" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune vidéo</h3>
          <p className="text-gray-500">Ajoutez votre première vidéo YouTube</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              data-testid={`video-${video.id}`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-100">
                {getThumbnail(video.youtube_url) ? (
                  <img 
                    src={getThumbnail(video.youtube_url)} 
                    alt={video.title?.fr || "Video"} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Video className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {video.featured && (
                  <div className="absolute top-2 left-2 bg-[#D4AF37] text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    En vedette
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {video.category || "general"}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">
                  {video.title?.fr || video.title?.en || "Sans titre"}
                </h4>
                {video.description?.fr && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {video.description.fr}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {video.views || 0} vues
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-100">
                <a
                  href={video.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Voir sur YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleEdit(video)}
                  className="p-2 text-gray-500 hover:text-[#D4AF37] hover:bg-amber-50 rounded-lg transition-colors"
                  title="Modifier"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(video.id, video.title?.fr)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideosTab;
