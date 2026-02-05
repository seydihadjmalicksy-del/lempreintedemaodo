import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Eye, Calendar, Tag } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/videos/${id}`);
      setVideo(response.data);

      // Fetch related videos from the same category
      const relatedResponse = await axios.get(`${API}/videos`, {
        params: { category: response.data.category }
      });
      
      // Filter out the current video and limit to 3
      const filtered = relatedResponse.data
        .filter(v => v.id !== id)
        .slice(0, 3);
      setRelatedVideos(filtered);
    } catch (error) {
      console.error("Erreur lors du chargement de la vidéo:", error);
      toast.error("Vidéo non trouvée");
      navigate("/gallery");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      conferences: "Conférences",
      gamou: "Événements et Gamou",
      dhikr: "Récitations et Dhikr",
      histoire: "Histoire et Patrimoine",
      autres: "Autres",
    };
    return labels[category] || category;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]" data-testid="video-player-page">
      {/* Back Button */}
      <div className="bg-[#0a0a0a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/gallery"
            data-testid="back-to-gallery-btn"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la galerie
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div 
              className="aspect-video bg-black rounded-xl overflow-hidden mb-6 shadow-2xl"
              data-testid="youtube-player"
            >
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.youtube_id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Info */}
            <div className="bg-[#1a1a1a] rounded-xl p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 
                  className="text-2xl lg:text-3xl font-bold text-white"
                  data-testid="video-title"
                >
                  {video.title}
                </h1>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400">
                <div className="flex items-center gap-2" data-testid="video-views">
                  <Eye className="w-4 h-4" />
                  <span>{video.views.toLocaleString()} vues</span>
                </div>
                
                <div className="flex items-center gap-2" data-testid="video-date">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(video.created_at)}</span>
                </div>

                <div className="flex items-center gap-2" data-testid="video-category">
                  <Tag className="w-4 h-4" />
                  <span className="px-3 py-1 bg-[#004D33] text-[#D4AF37] rounded-full text-xs font-medium">
                    {getCategoryLabel(video.category)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
                <p className="text-gray-300 leading-relaxed" data-testid="video-description">
                  {video.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Vidéos similaires</h2>
              
              {relatedVideos.length > 0 ? (
                <div className="space-y-4" data-testid="related-videos">
                  {relatedVideos.map((relatedVideo) => (
                    <Link
                      key={relatedVideo.id}
                      to={`/video/${relatedVideo.id}`}
                      data-testid={`related-video-${relatedVideo.id}`}
                      className="block group"
                    >
                      <div className="flex gap-3 bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#3a3a3a] transition-colors">
                        <div className="w-32 h-20 flex-shrink-0 relative">
                          <img
                            src={relatedVideo.thumbnail_url || `https://img.youtube.com/vi/${relatedVideo.youtube_id}/hqdefault.jpg`}
                            alt={relatedVideo.title}
                            className="w-full h-full object-cover"
                          />
                          {relatedVideo.duration && (
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white px-1 py-0.5 rounded text-xs">
                              {relatedVideo.duration}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 py-2 pr-2">
                          <h3 className="text-sm font-medium text-white line-clamp-2 mb-1 group-hover:text-[#D4AF37] transition-colors">
                            {relatedVideo.title}
                          </h3>
                          <p className="text-xs text-gray-400">
                            {relatedVideo.views.toLocaleString()} vues
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Aucune vidéo similaire</p>
              )}

              {/* View All Button */}
              <Link
                to="/gallery"
                data-testid="view-all-from-player-btn"
                className="block mt-6 w-full text-center bg-[#004D33] hover:bg-[#003d29] text-white py-3 rounded-lg font-medium transition-colors"
              >
                Voir toutes les vidéos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
