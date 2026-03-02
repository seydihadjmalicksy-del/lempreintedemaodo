/**
 * Archives Management Tab Component - Full CRUD
 * Field names aligned with backend Pydantic models
 */
import { useState, useEffect } from "react";
import { Archive, Book, Image, Mic, Play, FileText, Trash2, Plus, Edit, Save, X, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ARCHIVE_TYPES = {
  manuscripts: { label: "Manuscrits", icon: Book, collection: "manuscripts" },
  photos: { label: "Photos", icon: Image, collection: "photos" },
  audio: { label: "Audio", icon: Mic, collection: "audio" },
  videos: { label: "Vidéos", icon: Play, collection: "videos" },
  sources: { label: "Sources", icon: FileText, collection: "sources" }
};

const ArchivesTab = ({ getAuthHeaders }) => {
  const [archives, setArchives] = useState({ manuscripts: [], photos: [], audio: [], videos: [], sources: [] });
  const [archivesStats, setArchivesStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("manuscripts");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state based on type - aligned with backend models
  const getEmptyFormData = (type) => {
    switch (type) {
      case "manuscripts":
        return {
          title: { fr: "", en: "", ar: "" },
          description: { fr: "", en: "" },
          date: "",
          langue: "Arabe",
          lien: "",
          type: "manuscript",
          order: 0,
          active: true
        };
      case "photos":
        return {
          title: { fr: "", en: "", ar: "" },
          description: { fr: "", en: "" },
          date: "",
          image: "",
          source: { fr: "Archives familiales", en: "Family archives" },
          order: 0,
          active: true
        };
      case "audio":
        return {
          title: "",
          author: "",
          duration: "",
          audioUrl: "",
          source: "Archives Tivaouane",
          coverImage: "",
          order: 0,
          active: true
        };
      case "videos":
        return {
          title: { fr: "", en: "", ar: "" },
          description: { fr: "", en: "" },
          youtubeId: "",
          duration: "",
          views: "0",
          order: 0,
          active: true
        };
      case "sources":
        return {
          title: { fr: "", en: "", ar: "" },
          description: { fr: "", en: "" },
          lien: "",
          source: { fr: "", en: "" },
          order: 0,
          active: true
        };
      default:
        return {};
    }
  };

  const [formData, setFormData] = useState(getEmptyFormData("manuscripts"));

  useEffect(() => {
    fetchAllArchives();
  }, []);

  const fetchAllArchives = async () => {
    setLoading(true);
    try {
      const [manuscriptsRes, photosRes, audioRes, videosRes, sourcesRes, statsRes] = await Promise.all([
        axios.get(`${API}/archives/manuscripts`),
        axios.get(`${API}/archives/photos`),
        axios.get(`${API}/archives/audio`),
        axios.get(`${API}/archives/videos`),
        axios.get(`${API}/archives/sources`),
        axios.get(`${API}/archives/stats`)
      ]);
      setArchives({
        manuscripts: manuscriptsRes.data || [],
        photos: photosRes.data || [],
        audio: audioRes.data || [],
        videos: videosRes.data || [],
        sources: sourcesRes.data || []
      });
      setArchivesStats(statsRes.data || { total: 0 });
    } catch (error) {
      console.error("Error fetching archives:", error);
      toast.error("Erreur lors du chargement des archives");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        await axios.put(`${API}/archives/${activeType}/${editingItem.id}`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Archive mise à jour");
      } else {
        await axios.post(`${API}/archives/${activeType}`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Archive créée");
      }
      resetForm();
      fetchAllArchives();
    } catch (error) {
      console.error("Error saving archive:", error.response?.data);
      toast.error(error.response?.data?.detail || "Erreur lors de l'enregistrement");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    
    // Map item fields based on type
    switch (activeType) {
      case "manuscripts":
        setFormData({
          title: item.title || { fr: "", en: "", ar: "" },
          description: item.description || { fr: "", en: "" },
          date: item.date || "",
          langue: item.langue || "Arabe",
          lien: item.lien || "",
          type: item.type || "manuscript",
          order: item.order || 0,
          active: item.active !== false
        });
        break;
      case "photos":
        setFormData({
          title: item.title || { fr: "", en: "", ar: "" },
          description: item.description || { fr: "", en: "" },
          date: item.date || "",
          image: item.image || "",
          source: item.source || { fr: "", en: "" },
          order: item.order || 0,
          active: item.active !== false
        });
        break;
      case "audio":
        setFormData({
          title: item.title || "",
          author: item.author || "",
          duration: item.duration || "",
          audioUrl: item.audioUrl || "",
          source: item.source || "",
          coverImage: item.coverImage || "",
          order: item.order || 0,
          active: item.active !== false
        });
        break;
      case "videos":
        setFormData({
          title: item.title || { fr: "", en: "", ar: "" },
          description: item.description || { fr: "", en: "" },
          youtubeId: item.youtubeId || "",
          duration: item.duration || "",
          views: item.views || "0",
          order: item.order || 0,
          active: item.active !== false
        });
        break;
      case "sources":
        setFormData({
          title: item.title || { fr: "", en: "", ar: "" },
          description: item.description || { fr: "", en: "" },
          lien: item.lien || "",
          source: item.source || { fr: "", en: "" },
          order: item.order || 0,
          active: item.active !== false
        });
        break;
      default:
        break;
    }
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer "${typeof item.title === 'object' ? item.title?.fr : item.title || 'cet élément'}" ?`)) return;
    try {
      await axios.delete(`${API}/archives/${activeType}/${item.id}`, {
        headers: getAuthHeaders()
      });
      toast.success("Archive supprimée");
      fetchAllArchives();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
    setFormData(getEmptyFormData(activeType));
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    resetForm();
    setFormData(getEmptyFormData(type));
  };

  const renderTypeSpecificFields = () => {
    switch (activeType) {
      case "manuscripts":
        return (
          <>
            {/* Title multilingual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR) *</label>
                <input
                  type="text"
                  value={formData.title?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (EN)</label>
                <input
                  type="text"
                  value={formData.title?.en || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (AR)</label>
                <input
                  type="text"
                  value={formData.title?.ar || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  dir="rtl"
                />
              </div>
            </div>
            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
                <textarea
                  value={formData.description?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                <textarea
                  value={formData.description?.en || ""}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
            </div>
            {/* Specific fields */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Langue *</label>
                <select
                  value={formData.langue}
                  onChange={(e) => setFormData({ ...formData, langue: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="Arabe">Arabe</option>
                  <option value="Français">Français</option>
                  <option value="Wolof">Wolof</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date/Époque *</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="XIXe siècle"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="manuscript">Manuscrit</option>
                  <option value="treatise">Traité</option>
                  <option value="letter">Lettre</option>
                  <option value="poem">Poème</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lien (URL) *</label>
                <input
                  type="url"
                  value={formData.lien}
                  onChange={(e) => setFormData({ ...formData, lien: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
          </>
        );

      case "photos":
        return (
          <>
            {/* Title multilingual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR) *</label>
                <input
                  type="text"
                  value={formData.title?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (EN)</label>
                <input
                  type="text"
                  value={formData.title?.en || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (AR)</label>
                <input
                  type="text"
                  value={formData.title?.ar || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  dir="rtl"
                />
              </div>
            </div>
            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
                <textarea
                  value={formData.description?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                <textarea
                  value={formData.description?.en || ""}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
            </div>
            {/* Specific fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Image *</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="1950"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source (FR) *</label>
                <input
                  type="text"
                  value={formData.source?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, source: { ...formData.source, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Archives familiales"
                  required
                />
              </div>
            </div>
          </>
        );

      case "audio":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Khassaide Kifaayi"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auteur/Réciteur *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Audio *</label>
                <input
                  type="url"
                  value={formData.audioUrl}
                  onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée *</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="15:30"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source *</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Archives Tivaouane"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image de couverture (URL)</label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </>
        );

      case "videos":
        return (
          <>
            {/* Title multilingual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR) *</label>
                <input
                  type="text"
                  value={formData.title?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (EN)</label>
                <input
                  type="text"
                  value={formData.title?.en || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (AR)</label>
                <input
                  type="text"
                  value={formData.title?.ar || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  dir="rtl"
                />
              </div>
            </div>
            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
                <textarea
                  value={formData.description?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                <textarea
                  value={formData.description?.en || ""}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
            </div>
            {/* Specific fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube ID *</label>
                <input
                  type="text"
                  value={formData.youtubeId}
                  onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="dQw4w9WgXcQ"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Durée *</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="1:30:00"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vues *</label>
                <input
                  type="text"
                  value={formData.views}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="1.2K"
                  required
                />
              </div>
            </div>
          </>
        );

      case "sources":
        return (
          <>
            {/* Title multilingual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR) *</label>
                <input
                  type="text"
                  value={formData.title?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (EN)</label>
                <input
                  type="text"
                  value={formData.title?.en || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (AR)</label>
                <input
                  type="text"
                  value={formData.title?.ar || ""}
                  onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  dir="rtl"
                />
              </div>
            </div>
            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
                <textarea
                  value={formData.description?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                <textarea
                  value={formData.description?.en || ""}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
            </div>
            {/* Specific fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lien (URL) *</label>
                <input
                  type="url"
                  value={formData.lien}
                  onChange={(e) => setFormData({ ...formData, lien: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source (FR) *</label>
                <input
                  type="text"
                  value={formData.source?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, source: { ...formData.source, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Bibliothèque nationale de France"
                  required
                />
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#004D33]" />
        <p className="mt-2 text-gray-600">Chargement des archives...</p>
      </div>
    );
  }

  const currentItems = archives[activeType] || [];
  const TypeIcon = ARCHIVE_TYPES[activeType]?.icon || Archive;

  const getItemTitle = (item) => {
    if (typeof item.title === 'object') {
      return item.title?.fr || item.title?.en || "Sans titre";
    }
    return item.title || "Sans titre";
  };

  return (
    <div className="space-y-6" data-testid="archives-tab">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(ARCHIVE_TYPES).map(([key, { label, icon: Icon }]) => (
          <button
            key={key}
            onClick={() => handleTypeChange(key)}
            className={`rounded-lg p-4 flex items-center gap-3 transition-all ${
              activeType === key 
                ? "bg-[#004D33] text-white" 
                : "bg-[#E8F5E9] hover:bg-[#004D33] hover:text-white"
            }`}
          >
            <Icon className="w-6 h-6" />
            <div className="text-left">
              <div className="text-xl font-bold">{archives[key]?.length || 0}</div>
              <div className="text-xs opacity-80">{label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#004D33] flex items-center gap-2">
          <TypeIcon className="w-6 h-6" />
          {ARCHIVE_TYPES[activeType]?.label} ({currentItems.length})
        </h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#004D33] rounded-lg hover:bg-[#b8952e] font-medium"
          data-testid="add-archive-btn"
        >
          <Plus className="w-5 h-5" />
          Ajouter
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#D4AF37]" data-testid="archive-form">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#004D33]">
              {editingItem ? "Modifier" : "Ajouter"} - {ARCHIVE_TYPES[activeType]?.label}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type-specific fields */}
            {renderTypeSpecificFields()}

            {/* Options */}
            <div className="flex gap-6 items-center pt-4 border-t">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Actif</span>
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm">Ordre:</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-20 px-2 py-1 border rounded"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2 bg-[#004D33] text-white rounded-lg hover:bg-[#003d29] disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {editingItem ? "Mettre à jour" : "Créer"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {currentItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <TypeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun élément. Cliquez sur "Ajouter" pour commencer.</p>
          </div>
        ) : (
          currentItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg p-4 shadow-md flex items-center justify-between border-l-4 ${
                item.active !== false ? "border-[#004D33]" : "border-gray-300"
              }`}
              data-testid={`archive-item-${item.id}`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {(item.image || item.coverImage) && (
                  <img 
                    src={item.image || item.coverImage} 
                    alt={getItemTitle(item)} 
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#004D33] truncate">{getItemTitle(item)}</h4>
                  <p className="text-sm text-gray-500 truncate">
                    {item.author || item.langue || item.date || ""}
                  </p>
                  <div className="flex gap-2 mt-1 text-xs text-gray-400">
                    {item.duration && <span>{item.duration}</span>}
                    {item.views && <span>• {item.views} vues</span>}
                    {item.type && <span className="capitalize">{item.type}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Modifier"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArchivesTab;
