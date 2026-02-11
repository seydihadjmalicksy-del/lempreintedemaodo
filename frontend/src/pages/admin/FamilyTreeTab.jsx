/**
 * Family Tree Management Tab Component
 */
import { Users, Trash2 } from "lucide-react";

const FamilyTreeTab = ({
  familyTree,
  onDelete,
  onSeed,
  actionLoading
}) => {
  return (
    <div className="space-y-6">
      {/* Seed Button if empty */}
      {familyTree.length === 0 && (
        <div className="p-4 bg-[#FFF8E1] rounded-lg">
          <p className="text-[#4A4A4A] mb-4">Aucun membre dans l'arbre. Cliquez pour initialiser les données.</p>
          <button
            onClick={onSeed}
            disabled={actionLoading}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] rounded-lg font-medium disabled:opacity-50"
          >
            {actionLoading ? "..." : "Initialiser l'Arbre Généalogique"}
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="bg-[#E8F5E9] rounded-lg p-4 flex items-center gap-4">
        <Users className="w-8 h-8 text-[#004D33]" />
        <div>
          <div className="text-2xl font-bold text-[#004D33]">{familyTree.length}</div>
          <div className="text-sm text-[#4A4A4A]">Membres de la famille</div>
        </div>
      </div>

      {/* Family Members Grid */}
      {familyTree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyTree.map((member) => (
            <div key={member.node_id} className={`bg-white rounded-lg shadow-md overflow-hidden ${member.is_current_khalife ? 'ring-2 ring-[#D4AF37]' : ''}`}>
              <div className="flex items-center gap-4 p-4">
                <img 
                  src={member.image} 
                  alt={member.nom}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#004D33] truncate">{member.nom}</h3>
                    {member.is_current_khalife && (
                      <span className="px-2 py-0.5 bg-[#D4AF37] text-[#004D33] text-xs rounded-full">Actuel</span>
                    )}
                  </div>
                  {member.surnom && (
                    <p className="text-sm text-[#D4AF37]">"{member.surnom}"</p>
                  )}
                  <p className="text-xs text-[#888]">{member.dates}</p>
                  <p className="text-xs text-[#004D33] truncate">{member.titre?.fr}</p>
                </div>
              </div>
              <div className="px-4 pb-4 flex justify-between items-center border-t pt-2">
                <span className="text-xs text-[#888]">
                  {member.parent_id ? `Parent: ${member.parent_id}` : 'Racine'}
                </span>
                <button
                  onClick={() => onDelete(member.node_id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyTreeTab;
