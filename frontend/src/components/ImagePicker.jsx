/**
 * ImagePicker Component
 * Réutilisable pour sélectionner/uploader une image depuis la médiathèque
 */
import { useState, useRef } from "react";
import { Image, Upload, X, FolderOpen, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const ImagePicker = ({ value, onChange, getAuthHeaders }) => {
  const [showModal, setShowModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("library"); // "library" or "upload"
  const fileInputRef = useRef(null);

  // Fetch images from media library
  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/media/files`, {
        params: { file_type: "image", limit: 50 }
      });
      setMediaFiles(response.data.files || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Erreur lors du chargement des images");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    fetchImages();
  };

  const handleSelectImage = (file) => {
    // Construct full URL for the image
    const imageUrl = file.file_url?.startsWith('http') 
      ? file.file_url 
      : `${BACKEND_URL}${file.file_url}`;
    onChange(imageUrl);
    setShowModal(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image trop volumineuse. Maximum: 10 MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title_fr", file.name.replace(/\.[^/.]+$/, ""));

      const response = await axios.post(`${API}/media/upload`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Image uploadée");
      
      // Select the newly uploaded image
      const uploadedFile = response.data;
      const imageUrl = uploadedFile.file_url?.startsWith('http') 
        ? uploadedFile.file_url 
        : `${BACKEND_URL}${uploadedFile.file_url}`;
      onChange(imageUrl);
      setShowModal(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.detail || "Erreur lors de l'upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = () => {
    onChange("");
  };

  // Get display URL (handle both old and new formats)
  const getDisplayUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    if (url.startsWith('/api/uploads/')) {
      return `${BACKEND_URL}/api/media/uploads/${url.replace('/api/uploads/', '')}`;
    }
    if (url.startsWith('/uploads/')) {
      return `${BACKEND_URL}/api/media${url}`;
    }
    return `${BACKEND_URL}${url}`;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Image de l'article
      </label>
      
      {/* Preview or placeholder */}
      {value ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={getDisplayUrl(value)}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={handleOpenModal}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors"
              title="Changer l'image"
            >
              <Image className="w-4 h-4 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="p-2 bg-white rounded-full shadow hover:bg-red-50 transition-colors"
              title="Supprimer l'image"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpenModal}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-[#D4AF37] hover:bg-amber-50/50 transition-colors"
        >
          <Image className="w-8 h-8 text-gray-400" />
          <span className="text-sm text-gray-500">Choisir une image</span>
        </button>
      )}

      {/* URL input for external images */}
      <input
        type="url"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
        placeholder="Ou coller une URL externe..."
      />

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-[#004D33]">
                Sélectionner une image
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("library")}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === "library"
                    ? "text-[#004D33] border-b-2 border-[#D4AF37]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                Médiathèque
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === "upload"
                    ? "text-[#004D33] border-b-2 border-[#D4AF37]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Upload className="w-4 h-4" />
                Uploader
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "library" ? (
                loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004D33]"></div>
                  </div>
                ) : mediaFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucune image dans la médiathèque</p>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="mt-4 text-[#004D33] hover:underline"
                    >
                      Uploader une image
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {mediaFiles.map((file) => (
                      <button
                        key={file.id}
                        onClick={() => handleSelectImage(file)}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-[#D4AF37] transition-colors group"
                      >
                        <img
                          src={getDisplayUrl(file.file_url)}
                          alt={file.filename}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 bg-white px-2 py-1 rounded text-xs font-medium text-[#004D33]">
                            Sélectionner
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className={`w-full max-w-md h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
                      uploading
                        ? "border-[#D4AF37] bg-amber-50"
                        : "border-gray-300 hover:border-[#D4AF37] hover:bg-amber-50/50"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#D4AF37]"></div>
                        <span className="text-sm text-[#004D33]">Upload en cours...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Cliquez pour sélectionner une image
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG, JPG, WEBP • Max 10 MB
                        </span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
