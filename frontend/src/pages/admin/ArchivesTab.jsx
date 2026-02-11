/**
 * Archives Management Tab Component
 */
import { Archive, Book, Image, Mic, Play, FileText, Trash2 } from "lucide-react";

const ArchivesTab = ({
  archives,
  archivesStats,
  onDelete,
  onSeed,
  actionLoading
}) => {
  return (
    <div className="space-y-6">
      {/* Seed Button if empty */}
      {archivesStats.total === 0 && (
        <div className="p-4 bg-[#FFF8E1] rounded-lg">
          <p className="text-[#4A4A4A] mb-4">Aucune archive trouvée. Cliquez pour initialiser les données.</p>
          <button
            onClick={onSeed}
            disabled={actionLoading}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] rounded-lg font-medium disabled:opacity-50"
          >
            {actionLoading ? "..." : "Initialiser les Archives"}
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#E8F5E9] rounded-lg p-4 flex items-center gap-3">
          <Book className="w-6 h-6 text-[#004D33]" />
          <div>
            <div className="text-xl font-bold text-[#004D33]">{archives.manuscripts?.length || 0}</div>
            <div className="text-xs text-[#4A4A4A]">Manuscrits</div>
          </div>
        </div>
        <div className="bg-[#E8F5E9] rounded-lg p-4 flex items-center gap-3">
          <Image className="w-6 h-6 text-[#004D33]" />
          <div>
            <div className="text-xl font-bold text-[#004D33]">{archives.photos?.length || 0}</div>
            <div className="text-xs text-[#4A4A4A]">Photos</div>
          </div>
        </div>
        <div className="bg-[#E8F5E9] rounded-lg p-4 flex items-center gap-3">
          <Mic className="w-6 h-6 text-[#004D33]" />
          <div>
            <div className="text-xl font-bold text-[#004D33]">{archives.audio?.length || 0}</div>
            <div className="text-xs text-[#4A4A4A]">Audio</div>
          </div>
        </div>
        <div className="bg-[#E8F5E9] rounded-lg p-4 flex items-center gap-3">
          <Play className="w-6 h-6 text-[#004D33]" />
          <div>
            <div className="text-xl font-bold text-[#004D33]">{archives.videos?.length || 0}</div>
            <div className="text-xs text-[#4A4A4A]">Vidéos</div>
          </div>
        </div>
        <div className="bg-[#E8F5E9] rounded-lg p-4 flex items-center gap-3">
          <FileText className="w-6 h-6 text-[#004D33]" />
          <div>
            <div className="text-xl font-bold text-[#004D33]">{archives.sources?.length || 0}</div>
            <div className="text-xs text-[#4A4A4A]">Sources</div>
          </div>
        </div>
      </div>

      {/* Manuscripts Section */}
      {archives.manuscripts?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-bold text-[#004D33] mb-4 flex items-center gap-2">
            <Book className="w-5 h-5" /> Manuscrits ({archives.manuscripts.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {archives.manuscripts.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-[#F9F7F2] rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#004D33] text-sm truncate">{item.title?.fr}</h4>
                  <p className="text-xs text-[#888]">{item.langue} • {item.date}</p>
                </div>
                <button
                  onClick={() => onDelete('manuscripts', item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos Section */}
      {archives.photos?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-bold text-[#004D33] mb-4 flex items-center gap-2">
            <Image className="w-5 h-5" /> Photos ({archives.photos.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {archives.photos.map((item) => (
              <div key={item.id} className="bg-[#F9F7F2] rounded-lg overflow-hidden">
                <img src={item.image} alt={item.title?.fr} className="w-full h-24 object-cover" />
                <div className="p-2 flex justify-between items-center">
                  <span className="text-xs text-[#004D33] truncate">{item.title?.fr}</span>
                  <button
                    onClick={() => onDelete('photos', item.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio Section */}
      {archives.audio?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-bold text-[#004D33] mb-4 flex items-center gap-2">
            <Mic className="w-5 h-5" /> Audio ({archives.audio.length})
          </h3>
          <div className="space-y-2">
            {archives.audio.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-[#F9F7F2] rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#004D33] rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#004D33] text-sm">{item.title}</h4>
                    <p className="text-xs text-[#888]">{item.author} • {item.duration}</p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete('audio', item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Section */}
      {archives.videos?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-bold text-[#004D33] mb-4 flex items-center gap-2">
            <Play className="w-5 h-5" /> Vidéos ({archives.videos.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {archives.videos.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-[#F9F7F2] rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`} 
                    alt={item.title?.fr} 
                    className="w-24 h-14 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-semibold text-[#004D33] text-sm">{item.title?.fr}</h4>
                    <p className="text-xs text-[#888]">{item.duration} • {item.views} vues</p>
                  </div>
                </div>
                <button
                  onClick={() => onDelete('videos', item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sources Section */}
      {archives.sources?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-bold text-[#004D33] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Sources Académiques ({archives.sources.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {archives.sources.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-[#F9F7F2] rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-[#004D33] text-sm truncate">{item.title?.fr}</h4>
                  <p className="text-xs text-[#888]">{item.source?.fr}</p>
                </div>
                <button
                  onClick={() => onDelete('sources', item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchivesTab;
