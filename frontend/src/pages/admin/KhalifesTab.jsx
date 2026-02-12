import { useState } from "react";
import { Plus, Save, X, Edit2, Trash2, Crown } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const KhalifesTab = ({ 
  khalifes, 
  fetchData, 
  setDeleteConfirm, 
  language,
  getAuthHeaders 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [newKhalife, setNewKhalife] = useState({
    name: "",
    title: { fr: "", en: "", ar: "", wo: "" },
    period: "",
    icon: "Crown",
    description: { fr: "", en: "", ar: "", wo: "" },
    contributions: { fr: [], en: [], ar: [], wo: [] },
    image: "",
    current: false,
    order: 0,
    active: true
  });

  const t = {
    fr: {
      newHeritier: "Nouvel Héritier", editHeritier: "Modifier l'Héritier",
      name: "Nom", period: "Période", titleLabel: "Titre", description: "Description",
      contributions: "Contributions (une par ligne)", image: "URL de l'image",
      currentKhalife: "Khalife actuel", order: "Ordre",
      french: "Français", english: "Anglais", arabic: "Arabe", wolof: "Wolof",
      active: "Actif", inactive: "Inactif",
      save: "Enregistrer", cancel: "Annuler", edit: "Modifier", delete: "Supprimer",
      addNew: "Ajouter", noKhalifes: "Aucun héritier"
    },
    en: {
      newHeritier: "New Heir", editHeritier: "Edit Heir",
      name: "Name", period: "Period", titleLabel: "Title", description: "Description",
      contributions: "Contributions (one per line)", image: "Image URL",
      currentKhalife: "Current Khalife", order: "Order",
      french: "French", english: "English", arabic: "Arabic", wolof: "Wolof",
      active: "Active", inactive: "Inactive",
      save: "Save", cancel: "Cancel", edit: "Edit", delete: "Delete",
      addNew: "Add", noKhalifes: "No heirs"
    }
  }[language] || {
    newHeritier: "Nouvel Héritier", editHeritier: "Modifier l'Héritier",
    name: "Nom", period: "Période", titleLabel: "Titre", description: "Description",
    contributions: "Contributions (une par ligne)", image: "URL de l'image",
    currentKhalife: "Khalife actuel", order: "Ordre",
    french: "Français", english: "Anglais", arabic: "Arabe", wolof: "Wolof",
    active: "Actif", inactive: "Inactif",
    save: "Enregistrer", cancel: "Annuler", edit: "Modifier", delete: "Supprimer",
    addNew: "Ajouter", noKhalifes: "Aucun héritier"
  };

  const handleAddKhalife = async () => {
    setActionLoading(true);
    try {
      const data = {
        ...newKhalife,
        contributions: {
          fr: typeof newKhalife.contributions.fr === 'string' 
            ? newKhalife.contributions.fr.split('\n').filter(c => c.trim()) 
            : newKhalife.contributions.fr,
          en: typeof newKhalife.contributions.en === 'string' 
            ? newKhalife.contributions.en.split('\n').filter(c => c.trim()) 
            : newKhalife.contributions.en,
          ar: typeof newKhalife.contributions.ar === 'string' 
            ? newKhalife.contributions.ar.split('\n').filter(c => c.trim()) 
            : newKhalife.contributions.ar,
          wo: typeof newKhalife.contributions.wo === 'string' 
            ? newKhalife.contributions.wo.split('\n').filter(c => c.trim()) 
            : newKhalife.contributions.wo
        }
      };
      await axios.post(`${API}/khalifes`, data, { headers: getAuthHeaders() });
      toast.success("Héritier ajouté avec succès");
      setShowAddForm(false);
      setNewKhalife({
        name: "",
        title: { fr: "", en: "", ar: "", wo: "" },
        period: "",
        icon: "Crown",
        description: { fr: "", en: "", ar: "", wo: "" },
        contributions: { fr: [], en: [], ar: [], wo: [] },
        image: "",
        current: false,
        order: 0,
        active: true
      });
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'héritier");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateKhalife = async (khalifeId) => {
    setActionLoading(true);
    try {
      const data = {
        ...editingItem,
        contributions: {
          fr: typeof editingItem.contributions?.fr === 'string' 
            ? editingItem.contributions.fr.split('\n').filter(c => c.trim()) 
            : editingItem.contributions?.fr || [],
          en: typeof editingItem.contributions?.en === 'string' 
            ? editingItem.contributions.en.split('\n').filter(c => c.trim()) 
            : editingItem.contributions?.en || [],
          ar: typeof editingItem.contributions?.ar === 'string' 
            ? editingItem.contributions.ar.split('\n').filter(c => c.trim()) 
            : editingItem.contributions?.ar || [],
          wo: typeof editingItem.contributions?.wo === 'string' 
            ? editingItem.contributions.wo.split('\n').filter(c => c.trim()) 
            : editingItem.contributions?.wo || []
        }
      };
      await axios.put(`${API}/khalifes/${khalifeId}`, data, { headers: getAuthHeaders() });
      toast.success("Héritier mis à jour");
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingItem(null); }}
          className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-4 py-2 rounded-lg font-medium transition-colors"
          data-testid="add-khalife-btn"
        >
          <Plus className="w-5 h-5" />
          {t.addNew}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-[#F9F7F2] rounded-lg p-6 mb-4" data-testid="add-khalife-form">
          <h3 className="font-bold text-[#004D33] mb-4">{t.newHeritier}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.name}</label>
              <input
                type="text"
                value={newKhalife.name}
                onChange={(e) => setNewKhalife({...newKhalife, name: e.target.value})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                placeholder="Serigne..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.period}</label>
              <input
                type="text"
                value={newKhalife.period}
                onChange={(e) => setNewKhalife({...newKhalife, period: e.target.value})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                placeholder="1900 - 2000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.titleLabel} ({t.french})</label>
              <input
                type="text"
                value={newKhalife.title.fr}
                onChange={(e) => setNewKhalife({...newKhalife, title: {...newKhalife.title, fr: e.target.value}})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.titleLabel} ({t.english})</label>
              <input
                type="text"
                value={newKhalife.title.en}
                onChange={(e) => setNewKhalife({...newKhalife, title: {...newKhalife.title, en: e.target.value}})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.image}</label>
              <input
                type="text"
                value={newKhalife.image}
                onChange={(e) => setNewKhalife({...newKhalife, image: e.target.value})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.description} ({t.french})</label>
              <textarea
                value={newKhalife.description.fr}
                onChange={(e) => setNewKhalife({...newKhalife, description: {...newKhalife.description, fr: e.target.value}})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.description} ({t.english})</label>
              <textarea
                value={newKhalife.description.en}
                onChange={(e) => setNewKhalife({...newKhalife, description: {...newKhalife.description, en: e.target.value}})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.contributions} ({t.french})</label>
              <textarea
                value={Array.isArray(newKhalife.contributions.fr) ? newKhalife.contributions.fr.join('\n') : newKhalife.contributions.fr}
                onChange={(e) => setNewKhalife({...newKhalife, contributions: {...newKhalife.contributions, fr: e.target.value}})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                rows={3}
                placeholder="Contribution 1&#10;Contribution 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.contributions} ({t.english})</label>
              <textarea
                value={Array.isArray(newKhalife.contributions.en) ? newKhalife.contributions.en.join('\n') : newKhalife.contributions.en}
                onChange={(e) => setNewKhalife({...newKhalife, contributions: {...newKhalife.contributions, en: e.target.value}})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                rows={3}
                placeholder="Contribution 1&#10;Contribution 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.order}</label>
              <input
                type="number"
                value={newKhalife.order}
                onChange={(e) => setNewKhalife({...newKhalife, order: parseInt(e.target.value) || 0})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                id="currentKhalife"
                checked={newKhalife.current}
                onChange={(e) => setNewKhalife({...newKhalife, current: e.target.checked})}
                className="w-5 h-5"
              />
              <label htmlFor="currentKhalife" className="text-sm font-medium text-[#4A4A4A]">{t.currentKhalife}</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddKhalife}
              disabled={actionLoading}
              className="flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {actionLoading ? "..." : t.save}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#4A4A4A] px-4 py-2 rounded-lg"
            >
              <X className="w-4 h-4" />
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Khalifes List */}
      {khalifes.length > 0 ? khalifes.map((khalife, index) => (
        <div key={khalife.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`khalife-item-${index}`}>
          {editingItem?.id === khalife.id ? (
            <div className="bg-[#F9F7F2] rounded-lg p-6" data-testid="edit-khalife-form">
              <h3 className="font-bold text-[#004D33] mb-4">{t.editHeritier}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.name}</label>
                  <input
                    type="text"
                    value={editingItem?.name || ""}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.period}</label>
                  <input
                    type="text"
                    value={editingItem?.period || ""}
                    onChange={(e) => setEditingItem({...editingItem, period: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.titleLabel} ({t.french})</label>
                  <input
                    type="text"
                    value={editingItem?.title?.fr || ""}
                    onChange={(e) => setEditingItem({...editingItem, title: {...editingItem.title, fr: e.target.value}})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.titleLabel} ({t.english})</label>
                  <input
                    type="text"
                    value={editingItem?.title?.en || ""}
                    onChange={(e) => setEditingItem({...editingItem, title: {...editingItem.title, en: e.target.value}})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.image}</label>
                  <input
                    type="text"
                    value={editingItem?.image || ""}
                    onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.description} ({t.french})</label>
                  <textarea
                    value={editingItem?.description?.fr || ""}
                    onChange={(e) => setEditingItem({...editingItem, description: {...editingItem.description, fr: e.target.value}})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.description} ({t.english})</label>
                  <textarea
                    value={editingItem?.description?.en || ""}
                    onChange={(e) => setEditingItem({...editingItem, description: {...editingItem.description, en: e.target.value}})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.order}</label>
                  <input
                    type="number"
                    value={editingItem?.order || 0}
                    onChange={(e) => setEditingItem({...editingItem, order: parseInt(e.target.value) || 0})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-4 pt-8">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit-current"
                      checked={editingItem?.current || false}
                      onChange={(e) => setEditingItem({...editingItem, current: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <label htmlFor="edit-current" className="text-sm font-medium text-[#4A4A4A]">{t.currentKhalife}</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit-active"
                      checked={editingItem?.active || false}
                      onChange={(e) => setEditingItem({...editingItem, active: e.target.checked})}
                      className="w-5 h-5"
                    />
                    <label htmlFor="edit-active" className="text-sm font-medium text-[#4A4A4A]">{t.active}</label>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleUpdateKhalife(khalife.id)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  data-testid="save-khalife-btn"
                >
                  <Save className="w-4 h-4" />
                  {actionLoading ? "..." : t.save}
                </button>
                <button
                  onClick={() => setEditingItem(null)}
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#4A4A4A] px-4 py-2 rounded-lg"
                >
                  <X className="w-4 h-4" />
                  {t.cancel}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              {khalife.image && (
                <img 
                  src={khalife.image} 
                  alt={khalife.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#004D33]">{khalife.name}</h4>
                  {khalife.current && (
                    <Crown className="w-5 h-5 text-[#D4AF37]" />
                  )}
                </div>
                <p className="text-sm text-[#888888]">{khalife.period}</p>
                {khalife.title?.fr && (
                  <p className="text-sm text-[#4A4A4A] mt-1">{khalife.title.fr}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  khalife.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {khalife.active ? t.active : t.inactive}
                </span>
                <button
                  onClick={() => setEditingItem({...khalife})}
                  className="p-2 text-[#004D33] hover:bg-[#E8F5E9] rounded-lg transition-colors"
                  title={t.edit}
                  data-testid={`edit-khalife-${index}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ type: 'khalife', id: khalife.id })}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={t.delete}
                  data-testid={`delete-khalife-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )) : (
        <p className="text-center text-[#888888] py-8">{t.noKhalifes}</p>
      )}
    </div>
  );
};

export default KhalifesTab;
