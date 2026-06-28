/**
 * ExternalLibraryTab - Admin component for managing digital library with PDF upload
 */
import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Save, X, RefreshCw, FileText, Upload, Eye, Download } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const ExternalLibraryTab = ({ getAuthHeaders }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
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
  const [selectedFile, setSelectedFile] = useState(null);

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
    setSelectedFile(null);
    setUploadProgress(0);
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
    setSelectedFile(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate PDF
    if (file.type !== 'application/pdf') {
      toast.error("Seuls les fichiers PDF sont acceptés");
      return;
    }

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Fichier trop volumineux (max 50 MB)");
      return;
    }

    setSelectedFile(file);
    
    // Auto-fill form
    const nameWithoutExt = file.name.replace(/\.pdf$/i, '').replace(/[_-]/g, ' ');
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    
    setFormData(prev => ({
      ...prev,
      filename: file.name,
      title: prev.title || nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1),
      size: `${sizeMB} MB`,
      format: "PDF",
      extension: "pdf"
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error("Le titre est requis");
      return;
    }

    // For new files, we need either a PDF upload or editing an existing file
    if (!editingFile && !selectedFile) {
      toast.error("Veuillez sélectionner un fichier PDF");
      return;
    }

    try {
      setUploading(true);

      if (editingFile) {
        // Just update metadata
        await axios.put(
          `${API}/ouvrages/external-library/files/${editingFile.id}`,
          {
            title: formData.title,
            description: formData.description,
            language: formData.language,
            order: formData.order
          },
          { headers: getAuthHeaders() }
        );
        toast.success("Document mis à jour");
      } else {
        // Upload new PDF
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);
        uploadFormData.append('title', formData.title);
        uploadFormData.append('description', formData.description || '');
        uploadFormData.append('language', formData.language);
        uploadFormData.append('order', formData.order);

        await axios.post(
          `${API}/ouvrages/external-library/upload`,
          uploadFormData,
          { 
            headers: {
              ...getAuthHeaders(),
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          }
        );
        toast.success("PDF importé avec succès");
      }

      resetForm();
      fetchFiles();
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de l'opération");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId, title) => {
    if (!window.confirm(`Supprimer "${title}" ? Le fichier PDF sera également supprimé.`)) return;

    try {
      await axios.delete(
        `${API}/ouvrages/external-library/files/${fileId}`,
        { headers: getAuthHeaders() }
      );
      setFiles(files.filter(f => f.id !== fileId));
      toast.success("Document supprimé");
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
      fetchFiles();
      toast.success("Liste actualisée");
    } catch (error) {
      toast.error("Erreur lors de l'actualisation");
    }
  };

  // Preview PDF in new tab
  const handlePreview = (file) => {
    const previewUrl = `${BACKEND_URL}/api/ouvrages/external-library/proxy/${file.id}`;
    window.open(previewUrl, '_blank');
  };

  // Download PDF
  const handleDownload = (file) => {
    const downloadUrl = `${BACKEND_URL}/api/ouvrages/external-library/download/${file.id}`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.filename || 'document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <span className="font-bold">{files.length}</span> document{files.length > 1 ? 's' : ''}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearCache}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Actualiser la liste"
          >
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white hover:bg-[#C4A030] rounded-lg transition-colors"
            data-testid="add-pdf-btn"
          >
            <Plus className="w-4 h-4" />
            Importer un PDF
          </button>
        </div>
      </div>

      {/* Info box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Bibliothèque Numérique :</strong> Importez des fichiers PDF depuis votre ordinateur. 
          Les visiteurs pourront les visualiser et télécharger directement depuis le site.
        </p>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-[#004D33]">
                {editingFile ? "Modifier le document" : "Importer un PDF"}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* File Upload (only for new files) */}
              {!editingFile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier PDF *
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      selectedFile 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 hover:border-[#004D33] hover:bg-gray-50'
                    }`}
                  >
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="w-8 h-8 text-green-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                        <p className="text-gray-600">Cliquez ou glissez un fichier PDF ici</p>
                        <p className="text-xs text-gray-400 mt-1">Maximum 50 MB</p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du document *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33] focus:border-[#004D33]"
                  placeholder="Ex: Risâla - الرسالة"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optionnel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33] focus:border-[#004D33]"
                  placeholder="Brève description du document..."
                />
              </div>

              {/* Row: Language, Order */}
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordre d&apos;affichage
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004D33]"
                    min="0"
                  />
                </div>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-700">Envoi en cours...</span>
                    <span className="text-sm font-medium text-blue-700">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={uploading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={uploading || (!editingFile && !selectedFile)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#004D33] text-white rounded-lg hover:bg-[#003D28] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingFile ? "Mettre à jour" : "Importer"}
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
          <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun document</h3>
          <p className="text-gray-500 mb-4">Importez des fichiers PDF pour la bibliothèque numérique</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C4A030]"
          >
            <Plus className="w-4 h-4" />
            Importer un PDF
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
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
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.title}</p>
                        {file.description && (
                          <p className="text-xs text-gray-500 truncate max-w-xs">{file.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{file.language}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{file.size || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handlePreview(file)}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg"
                        title="Visualiser"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-lg"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </button>
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
