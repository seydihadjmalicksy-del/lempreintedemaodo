/**
 * Family Tree Management Tab Component - Full CRUD
 */
import { useState, useEffect } from "react";
import { Users, Trash2, Plus, Edit, Save, X, Loader2, Crown } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const FamilyTreeTab = ({ getAuthHeaders }) => {
  const [familyTree, setFamilyTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getEmptyFormData = () => ({
    nom: "",
    surnom: "",
    titre: { fr: "", en: "", ar: "" },
    dates: "",
    image: "",
    description: { fr: "", en: "" },
    parent_id: "",
    is_current_khalife: false,
    order: 0,
    active: true
  });

  const [formData, setFormData] = useState(getEmptyFormData());

  useEffect(() => {
    fetchFamilyTree();
  }, []);

  const fetchFamilyTree = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/family-tree`);
      setFamilyTree(response.data?.members || []);
    } catch (error) {
      console.error("Error fetching family tree:", error);
      toast.error("Erreur lors du chargement de l'arbre");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingItem) {
        await axios.put(`${API}/family-tree/${editingItem.node_id}`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Membre mis à jour");
      } else {
        await axios.post(`${API}/family-tree`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Membre ajouté");
      }
      resetForm();
      fetchFamilyTree();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'enregistrement");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingItem(member);
    setFormData({
      nom: member.nom || "",
      surnom: member.surnom || "",
      titre: member.titre || { fr: "", en: "", ar: "" },
      dates: member.dates || "",
      image: member.image || "",
      description: member.description || { fr: "", en: "" },
      parent_id: member.parent_id || "",
      is_current_khalife: member.is_current_khalife || false,
      order: member.order || 0,
      active: member.active !== false
    });
    setShowForm(true);
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Supprimer "${member.nom}" de l'arbre généalogique ?`)) return;
    try {
      await axios.delete(`${API}/family-tree/${member.node_id}`, {
        headers: getAuthHeaders()
      });
      toast.success("Membre supprimé");
      fetchFamilyTree();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
    setFormData(getEmptyFormData());
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#004D33]" />
        <p className="mt-2 text-gray-600">Chargement de l'arbre généalogique...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="family-tree-tab">
      {/* Stats */}
      <div className="bg-[#E8F5E9] rounded-lg p-4 flex items-center gap-4">
        <Users className="w-8 h-8 text-[#004D33]" />
        <div>
          <div className="text-2xl font-bold text-[#004D33]">{familyTree.length}</div>
          <div className="text-sm text-[#4A4A4A]">Membres de la famille</div>
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#004D33] flex items-center gap-2">
          <Users className="w-6 h-6" />
          Arbre Généalogique
        </h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#004D33] rounded-lg hover:bg-[#b8952e] font-medium"
          data-testid="add-member-btn"
        >
          <Plus className="w-5 h-5" />
          Ajouter un membre
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#D4AF37]" data-testid="member-form">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#004D33]">
              {editingItem ? "Modifier le membre" : "Ajouter un membre"}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name and Surname */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  placeholder="El Hadji Malick Sy"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surnom</label>
                <input
                  type="text"
                  value={formData.surnom}
                  onChange={(e) => setFormData({ ...formData, surnom: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Maodo"
                />
              </div>
            </div>

            {/* Titre multilingue */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR)</label>
                <input
                  type="text"
                  value={formData.titre?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, titre: { ...formData.titre, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Fondateur de la Tijaniyya à Tivaouane"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (EN)</label>
                <input
                  type="text"
                  value={formData.titre?.en || ""}
                  onChange={(e) => setFormData({ ...formData, titre: { ...formData.titre, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (AR)</label>
                <input
                  type="text"
                  value={formData.titre?.ar || ""}
                  onChange={(e) => setFormData({ ...formData, titre: { ...formData.titre, ar: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Dates and Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
                <input
                  type="text"
                  value={formData.dates}
                  onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="1855 - 1922"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
                <textarea
                  value={formData.description?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                <textarea
                  value={formData.description?.en || ""}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-24"
                />
              </div>
            </div>

            {/* Parent and Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent (node_id)</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Aucun (racine)</option>
                  {familyTree
                    .filter(m => m.node_id !== editingItem?.node_id)
                    .map(member => (
                      <option key={member.node_id} value={member.node_id}>
                        {member.nom} ({member.node_id})
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_current_khalife}
                    onChange={(e) => setFormData({ ...formData, is_current_khalife: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="flex items-center gap-1">
                    <Crown className="w-4 h-4 text-[#D4AF37]" />
                    Khalife actuel
                  </span>
                </label>
              </div>
              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Actif</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Ordre:</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2 bg-[#004D33] text-white rounded-lg hover:bg-[#003d29] disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {editingItem ? "Mettre à jour" : "Ajouter"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Family Members Grid */}
      {familyTree.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun membre dans l'arbre. Cliquez sur "Ajouter un membre" pour commencer.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {familyTree.map((member) => (
            <div 
              key={member.node_id} 
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                member.is_current_khalife ? 'ring-2 ring-[#D4AF37]' : ''
              }`}
              data-testid={`member-${member.node_id}`}
            >
              <div className="flex items-center gap-4 p-4">
                <img 
                  src={member.image || "https://via.placeholder.com/64"} 
                  alt={member.nom}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#004D33] truncate">{member.nom}</h3>
                    {member.is_current_khalife && (
                      <span className="px-2 py-0.5 bg-[#D4AF37] text-[#004D33] text-xs rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Actuel
                      </span>
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
                  {member.parent_id 
                    ? `Parent: ${familyTree.find(m => m.node_id === member.parent_id)?.nom || member.parent_id}` 
                    : 'Racine'}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyTreeTab;
