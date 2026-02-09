import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Maximize, X, Download, ExternalLink } from "lucide-react";

// Audio Player Component
export const AudioPlayer = ({ tracks, currentTrack, setCurrentTrack }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const track = tracks[currentTrack];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, [currentTrack]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const playNext = () => {
    if (currentTrack < tracks.length - 1) {
      setCurrentTrack(currentTrack + 1);
    }
  };

  const playPrevious = () => {
    if (currentTrack > 0) {
      setCurrentTrack(currentTrack - 1);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (!track) return null;

  return (
    <div className="bg-gradient-to-r from-[#004D33] to-[#003d29] rounded-2xl p-6 text-white shadow-2xl" data-testid="audio-player">
      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={playNext}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#D4AF37]/20 flex-shrink-0">
          {track.coverImage ? (
            <img src={track.coverImage} alt={track.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Volume2 className="w-10 h-10 text-[#D4AF37]" />
            </div>
          )}
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-bold truncate">{track.title}</h3>
          <p className="text-white/70 text-sm truncate">{track.author || "El Hadji Malick Sy"}</p>
          {track.source && (
            <a 
              href={track.source} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#D4AF37] text-xs hover:underline inline-flex items-center gap-1 mt-1"
            >
              <ExternalLink className="w-3 h-3" /> Source
            </a>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-2 bg-white/20 rounded-full cursor-pointer mb-4 group"
        onClick={handleSeek}
      >
        <div 
          className="h-full bg-[#D4AF37] rounded-full relative group-hover:bg-[#e5c654] transition-colors"
          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Time Display */}
      <div className="flex justify-between text-sm text-white/70 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={playPrevious}
          disabled={currentTrack === 0}
          className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
          data-testid="audio-prev"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button 
          onClick={togglePlay}
          className="p-4 bg-[#D4AF37] hover:bg-[#e5c654] rounded-full transition-colors shadow-lg"
          data-testid="audio-play-pause"
        >
          {isPlaying ? <Pause className="w-8 h-8 text-[#004D33]" /> : <Play className="w-8 h-8 text-[#004D33] ml-1" />}
        </button>

        <button 
          onClick={playNext}
          disabled={currentTrack === tracks.length - 1}
          className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
          data-testid="audio-next"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 accent-[#D4AF37]"
        />
      </div>

      {/* Playlist */}
      {tracks.length > 1 && (
        <div className="mt-6 border-t border-white/10 pt-4">
          <h4 className="text-sm font-semibold text-white/70 mb-3">Playlist ({tracks.length} titres)</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tracks.map((t, index) => (
              <button
                key={index}
                onClick={() => setCurrentTrack(index)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  index === currentTrack 
                    ? "bg-[#D4AF37]/20 border border-[#D4AF37]/50" 
                    : "hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <p className="text-xs text-white/50 truncate">{t.duration || ""}</p>
                  </div>
                  {index === currentTrack && isPlaying && (
                    <div className="flex gap-0.5">
                      <span className="w-1 h-3 bg-[#D4AF37] rounded-full animate-pulse"></span>
                      <span className="w-1 h-4 bg-[#D4AF37] rounded-full animate-pulse delay-75"></span>
                      <span className="w-1 h-2 bg-[#D4AF37] rounded-full animate-pulse delay-150"></span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Video Player Modal Component
export const VideoPlayerModal = ({ video, onClose }) => {
  if (!video) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      data-testid="video-modal"
    >
      <div 
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-[#D4AF37] transition-colors"
          data-testid="close-video-modal"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
          <div className="aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
          <div className="p-6 bg-gradient-to-r from-[#004D33] to-[#003d29] text-white">
            <h3 className="text-xl font-bold mb-2">{video.title}</h3>
            {video.description && (
              <p className="text-white/80 text-sm">{video.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Video Card Component
export const VideoCard = ({ video, onClick }) => {
  return (
    <div 
      className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onClick={() => onClick(video)}
      data-testid={`video-card-${video.youtubeId}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-8 h-8 text-[#004D33] ml-1" />
          </div>
        </div>
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-[#004D33] line-clamp-2 mb-1 group-hover:text-[#D4AF37] transition-colors">
          {video.title}
        </h3>
        {video.views && (
          <p className="text-sm text-gray-500">{video.views.toLocaleString()} vues</p>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
