/**
 * Media Manager Tab Component
 * Gestion des fichiers médias (PDF, images, audio, vidéo)
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Upload, FileText, Image, Music, Video, Trash2, Edit2, 
  Plus, X, Check, Tag, Link2, Eye, Search, Filter,
  GripVertical, ChevronDown, ChevronRight, FolderOpen
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FILE_TYPE_ICONS = {
  pdf: FileText,
  image: Image,
  audio: Music,
  video: Video
};

const FILE_TYPE_COLORS = {
  pdf: "text-red-500 bg-red-50",
  image: "text-blue-500 bg-blue-50",
  audio: "text-purple-500 bg-purple-50",
  video: "text-green-500 bg-green-50"
};

const MediaManagerTab = ({ getAuthHeaders }) => {
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [availablePages, setAvailablePages] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterTag, setFilterTag] = useState("");
  
  // UI State
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAssociationModal, setShowAssociationModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState({});
  
  // Form State
  const [uploadForm, setUploadForm] = useState({
    file: null,
    title_fr: "",
    title_en: "",
    description_fr: "",
    description_en: "",
    tags: ""
  });
  
  const [newTag, setNewTag] = useState({ name: "", color: "#D4AF37", description: "" });
  const [associationForm, setAssociationForm] = useState({ page_slug: "", section: "" });
  
  const fileInputRef = useRef(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [filesRes, tagsRes, pagesRes, statsRes] = await Promise.all([
        axios.get(`${API}/media/files`, {
          params: { 
            search: searchQuery || undefined,
            file_type: filterType || undefined,
            tag: filterTag || undefined,
            active_only: false
          }
        }),
        axios.get(`${API}/media/tags`),
        axios.get(`${API}/media/pages`),
        axios.get(`${API}/media/stats`)
      ]);
      
      setFiles(filesRes.data.files || []);
      setTags(tagsRes.data || []);
      setAvailablePages(pagesRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error("Error fetching media data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterType, filterTag]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // File upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10 MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Fichier trop volumineux. Maximum: 10 MB");
        return;
      }
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("title_fr", uploadForm.title_fr);
      formData.append("title_en", uploadForm.title_en);
      formData.append("description_fr", uploadForm.description_fr);
      formData.append("description_en", uploadForm.description_en);
      formData.append("tags", uploadForm.tags);

      await axios.post(`${API}/media/upload`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      toast.success("Fichier uploadé avec succès");
      setShowUploadModal(false);
      setUploadForm({
        file: null,
        title_fr: "",
        title_en: "",
        description_fr: "",
        description_en: "",
        tags: ""
      });
      fetchData();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // File actions
  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) return;
    
    try {
      await axios.delete(`${API}/media/files/${fileId}`, { headers: getAuthHeaders() });
      toast.success("Fichier supprimé");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleToggleActive = async (file) => {
    try {
      await axios.put(`${API}/media/files/${file.id}`, 
        { active: !file.active },
        { headers: getAuthHeaders() }
      );
      toast.success(file.active ? "Fichier désactivé" : "Fichier activé");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // Associations
  const handleAddAssociation = async () => {
    if (!selectedFile || !associationForm.page_slug) {
      toast.error("Veuillez sélectionner une page");
      return;
    }

    try {
      await axios.post(`${API}/media/associations`, {
        media_id: selectedFile.id,
        page_slug: associationForm.page_slug,
        section: associationForm.section || null,
        display_order: 0
      }, { headers: getAuthHeaders() });

      toast.success("Association créée");
      setShowAssociationModal(false);
      setAssociationForm({ page_slug: "", section: "" });
      fetchFileDetails(selectedFile.id);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de la création");
    }
  };

  const handleRemoveAssociation = async (associationId) => {
    try {
      await axios.delete(`${API}/media/associations/${associationId}`, { headers: getAuthHeaders() });
      toast.success("Association supprimée");
      if (selectedFile) {
        fetchFileDetails(selectedFile.id);
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const fetchFileDetails = async (fileId) => {
    try {
      const res = await axios.get(`${API}/media/files/${fileId}`);
      setSelectedFile({ ...res.data.file, associations: res.data.associations, pages: res.data.pages });
    } catch (error) {
      console.error("Error fetching file details:", error);
    }
  };

  // Tags
  const handleCreateTag = async () => {
    if (!newTag.name.trim()) {
      toast.error("Nom du tag requis");
      return;
    }

    try {
      await axios.post(`${API}/media/tags`, newTag, { headers: getAuthHeaders() });
      toast.success("Tag créé");
      setShowTagModal(false);
      setNewTag({ name: "", color: "#D4AF37", description: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de la création");
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (!window.confirm("Supprimer ce tag ?")) return;
    
    try {
      await axios.delete(`${API}/media/tags/${tagId}`, { headers: getAuthHeaders() });
      toast.success("Tag supprimé");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Render file preview
  const renderPreview = (file, size = "small") => {
    const sizeClasses = size === "small" ? "w-12 h-12" : "w-full h-48";
    
    if (file.file_type === "image") {
      return (
        <img 
          src={`${BACKEND_URL}${file.file_url}`} 
          alt={file.filename}
          className={`${sizeClasses} object-cover rounded`}
        />
      );
    }
    
    if (file.file_type === "video") {
      return (
        <video 
          src={`${BACKEND_URL}${file.file_url}`}
          className={`${sizeClasses} object-cover rounded`}
        />
      );
    }
    
    if (file.file_type === "audio") {
      return (
        <div className={`${sizeClasses} ${FILE_TYPE_COLORS.audio} rounded flex items-center justify-center`}>
          <Music className="w-6 h-6" />
        </div>
      );
    }
    
    // PDF or unknown
    const IconComponent = FILE_TYPE_ICONS[file.file_type] || FileText;
    const colorClass = FILE_TYPE_COLORS[file.file_type] || "text-gray-500 bg-gray-50";
    
    return (
      <div className={`${sizeClasses} ${colorClass} rounded flex items-center justify-center`}>
        <IconComponent className="w-6 h-6" />
      </div>
    );
  };

  return (
    <div className="space-y-6" data-testid="media-manager-tab">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#004D33]">Gestionnaire de Médias</h2>
          {stats && (
            <p className="text-sm text-gray-500 mt-1">
              {stats.total} fichiers • {stats.total_size_mb} MB utilisés
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowTagModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D4AF37] text-[#D4AF37] rounded-lg hover:bg-[#FFF8E1] transition-colors"
            data-testid="manage-tags-btn"
          >
            <Tag className="w-4 h-4" />
            Tags
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#004D33] rounded-lg hover:bg-[#b8952e] transition-colors font-medium"
            data-testid="upload-file-btn"
          >
            <Upload className="w-4 h-4" />
            Uploader
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-[#E8F5E9] rounded-lg p-4 flex items-center gap-3">
            <FolderOpen className="w-6 h-6 text-[#004D33]" />
            <div>
              <div className="text-xl font-bold text-[#004D33]">{stats.total}</div>
              <div className="text-xs text-[#4A4A4A]">Total</div>
            </div>
          </div>
          {Object.entries(stats.by_type || {}).map(([type, count]) => {
            const IconComponent = FILE_TYPE_ICONS[type] || FileText;
            return (
              <div key={type} className="bg-[#E8F5E9] rounded-lg p-4 flex items-center gap-3">
                <IconComponent className="w-6 h-6 text-[#004D33]" />
                <div>
                  <div className="text-xl font-bold text-[#004D33]">{count}</div>
                  <div className="text-xs text-[#4A4A4A] capitalize">{type}s</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un fichier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            data-testid="search-files-input"
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          data-testid="filter-type-select"
        >
          <option value="">Tous les types</option>
          <option value="pdf">PDF</option>
          <option value="image">Images</option>
          <option value="audio">Audio</option>
          <option value="video">Vidéo</option>
        </select>
        
        <select
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          data-testid="filter-tag-select"
        >
          <option value="">Tous les tags</option>
          {tags.map(tag => (
            <option key={tag.id} value={tag.name}>{tag.name}</option>
          ))}
        </select>
      </div>

      {/* Files List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004D33]"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 bg-[#F9F7F2] rounded-lg">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun fichier trouvé</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="mt-4 text-[#D4AF37] hover:underline"
          >
            Uploader votre premier fichier
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {files.map(file => (
            <div
              key={file.id}
              className={`bg-white rounded-lg border ${expandedFiles[file.id] ? 'border-[#D4AF37]' : 'border-gray-200'} overflow-hidden transition-all`}
              data-testid={`file-item-${file.id}`}
            >
              {/* File Row */}
              <div className="flex items-center gap-4 p-4">
                <button
                  onClick={() => setExpandedFiles(prev => ({ ...prev, [file.id]: !prev[file.id] }))}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {expandedFiles[file.id] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
                
                {renderPreview(file)}
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#004D33] truncate">
                    {file.title?.fr || file.filename}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className={`px-2 py-0.5 rounded ${FILE_TYPE_COLORS[file.file_type]}`}>
                      {file.file_type.toUpperCase()}
                    </span>
                    <span>{formatFileSize(file.file_size)}</span>
                    {file.tags?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {file.tags.length}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${file.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {file.active ? 'Actif' : 'Inactif'}
                  </span>
                  
                  <button
                    onClick={() => {
                      fetchFileDetails(file.id);
                      setShowAssociationModal(true);
                    }}
                    className="p-2 text-[#D4AF37] hover:bg-[#FFF8E1] rounded-lg"
                    title="Associer à une page"
                    data-testid={`associate-file-${file.id}`}
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                  
                  <a
                    href={`${BACKEND_URL}${file.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    title="Voir le fichier"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  
                  <button
                    onClick={() => handleToggleActive(file)}
                    className={`p-2 rounded-lg ${file.active ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                    title={file.active ? 'Désactiver' : 'Activer'}
                  >
                    {file.active ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Supprimer"
                    data-testid={`delete-file-${file.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Expanded Details */}
              {expandedFiles[file.id] && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-[#F9F7F2]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Preview */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Aperçu</h5>
                      {renderPreview(file, "large")}
                      
                      {file.file_type === "audio" && (
                        <audio controls className="w-full mt-2">
                          <source src={`${BACKEND_URL}${file.file_url}`} type={file.mime_type} />
                        </audio>
                      )}
                      
                      {file.file_type === "video" && (
                        <video controls className="w-full rounded mt-2">
                          <source src={`${BACKEND_URL}${file.file_url}`} type={file.mime_type} />
                        </video>
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">Titre (FR)</h5>
                        <p className="text-sm text-gray-600">{file.title?.fr || "-"}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">Description (FR)</h5>
                        <p className="text-sm text-gray-600">{file.description?.fr || "-"}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">Tags</h5>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {file.tags?.length > 0 ? file.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#004D33] rounded text-xs">
                              {tag}
                            </span>
                          )) : <span className="text-sm text-gray-400">Aucun tag</span>}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">Nom du fichier</h5>
                        <p className="text-sm text-gray-600 break-all">{file.filename}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700">Créé le</h5>
                        <p className="text-sm text-gray-600">
                          {new Date(file.created_at).toLocaleDateString('fr-FR', { 
                            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="upload-modal">
          <div className="bg-white rounded-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#004D33]">Uploader un fichier</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {/* File Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fichier *</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#D4AF37] transition-colors"
                >
                  {uploadForm.file ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-[#D4AF37]" />
                      <div className="text-left">
                        <p className="font-medium text-[#004D33]">{uploadForm.file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(uploadForm.file.size)}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Cliquez pour sélectionner un fichier</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, Images, Audio, Vidéo (max 10 MB)</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.mp3,.wav,.ogg,.m4a,.mp4,.webm,.mov"
                  className="hidden"
                  data-testid="file-input"
                />
              </div>
              
              {/* Title FR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (Français)</label>
                <input
                  type="text"
                  value={uploadForm.title_fr}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title_fr: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="Titre du fichier"
                  data-testid="title-fr-input"
                />
              </div>
              
              {/* Title EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (Anglais)</label>
                <input
                  type="text"
                  value={uploadForm.title_en}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title_en: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="File title"
                  data-testid="title-en-input"
                />
              </div>
              
              {/* Description FR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Français)</label>
                <textarea
                  value={uploadForm.description_fr}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description_fr: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  rows={2}
                  placeholder="Description du fichier"
                  data-testid="description-fr-input"
                />
              </div>
              
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="khassaide, gamou, maodo"
                  data-testid="tags-input"
                />
              </div>
              
              {/* Progress Bar */}
              {uploading && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Upload en cours...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                disabled={uploading}
              >
                Annuler
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !uploadForm.file}
                className="px-4 py-2 bg-[#D4AF37] text-[#004D33] rounded-lg hover:bg-[#b8952e] disabled:opacity-50 font-medium"
                data-testid="confirm-upload-btn"
              >
                {uploading ? "Upload..." : "Uploader"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Association Modal */}
      {showAssociationModal && selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="association-modal">
          <div className="bg-white rounded-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#004D33]">Associer à une page</h3>
                <button onClick={() => { setShowAssociationModal(false); setSelectedFile(null); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Selected File Info */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-[#F9F7F2] rounded-lg">
                {renderPreview(selectedFile)}
                <div>
                  <p className="font-medium text-[#004D33]">{selectedFile.title?.fr || selectedFile.filename}</p>
                  <p className="text-xs text-gray-500">{selectedFile.file_type.toUpperCase()}</p>
                </div>
              </div>
              
              {/* Current Associations */}
              {selectedFile.associations?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Pages associées</h4>
                  <div className="space-y-2">
                    {selectedFile.associations.map(assoc => (
                      <div key={assoc.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-sm text-green-700">{assoc.page_slug}</span>
                        <button
                          onClick={() => handleRemoveAssociation(assoc.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add Association */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner une page</label>
                  <select
                    value={associationForm.page_slug}
                    onChange={(e) => setAssociationForm(prev => ({ ...prev, page_slug: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    data-testid="page-select"
                  >
                    <option value="">-- Choisir une page --</option>
                    {availablePages.map(page => (
                      <option key={page.slug} value={page.slug} disabled={selectedFile.pages?.includes(page.slug)}>
                        {page.name?.fr || page.slug} {selectedFile.pages?.includes(page.slug) ? '(déjà associé)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section (optionnel)</label>
                  <input
                    type="text"
                    value={associationForm.section}
                    onChange={(e) => setAssociationForm(prev => ({ ...prev, section: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="ex: hero, sidebar, gallery"
                    data-testid="section-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => { setShowAssociationModal(false); setSelectedFile(null); }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Fermer
              </button>
              <button
                onClick={handleAddAssociation}
                disabled={!associationForm.page_slug}
                className="px-4 py-2 bg-[#D4AF37] text-[#004D33] rounded-lg hover:bg-[#b8952e] disabled:opacity-50 font-medium"
                data-testid="confirm-association-btn"
              >
                Associer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="tag-modal">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#004D33]">Gérer les Tags</h3>
                <button onClick={() => setShowTagModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Existing Tags */}
              {tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tags existants</h4>
                  <div className="space-y-2">
                    {tags.map(tag => (
                      <div key={tag.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: tag.color }} />
                          <span className="text-sm">{tag.name}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteTag(tag.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Create New Tag */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Créer un nouveau tag</h4>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={newTag.name}
                    onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Nom du tag"
                    data-testid="new-tag-name"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Couleur</label>
                  <input
                    type="color"
                    value={newTag.color}
                    onChange={(e) => setNewTag(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-10 rounded cursor-pointer"
                    data-testid="new-tag-color"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Description</label>
                  <input
                    type="text"
                    value={newTag.description}
                    onChange={(e) => setNewTag(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    placeholder="Description (optionnel)"
                    data-testid="new-tag-description"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowTagModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Fermer
              </button>
              <button
                onClick={handleCreateTag}
                disabled={!newTag.name.trim()}
                className="px-4 py-2 bg-[#D4AF37] text-[#004D33] rounded-lg hover:bg-[#b8952e] disabled:opacity-50 font-medium"
                data-testid="create-tag-btn"
              >
                Créer le tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManagerTab;
