/**
 * PageMediaDisplay Component
 * Affiche les fichiers médias associés à une page
 */
import { useState, useEffect } from "react";
import { FileText, Image, Music, Video, Download, ExternalLink, Play, Pause } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const FILE_TYPE_ICONS = {
  pdf: FileText,
  image: Image,
  audio: Music,
  video: Video
};

// Helper function to construct proper media URL - handles React 19 Strict Mode
const getMediaUrl = (fileUrl) => {
  if (!fileUrl) return '';
  // If already absolute URL, return as-is
  if (fileUrl.startsWith('http')) return fileUrl;
  
  // Use BACKEND_URL if available, otherwise fallback to window.location.origin
  const baseUrl = process.env.REACT_APP_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  
  // If old format without /api prefix, add it
  if (fileUrl.startsWith('/uploads/')) {
    return `${baseUrl}/api${fileUrl}`;
  }
  // If already has /api prefix or other format
  return `${baseUrl}${fileUrl}`;
};

// Format file size
const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const PageMediaDisplay = ({ pageSlug, section = null, language = "fr" }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const params = section ? { section } : {};
        const response = await axios.get(`${API}/media/associations/page/${pageSlug}`, { params });
        const files = response.data.media_files || [];
        setMediaFiles(files);
        // Group files by type in state
        setPdfFiles(files.filter(m => m.file_type === "pdf"));
        setImageFiles(files.filter(m => m.file_type === "image"));
        setAudioFiles(files.filter(m => m.file_type === "audio"));
        setVideoFiles(files.filter(m => m.file_type === "video"));
      } catch (error) {
        console.error("Error fetching page media:", error);
      } finally {
        setLoading(false);
      }
    };

    if (pageSlug) {
      fetchMedia();
    }
  }, [pageSlug, section]);

  // Handle audio play/pause
  const toggleAudio = (mediaId) => {
    const audioElement = document.getElementById(`audio-${mediaId}`);
    if (audioElement) {
      if (playingAudio === mediaId) {
        audioElement.pause();
        setPlayingAudio(null);
      } else {
        // Pause any currently playing audio
        if (playingAudio) {
          const currentAudio = document.getElementById(`audio-${playingAudio}`);
          if (currentAudio) currentAudio.pause();
        }
        audioElement.play();
        setPlayingAudio(mediaId);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (mediaFiles.length === 0) {
    return null; // Don't show anything if no media
  }

  return (
    <div className="space-y-8" data-testid="page-media-display">
      {/* Images Gallery */}
      {imageFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#004D33] flex items-center gap-2">
            <Image className="w-5 h-5" />
            {language === "fr" ? "Galerie Photos" : "Photo Gallery"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageFiles.map((media) => (
              <div
                key={media.id}
                className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all"
                onClick={() => setSelectedMedia(media)}
              >
                <img
                  src={getMediaUrl(media.file_url)}
                  alt={media.title?.[language] || media.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.error('Image load error:', media.file_url);
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {media.title?.[language] && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <p className="text-white text-sm truncate">{media.title[language]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDF Documents */}
      {pdfFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#004D33] flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {language === "fr" ? "Documents" : "Documents"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pdfFiles.map((media, index) => {
              const url = getMediaUrl(media.file_url);
              const title = media.title?.[language] || media.filename || 'Document PDF';
              const description = media.description?.[language];
              const size = formatFileSize(media.file_size);
              
              const handleClick = () => {
                if (url) window.open(url, '_blank', 'noopener,noreferrer');
              };
              
              return (
                <div
                  key={`pdf-${index}-${media.id}`}
                  onClick={handleClick}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && handleClick()}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#D4AF37] hover:shadow-md transition-all group cursor-pointer"
                  data-testid={`pdf-card-${media.id}`}
                >
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[#004D33] truncate group-hover:text-[#D4AF37] transition-colors">
                      {title}
                    </h4>
                    {description && (
                      <p className="text-sm text-gray-500 truncate">{description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{size}</p>
                  </div>
                  <Download className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Audio Files */}
      {audioFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#004D33] flex items-center gap-2">
            <Music className="w-5 h-5" />
            {language === "fr" ? "Audio" : "Audio"}
          </h3>
          <div className="space-y-3">
            {audioFiles.map((media) => (
              <div
                key={media.id}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#D4AF37] transition-all"
              >
                <button
                  onClick={() => toggleAudio(media.id)}
                  className="w-12 h-12 bg-[#004D33] rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#006B47] transition-colors"
                >
                  {playingAudio === media.id ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white ml-1" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[#004D33]">
                    {media.title?.[language] || media.filename}
                  </h4>
                  {media.description?.[language] && (
                    <p className="text-sm text-gray-500">{media.description[language]}</p>
                  )}
                  {media.duration && (
                    <p className="text-xs text-gray-400 mt-1">{media.duration}</p>
                  )}
                </div>
                <audio
                  id={`audio-${media.id}`}
                  src={getMediaUrl(media.file_url)}
                  onEnded={() => setPlayingAudio(null)}
                  className="hidden"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Files */}
      {videoFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#004D33] flex items-center gap-2">
            <Video className="w-5 h-5" />
            {language === "fr" ? "Vidéos" : "Videos"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videoFiles.map((media) => (
              <div
                key={media.id}
                className="rounded-lg overflow-hidden shadow-md bg-white"
              >
                <video
                  src={getMediaUrl(media.file_url)}
                  controls
                  className="w-full aspect-video"
                  poster={media.thumbnail_url ? getMediaUrl(media.thumbnail_url) : undefined}
                />
                {media.title?.[language] && (
                  <div className="p-3">
                    <h4 className="font-medium text-[#004D33]">{media.title[language]}</h4>
                    {media.description?.[language] && (
                      <p className="text-sm text-gray-500 mt-1">{media.description[language]}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox for Images */}
      {selectedMedia && selectedMedia.file_type === "image" && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-[#D4AF37] transition-colors"
            onClick={() => setSelectedMedia(null)}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={getMediaUrl(selectedMedia.file_url)}
            alt={selectedMedia.title?.[language] || selectedMedia.filename}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {selectedMedia.title?.[language] && (
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-lg">{selectedMedia.title[language]}</p>
              {selectedMedia.description?.[language] && (
                <p className="text-white/70 text-sm mt-1">{selectedMedia.description[language]}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageMediaDisplay;
