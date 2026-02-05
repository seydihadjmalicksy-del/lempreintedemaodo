import { Link } from "react-router-dom";
import { Play, Eye } from "lucide-react";

const VideoCard = ({ video, featured = false }) => {
  const thumbnailUrl = video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`;

  return (
    <Link
      to={`/video/${video.id}`}
      data-testid={`video-card-${video.id}`}
      className={`group block bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#D4AF37] transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1 ${
        featured ? "h-full" : ""
      }`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
          }}
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-[#004D33] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm font-medium">
            {video.duration}
          </div>
        )}

        {/* Featured Badge */}
        {video.featured && (
          <div className="absolute top-3 left-3 bg-[#D4AF37] text-white px-3 py-1 rounded-full text-xs font-bold">
            ★ En Vedette
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 
          className={`font-semibold text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#004D33] transition-colors ${
            featured ? "text-lg" : "text-base"
          }`}
          data-testid={`video-title-${video.id}`}
        >
          {video.title}
        </h3>
        
        <p className="text-sm text-[#888888] mb-3 line-clamp-2">
          {video.description}
        </p>

        <div className="flex items-center justify-between text-xs text-[#888888]">
          <span className="px-3 py-1 bg-[#E8F5E9] text-[#004D33] rounded-full font-medium">
            {getCategoryLabel(video.category)}
          </span>
          
          {video.views > 0 && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{video.views.toLocaleString()} vues</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

const getCategoryLabel = (category) => {
  const labels = {
    conferences: "Conférences",
    gamou: "Gamou",
    dhikr: "Dhikr",
    histoire: "Histoire",
    autres: "Autres",
  };
  return labels[category] || category;
};

export default VideoCard;
