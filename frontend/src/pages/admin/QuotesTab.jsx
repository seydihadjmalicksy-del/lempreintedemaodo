import { useState } from "react";
import { Plus, Save, X, Edit2, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const QuotesTab = ({ 
  quotes, 
  fetchData, 
  setDeleteConfirm, 
  language,
  getAuthHeaders 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [newQuote, setNewQuote] = useState({
    text_fr: "", text_en: "", text_ar: "", text_wo: "",
    author: "El Hadji Malick Sy", context_fr: "", context_en: "", active: true, order: 0
  });

  const t = {
    fr: {
      newQuote: "Nouvelle Citation", editQuote: "Modifier la Citation",
      french: "Français", english: "Anglais", arabic: "Arabe", wolof: "Wolof",
      author: "Auteur", context: "Contexte", active: "Actif", inactive: "Inactif",
      save: "Enregistrer", cancel: "Annuler", edit: "Modifier", delete: "Supprimer",
      addNew: "Ajouter", noQuotes: "Aucune citation"
    },
    en: {
      newQuote: "New Quote", editQuote: "Edit Quote",
      french: "French", english: "English", arabic: "Arabic", wolof: "Wolof",
      author: "Author", context: "Context", active: "Active", inactive: "Inactive",
      save: "Save", cancel: "Cancel", edit: "Edit", delete: "Delete",
      addNew: "Add", noQuotes: "No quotes"
    }
  }[language] || {
    newQuote: "Nouvelle Citation", editQuote: "Modifier la Citation",
    french: "Français", english: "Anglais", arabic: "Arabe", wolof: "Wolof",
    author: "Auteur", context: "Contexte", active: "Actif", inactive: "Inactif",
    save: "Enregistrer", cancel: "Annuler", edit: "Modifier", delete: "Supprimer",
    addNew: "Ajouter", noQuotes: "Aucune citation"
  };

  const handleAddQuote = async () => {
    setActionLoading(true);
    try {
      await axios.post(`${API}/quotes`, newQuote);
      toast.success("Citation ajoutée avec succès");
      setShowAddForm(false);
      setNewQuote({
        text_fr: "", text_en: "", text_ar: "", text_wo: "",
        author: "El Hadji Malick Sy", context_fr: "", context_en: "", active: true, order: 0
      });
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la citation");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateQuote = async (quoteId) => {
    setActionLoading(true);
    try {
      await axios.put(`${API}/quotes/${quoteId}`, editingItem, {
        headers: getAuthHeaders()
      });
      toast.success("Citation mise à jour");
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
          data-testid="add-quote-btn"
        >
          <Plus className="w-5 h-5" />
          {t.addNew}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-[#F9F7F2] rounded-lg p-6 mb-4" data-testid="add-quote-form">
          <h3 className="font-bold text-[#004D33] mb-4">{t.newQuote}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.french}</label>
              <textarea
                value={newQuote.text_fr}
                onChange={(e) => setNewQuote({...newQuote, text_fr: e.target.value})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.english}</label>
              <textarea
                value={newQuote.text_en}
                onChange={(e) => setNewQuote({...newQuote, text_en: e.target.value})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.arabic}</label>
              <textarea
                value={newQuote.text_ar}
                onChange={(e) => setNewQuote({...newQuote, text_ar: e.target.value})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent text-right"
                dir="rtl"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.wolof}</label>
              <textarea
                value={newQuote.text_wo}
                onChange={(e) => setNewQuote({...newQuote, text_wo: e.target.value})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.author}</label>
              <input
                type="text"
                value={newQuote.author}
                onChange={(e) => setNewQuote({...newQuote, author: e.target.value})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.context}</label>
              <input
                type="text"
                value={newQuote.context_fr}
                onChange={(e) => setNewQuote({...newQuote, context_fr: e.target.value})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddQuote}
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

      {/* Quotes List */}
      {quotes.length > 0 ? quotes.map((quote, index) => (
        <div key={quote.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`quote-item-${index}`}>
          {editingItem?.id === quote.id ? (
            <div className="bg-[#F9F7F2] rounded-lg p-6" data-testid="edit-quote-form">
              <h3 className="font-bold text-[#004D33] mb-4">{t.editQuote}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.french}</label>
                  <textarea
                    value={editingItem?.text_fr || ""}
                    onChange={(e) => setEditingItem({...editingItem, text_fr: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.english}</label>
                  <textarea
                    value={editingItem?.text_en || ""}
                    onChange={(e) => setEditingItem({...editingItem, text_en: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.arabic}</label>
                  <textarea
                    value={editingItem?.text_ar || ""}
                    onChange={(e) => setEditingItem({...editingItem, text_ar: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent text-right"
                    dir="rtl"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.wolof}</label>
                  <textarea
                    value={editingItem?.text_wo || ""}
                    onChange={(e) => setEditingItem({...editingItem, text_wo: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.author}</label>
                  <input
                    type="text"
                    value={editingItem?.author || ""}
                    onChange={(e) => setEditingItem({...editingItem, author: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.context}</label>
                  <input
                    type="text"
                    value={editingItem?.context_fr || ""}
                    onChange={(e) => setEditingItem({...editingItem, context_fr: e.target.value})}
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="quote-active"
                    checked={editingItem?.active || false}
                    onChange={(e) => setEditingItem({...editingItem, active: e.target.checked})}
                    className="w-5 h-5"
                  />
                  <label htmlFor="quote-active" className="text-sm font-medium text-[#4A4A4A]">{t.active}</label>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleUpdateQuote(quote.id)}
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  data-testid="save-quote-btn"
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
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-[#004D33] font-medium italic">"{quote.text_fr}"</p>
                <p className="text-sm text-[#888888] mt-2">— {quote.author}</p>
                {quote.context_fr && (
                  <p className="text-xs text-[#888888] mt-1">{quote.context_fr}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  quote.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {quote.active ? t.active : t.inactive}
                </span>
                <button
                  onClick={() => setEditingItem({...quote})}
                  className="p-2 text-[#004D33] hover:bg-[#E8F5E9] rounded-lg transition-colors"
                  title={t.edit}
                  data-testid={`edit-quote-${index}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm({ type: 'quote', id: quote.id })}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={t.delete}
                  data-testid={`delete-quote-${index}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )) : (
        <p className="text-center text-[#888888] py-8">{t.noQuotes}</p>
      )}
    </div>
  );
};

export default QuotesTab;
