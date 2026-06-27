/**
 * ExternalLibraryTab - Admin component for managing external library files
 */
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, RefreshCw, FileText, ExternalLink, Eye, Download } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const ExternalLibraryTab = ({ getAuthHeaders }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [formData, setFormData] = useState({
    filename: "",
    title: "",
    description: "",
    url: "",
    format: "PDF",
    extension: "pdf",
    size: "",
    language: "Arabe",
    is_previewable: true,
    order: 0
  });

  const formats = ["PDF", "Word", "Texte", "Image", "Audio", "Vidéo", "Archive"];
  const languages = ["Arabe", "Français", "Anglais", "Wolof"];

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/ouvrages/external-library`);
      setFiles(response.data.files || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      filename: "",
      title: "",
      description: "",
      url: "",
      format: "PDF",
      extension: "pdf",
      size: "",
      language: "Arabe",
      is_previewable: true,
      order: 0
    });
    setEditingFile(null);
    setShowForm(false);
  };

  const handleEdit = (file) => {
    setFormData({
      filename: file.filename || "",
      title: file.title || "",
      description: file.description || "",
      url: file.url || "",
      format: file.format || "PDF",
      extension: file.extension || "pdf",
      size: file.size || "",
      language: file.language || "Arabe",
      is_previewable: file.is_previewable !== false,
      order: file.order || 0
    });
    setEditingFile(file);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.url || !formData.title) {
      toast.error("URL et titre requis");
      return;
    }

    try {
      if (editingFile) {
        await axios.put(
          `${API}/ouvrages/external-library/files/${editingFile.id}`,
          formData,
          { headers: getAuthHeaders() }
        );
        toast.success("Fichier mis à jour");
      } else {
        await axios.post(
          `${API}/ouvrages/external-library/files`,
          formData,
          { headers: getAuthHeaders() }
        );
        toast.success("Fichier ajouté");
      }
      resetForm();
      fetchFiles();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (fileId, title) => {
    if (!window.confirm(`Supprimer "${title}" ?`)) return;

    try {
      await axios.delete(
        `${API}/ouvrages/external-library/files/${fileId}`,
        { headers: getAuthHeaders() }
      );
      setFiles(files.filter(f => f.id !== fileId));
      toast.success("Fichier supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleClearCache = async () => {
    try {
      await axios.post(
        `${API}/ouvrages/external-library/clear-cache`,
        {},
        { headers: getAuthHeaders() }
      );
      toast.success("Cache vidé");
    } catch (error) {
      toast.error("Erreur lors du vidage du cache");
    }
  };

  // Auto-fill filename from URL
  const handleUrlChange = (url) => {
    setFormData(prev => ({ ...prev, url }));
    
    // Extract filename from URL
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split('/').pop();
      
      if (filename && !formData.filename) {
        const name = decodeURIComponent(filename);
        const ext = name.split('.').pop()?.toLowerCase() || 'pdf';
        const title = name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        
        setFormData(prev => ({
          ...prev,
          filename: name,
          title: title.charAt(0).toUpperCase() + title.slice(1),
          extension: ext,
          format: ext === 'pdf' ? 'PDF' : ext.toUpperCase()
        }));
      }
    } catch (e) {
      // Invalid URL, ignore
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-[#004D33]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="external-library-tab">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#004D33] text-white px-4 py-2 rounded-lg">
            <span className="font-bold">{files.length}</span> fichier{files.length > 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearCache}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Vider le cache"
          >
            <RefreshCw className="w-4 h-4" />
            Vider cache
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white hover:bg-[#C4A030] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter un fichier
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Bibliothèque Dynamique :</strong> Ajoutez des URLs de fichiers hébergés externement. 
          Les modifications sont visibles immédiatement sur le site sans rebuild ni redéploiement.
        </p>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-[#004D33]">
                {editingFile ? "Modifier le fichier" : "Ajouter un fichier"}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL du fichier *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  placeholder="https://example.com/document.pdf"
                  required
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33]"
                />
              </div>

              {/* Row: Format, Extension, Language */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  >
                    {formats.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Extension
                  </label>
                  <input
                    type="text"
                    value={formData.extension}
                    onChange={(e) => setFormData({ ...formData, extension: e.target.value.toLowerCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33]"
                    placeholder="pdf"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Langue
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  >
                    {languages.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Row: Size, Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taille (ex: 2.5 MB)
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33]"
                    placeholder="1.5 MB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordre d&apos;affichage
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  />
                </div>
              </div>

              {/* Previewable checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_previewable"
                  checked={formData.is_previewable}
                  onChange={(e) => setFormData({ ...formData, is_previewable: e.target.checked })}
                  className="w-4 h-4 text-[#004D33] rounded focus:ring-[#004D33]"
                />
                <label htmlFor="is_previewable" className="text-sm text-gray-700">
                  Permettre l&apos;aperçu dans le navigateur
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
                  {editingFile ? "Mettre à jour" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Files List */}
      {files.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun fichier</h3>
          <p className="text-gray-500">Ajoutez des fichiers à la bibliothèque dynamique</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Format</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Langue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taille</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50" data-testid={`file-row-${file.id}`}>
                  <td className="px-4 py-3 text-sm text-gray-500">{file.order || 0}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{file.title}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{file.url}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{file.format}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{file.language}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{file.size || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                        title="Ouvrir l'URL"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleEdit(file)}
                        className="p-2 text-gray-500 hover:text-[#D4AF37] hover:bg-amber-50 rounded-lg"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(file.id, file.title)}
                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExternalLibraryTab;
