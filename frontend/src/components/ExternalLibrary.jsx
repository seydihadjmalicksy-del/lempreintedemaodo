/**
 * ExternalLibrary Component
 * Affiche dynamiquement les fichiers d'une bibliothèque externe
 * sans nécessiter de rebuild ou redéploiement
 */
import { useState, useEffect, useCallback } from "react";
import { 
  FileText, Download, Eye, RefreshCw, AlertCircle, 
  Book, File, Image, Music, Video, Archive, ExternalLink
} from "lucide-react";

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Map des icônes par format
const formatIcons = {
  'PDF': FileText,
  'Word': FileText,
  'Texte': FileText,
  'Image': Image,
  'Audio': Music,
  'Vidéo': Video,
  'Archive': Archive,
  'default': File
};

// Map des couleurs par format
const formatColors = {
  'PDF': 'bg-red-100 text-red-600',
  'Word': 'bg-blue-100 text-blue-600',
  'Texte': 'bg-gray-100 text-gray-600',
  'Image': 'bg-purple-100 text-purple-600',
  'Audio': 'bg-green-100 text-green-600',
  'Vidéo': 'bg-pink-100 text-pink-600',
  'Archive': 'bg-yellow-100 text-yellow-600',
  'default': 'bg-gray-100 text-gray-600'
};

const ExternalLibrary = ({ language = 'fr' }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Translations
  const translations = {
    fr: {
      title: "Bibliothèque Numérique",
      subtitle: "Ouvrages et documents disponibles en téléchargement",
      loading: "Chargement des documents...",
      error: "Impossible de charger les documents",
      retry: "Réessayer",
      noFiles: "Aucun document disponible pour le moment",
      download: "Télécharger",
      preview: "Aperçu",
      format: "Format",
      size: "Taille",
      lastUpdate: "Dernière mise à jour"
    },
    en: {
      title: "Digital Library",
      subtitle: "Books and documents available for download",
      loading: "Loading documents...",
      error: "Unable to load documents",
      retry: "Retry",
      noFiles: "No documents available at the moment",
      download: "Download",
      preview: "Preview",
      format: "Format",
      size: "Size",
      lastUpdate: "Last updated"
    },
    ar: {
      title: "المكتبة الرقمية",
      subtitle: "الكتب والوثائق المتاحة للتحميل",
      loading: "جاري تحميل الوثائق...",
      error: "تعذر تحميل الوثائق",
      retry: "إعادة المحاولة",
      noFiles: "لا توجد وثائق متاحة حالياً",
      download: "تحميل",
      preview: "معاينة",
      format: "الصيغة",
      size: "الحجم",
      lastUpdate: "آخر تحديث"
    }
  };

  const txt = translations[language] || translations.fr;

  // Fetch files from backend
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/ouvrages/external-library`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setFiles(data.files || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching external library:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Get icon component for format
  const getIcon = (format) => {
    return formatIcons[format] || formatIcons.default;
  };

  // Get color class for format
  const getColorClass = (format) => {
    return formatColors[format] || formatColors.default;
  };

  // Handle download
  const handleDownload = (file) => {
    // Use serve endpoint for uploaded files or proxy for external URLs
    const downloadUrl = file.stored_filename 
      ? `${API_URL}/api/ouvrages/external-library/download/${file.id}`
      : `${API_URL}/api/ouvrages/external-library/proxy/${file.id}`;
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = file.filename || 'document.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle preview
  const handlePreview = (file) => {
    // Use serve endpoint for uploaded files or proxy for external URLs
    const previewUrl = file.stored_filename
      ? `${API_URL}/api/ouvrages/external-library/serve/${file.id}`
      : `${API_URL}/api/ouvrages/external-library/proxy/${file.id}`;
    window.open(previewUrl, '_blank', 'noopener,noreferrer');
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-12 text-center" data-testid="external-library-loading">
        <RefreshCw className="w-10 h-10 text-[#004D33] animate-spin mx-auto mb-4" />
        <p className="text-[#4A4A4A]">{txt.loading}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 text-center" data-testid="external-library-error">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <p className="text-red-600 mb-4">{txt.error}</p>
        <button
          onClick={fetchFiles}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#004D33] text-white rounded-lg hover:bg-[#003d29] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {txt.retry}
        </button>
      </div>
    );
  }

  // Empty state
  if (files.length === 0) {
    return (
      <div className="py-12 text-center" data-testid="external-library-empty">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E8F5E9] rounded-full mb-4">
          <Book className="w-8 h-8 text-[#004D33]" />
        </div>
        <p className="text-[#4A4A4A]">{txt.noFiles}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="external-library">
      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-[#004D33]">{txt.title}</h3>
          <p className="text-[#4A4A4A] mt-1">{txt.subtitle}</p>
        </div>
        <button
          onClick={fetchFiles}
          className="p-2 text-[#004D33] hover:bg-[#E8F5E9] rounded-lg transition-colors"
          title={txt.retry}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Files grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file, index) => {
          const IconComponent = getIcon(file.format);
          const colorClass = getColorClass(file.format);

          return (
            <div
              key={file.id || index}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              data-testid={`library-file-${index}`}
            >
              {/* Header with icon */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#004D33] text-lg mb-1 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {file.title || file.filename}
                    </h4>
                    {file.description && (
                      <p className="text-sm text-[#4A4A4A] line-clamp-2">
                        {file.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1 text-[#888888]">
                      <FileText className="w-4 h-4" />
                      {file.format || 'Document'}
                    </span>
                    {file.size && (
                      <span className="text-[#888888]">{file.size}</span>
                    )}
                    {file.language && (
                      <span className="text-[#888888]">{file.language}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 flex gap-3">
                {file.is_previewable && (
                  <button
                    onClick={() => handlePreview(file)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#004D33] text-[#004D33] rounded-lg hover:bg-[#004D33] hover:text-white transition-colors font-medium"
                    data-testid={`ext-lib-preview-btn-${index}`}
                  >
                    <Eye className="w-4 h-4" />
                    {txt.preview}
                  </button>
                )}
                <button
                  onClick={() => handleDownload(file)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#D4AF37] text-[#004D33] rounded-lg hover:bg-[#b8952e] transition-colors font-medium"
                  data-testid={`ext-lib-download-btn-${index}`}
                >
                  <Download className="w-4 h-4" />
                  {txt.download}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Last updated info */}
      {lastUpdated && (
        <p className="text-center text-sm text-[#888888] mt-8">
          {txt.lastUpdate}: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default ExternalLibrary;
