/**
 * Ouvrages Management Tab Component
 */
import { Book, FileText, Layers, Archive, Trash2 } from "lucide-react";

const OuvragesTab = ({
  ouvrages,
  ouvragesStats,
  onDelete,
  actionLoading,
  onSeed
}) => {
  return (
    <div className="space-y-6">
      {/* Seed Button if empty */}
      {ouvragesStats.total === 0 && (
        <div className="p-4 bg-[#FFF8E1] rounded-lg">
          <p className="text-[#4A4A4A] mb-4">Aucun ouvrage trouvé. Cliquez pour initialiser les données.</p>
          <button
            onClick={onSeed}
            disabled={actionLoading}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] rounded-lg font-medium disabled:opacity-50"
          >
            {actionLoading ? "..." : "Initialiser les Ouvrages"}
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#E8F5E9] rounded-lg p-4">
          <div className="text-2xl font-bold text-[#004D33]">{ouvrages.majeurs?.length || 0}</div>
          <div className="text-sm text-[#4A4A4A]">Ouvrages Majeurs</div>
        </div>
        <div className="bg-[#E8F5E9] rounded-lg p-4">
          <div className="text-2xl font-bold text-[#004D33]">{ouvrages.autres?.length || 0}</div>
          <div className="text-sm text-[#4A4A4A]">Autres Écrits</div>
        </div>
        <div className="bg-[#E8F5E9] rounded-lg p-4">
          <div className="text-2xl font-bold text-[#004D33]">{ouvrages.bibliotheque?.length || 0}</div>
          <div className="text-sm text-[#4A4A4A]">Bibliothèque</div>
        </div>
        <div className="bg-[#E8F5E9] rounded-lg p-4">
          <div className="text-2xl font-bold text-[#004D33]">{ouvrages.academiques?.length || 0}</div>
          <div className="text-sm text-[#4A4A4A]">Archives Académiques</div>
        </div>
      </div>

      {/* Ouvrages Majeurs Section */}
      {ouvrages.majeurs?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-bold text-[#004D33] mb-4 flex items-center gap-2">
            <Book className="w-5 h-5" /> Ouvrages Majeurs
          </h3>
          <div className="space-y-3">
            {ouvrages.majeurs.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-[#F9F7F2] rounded-lg p-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-[#004D33]">{item.titre?.fr}</h4>
                  <p className="text-sm text-[#888]">{item.auteur} - {item.date}</p>
                  {item.sous_titre && <p className="text-sm text-[#D4AF37] bismillah-text">{item.sous_titre}</p>}
                </div>
                <button
                  onClick={() => onDelete('ouvrage-majeurs', item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Autres Ouvrages Section */}
      {ouvrages.autres?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-bold text-[#004D33] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" /> Autres Écrits
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ouvrages.autres.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-[#F9F7F2] rounded-lg p-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-[#004D33]">{item.titre?.fr}</h4>
                  <p className="text-sm text-[#888] line-clamp-2">{item.description?.fr}</p>
                </div>
                <button
                  onClick={() => onDelete('ouvrage-autres', item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bibliothèque Numérique Section */}
      {ouvrages.bibliotheque?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-bold text-[#004D33] mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5" /> Bibliothèque Numérique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ouvrages.bibliotheque.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-[#F9F7F2] rounded-lg p-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-[#004D33]">{item.titre?.fr}</h4>
                  <p className="text-sm text-[#888]">{item.taille} • {item.langue}</p>
                  <a href={item.lien} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate block">
                    {item.lien?.substring(0, 50)}...
                  </a>
                </div>
                <button
                  onClick={() => onDelete('ouvrage-bibliotheque', item.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Archives Académiques Section */}
      {ouvrages.academiques?.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-bold text-[#004D33] mb-4 flex items-center gap-2">
            <Archive className="w-5 h-5" /> Archives Académiques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ouvrages.academiques.map((item) => (
              <div key={item.id} className="bg-[#F9F7F2] rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="inline-block px-2 py-0.5 bg-[#004D33] text-white text-xs rounded mb-2">
                      {item.source}
                    </span>
                    <h4 className="font-semibold text-[#004D33] text-sm">{item.titre?.fr}</h4>
                    <a href={item.lien} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      Voir le lien
                    </a>
                  </div>
                  <button
                    onClick={() => onDelete('ouvrage-archives-academiques', item.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OuvragesTab;
