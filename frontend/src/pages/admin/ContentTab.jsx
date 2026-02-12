import { useState } from "react";
import { Plus, Save, X, Edit2, Trash2, FilePlus, Layers } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ContentTab = ({ 
  pageContent, 
  pages,
  fetchData, 
  setDeleteConfirm, 
  language,
  getAuthHeaders 
}) => {
  const [selectedPage, setSelectedPage] = useState(null);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [newPage, setNewPage] = useState({ slug: "", title: "" });
  const [newSection, setNewSection] = useState({
    slug: "",
    section: "",
    content: { fr: "", en: "", ar: "", wo: "" },
    metadata: { type: "text" },
    order: 0,
    active: true
  });

  const t = {
    fr: {
      allPages: "Toutes les pages", page: "Page", section: "Section", sections: "sections",
      newPage: "Nouvelle Page", newSection: "Nouvelle Section",
      createPage: "Créer une page", addSection: "Ajouter une section",
      backToPages: "Retour aux pages", selectPage: "Sélectionner une page",
      slug: "Identifiant (slug)", titleLabel: "Titre", contentText: "Contenu",
      sectionType: "Type de section", order: "Ordre",
      french: "Français", english: "Anglais", arabic: "Arabe", wolof: "Wolof",
      active: "Actif", inactive: "Inactif",
      save: "Enregistrer", cancel: "Annuler", edit: "Modifier", delete: "Supprimer",
      noContent: "Aucun contenu. Créez une nouvelle page.",
      editContent: "Modifier le Contenu"
    },
    en: {
      allPages: "All Pages", page: "Page", section: "Section", sections: "sections",
      newPage: "New Page", newSection: "New Section",
      createPage: "Create page", addSection: "Add section",
      backToPages: "Back to pages", selectPage: "Select a page",
      slug: "Slug", titleLabel: "Title", contentText: "Content",
      sectionType: "Section type", order: "Order",
      french: "French", english: "English", arabic: "Arabic", wolof: "Wolof",
      active: "Active", inactive: "Inactive",
      save: "Save", cancel: "Cancel", edit: "Edit", delete: "Delete",
      noContent: "No content. Create a new page.",
      editContent: "Edit Content"
    }
  }[language] || {
    allPages: "Toutes les pages", page: "Page", section: "Section", sections: "sections",
    newPage: "Nouvelle Page", newSection: "Nouvelle Section",
    createPage: "Créer une page", addSection: "Ajouter une section",
    backToPages: "Retour aux pages", selectPage: "Sélectionner une page",
    slug: "Identifiant (slug)", titleLabel: "Titre", contentText: "Contenu",
    sectionType: "Type de section", order: "Ordre",
    french: "Français", english: "Anglais", arabic: "Arabe", wolof: "Wolof",
    active: "Actif", inactive: "Inactif",
    save: "Enregistrer", cancel: "Annuler", edit: "Modifier", delete: "Supprimer",
    noContent: "Aucun contenu. Créez une nouvelle page.",
    editContent: "Modifier le Contenu"
  };

  const handleCreatePage = async () => {
    if (!newPage.slug.trim()) {
      toast.error("Le slug de la page est requis");
      return;
    }
    setActionLoading(true);
    try {
      const initialSection = {
        slug: newPage.slug.toLowerCase().replace(/\s+/g, '-'),
        section: "introduction",
        content: { 
          fr: `Contenu de la page ${newPage.title || newPage.slug}`, 
          en: `Content of page ${newPage.title || newPage.slug}`,
          ar: "",
          wo: ""
        },
        metadata: { type: "text", title: newPage.title },
        order: 0,
        active: true
      };
      await axios.post(`${API}/content`, initialSection, {
        headers: getAuthHeaders()
      });
      toast.success("Page créée avec succès");
      setShowNewPageForm(false);
      setNewPage({ slug: "", title: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de la création de la page");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddSection = async () => {
    if (!newSection.section.trim()) {
      toast.error("Le nom de la section est requis");
      return;
    }
    setActionLoading(true);
    try {
      const sectionData = {
        ...newSection,
        slug: selectedPage
      };
      await axios.post(`${API}/content`, sectionData, {
        headers: getAuthHeaders()
      });
      toast.success("Section ajoutée avec succès");
      setShowNewSectionForm(false);
      setNewSection({
        slug: "",
        section: "",
        content: { fr: "", en: "", ar: "", wo: "" },
        metadata: { type: "text" },
        order: 0,
        active: true
      });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'ajout de la section");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateContent = async (contentId) => {
    setActionLoading(true);
    try {
      await axios.put(`${API}/content/${contentId}`, editingItem, {
        headers: getAuthHeaders()
      });
      toast.success("Section mise à jour");
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredContent = selectedPage 
    ? pageContent.filter(c => c.slug === selectedPage)
    : pageContent;

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b">
        {selectedPage ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setSelectedPage(null); setShowNewSectionForm(false); }}
              className="flex items-center gap-2 text-[#004D33] hover:text-[#003d29]"
            >
              ← {t.backToPages}
            </button>
            <h3 className="text-xl font-bold text-[#004D33] capitalize">
              {t.page}: {selectedPage}
            </h3>
          </div>
        ) : (
          <h3 className="text-xl font-bold text-[#004D33]">
            {t.allPages} ({pages.length})
          </h3>
        )}
        
        <div className="flex gap-2">
          {selectedPage ? (
            <button
              onClick={() => setShowNewSectionForm(!showNewSectionForm)}
              className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-4 py-2 rounded-lg font-medium"
            >
              <Plus className="w-5 h-5" />
              {t.addSection}
            </button>
          ) : (
            <button
              onClick={() => setShowNewPageForm(!showNewPageForm)}
              className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-4 py-2 rounded-lg font-medium"
            >
              <FilePlus className="w-5 h-5" />
              {t.createPage}
            </button>
          )}
        </div>
      </div>

      {/* New Page Form */}
      {showNewPageForm && !selectedPage && (
        <div className="bg-[#F9F7F2] rounded-lg p-6">
          <h4 className="font-bold text-[#004D33] mb-4">{t.newPage}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.slug} *</label>
              <input
                type="text"
                value={newPage.slug}
                onChange={(e) => setNewPage({...newPage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                placeholder="ma-nouvelle-page"
              />
              <p className="text-xs text-[#888888] mt-1">Identifiant unique (ex: ma-page, about-us)</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.titleLabel}</label>
              <input
                type="text"
                value={newPage.title}
                onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                placeholder="Ma Nouvelle Page"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreatePage}
              disabled={actionLoading || !newPage.slug.trim()}
              className="flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {actionLoading ? "..." : t.save}
            </button>
            <button
              onClick={() => setShowNewPageForm(false)}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#4A4A4A] px-4 py-2 rounded-lg"
            >
              <X className="w-4 h-4" />
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* New Section Form */}
      {showNewSectionForm && selectedPage && (
        <div className="bg-[#F9F7F2] rounded-lg p-6">
          <h4 className="font-bold text-[#004D33] mb-4">{t.newSection}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.section} *</label>
              <input
                type="text"
                value={newSection.section}
                onChange={(e) => setNewSection({...newSection, section: e.target.value.toLowerCase().replace(/\s+/g, '_')})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                placeholder="introduction, gallery, timeline..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.sectionType}</label>
              <select
                value={newSection.metadata?.type || 'text'}
                onChange={(e) => setNewSection({...newSection, metadata: {...newSection.metadata, type: e.target.value}})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
              >
                <option value="text">Texte</option>
                <option value="list">Liste</option>
                <option value="timeline">Chronologie</option>
                <option value="features">Caractéristiques</option>
                <option value="gallery">Galerie</option>
                <option value="json">JSON personnalisé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.order}</label>
              <input
                type="number"
                value={newSection.order}
                onChange={(e) => setNewSection({...newSection, order: parseInt(e.target.value) || 0})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2 pt-8">
              <input
                type="checkbox"
                id="newSectionActive"
                checked={newSection.active}
                onChange={(e) => setNewSection({...newSection, active: e.target.checked})}
                className="w-5 h-5"
              />
              <label htmlFor="newSectionActive" className="text-sm font-medium text-[#4A4A4A]">{t.active}</label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.contentText} ({t.french})</label>
              <textarea
                value={newSection.content?.fr || ''}
                onChange={(e) => setNewSection({...newSection, content: {...newSection.content, fr: e.target.value}})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                rows={4}
                placeholder="Contenu en français..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.contentText} ({t.english})</label>
              <textarea
                value={newSection.content?.en || ''}
                onChange={(e) => setNewSection({...newSection, content: {...newSection.content, en: e.target.value}})}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                rows={4}
                placeholder="Content in English..."
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddSection}
              disabled={actionLoading || !newSection.section.trim()}
              className="flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {actionLoading ? "..." : t.save}
            </button>
            <button
              onClick={() => setShowNewSectionForm(false)}
              className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#4A4A4A] px-4 py-2 rounded-lg"
            >
              <X className="w-4 h-4" />
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Pages List or Sections List */}
      {!selectedPage ? (
        // Pages Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.length > 0 ? pages.map((page, index) => {
            const sectionsCount = pageContent.filter(c => c.slug === page).length;
            return (
              <button
                key={page}
                onClick={() => setSelectedPage(page)}
                className="p-6 bg-white border rounded-xl hover:shadow-lg hover:border-[#D4AF37] transition-all text-left"
                data-testid={`page-card-${index}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Layers className="w-6 h-6 text-[#004D33]" />
                  <h4 className="font-bold text-[#004D33] capitalize">{page}</h4>
                </div>
                <p className="text-sm text-[#888888]">
                  {sectionsCount} {t.sections}
                </p>
              </button>
            );
          }) : (
            <p className="col-span-full text-center text-[#888888] py-8">{t.noContent}</p>
          )}
        </div>
      ) : (
        // Sections List
        <div className="space-y-4">
          {filteredContent.length > 0 ? filteredContent
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((item, index) => (
              <div key={item.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`content-item-${index}`}>
                {editingItem?.id === item.id ? (
                  <div className="bg-[#F9F7F2] rounded-lg p-6" data-testid="edit-content-form">
                    <h3 className="font-bold text-[#004D33] mb-4">{t.editContent} - {item.slug}/{item.section}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.french}</label>
                        <textarea
                          value={editingItem?.content?.fr || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            content: { ...editingItem.content, fr: e.target.value }
                          })}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.english}</label>
                        <textarea
                          value={editingItem?.content?.en || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            content: { ...editingItem.content, en: e.target.value }
                          })}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.arabic}</label>
                        <textarea
                          value={editingItem?.content?.ar || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            content: { ...editingItem.content, ar: e.target.value }
                          })}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent text-right"
                          dir="rtl"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.wolof}</label>
                        <textarea
                          value={editingItem?.content?.wo || ""}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            content: { ...editingItem.content, wo: e.target.value }
                          })}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="content-active"
                          checked={editingItem?.active || false}
                          onChange={(e) => setEditingItem({...editingItem, active: e.target.checked})}
                          className="w-5 h-5"
                        />
                        <label htmlFor="content-active" className="text-sm font-medium text-[#4A4A4A]">{t.active}</label>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#4A4A4A] mr-2">{t.order}:</label>
                        <input
                          type="number"
                          value={editingItem?.order || 0}
                          onChange={(e) => setEditingItem({...editingItem, order: parseInt(e.target.value)})}
                          className="w-20 border rounded-lg p-2"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleUpdateContent(item.id)}
                        disabled={actionLoading}
                        className="flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        data-testid="save-content-btn"
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
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-[#E8F5E9] text-[#004D33] rounded text-xs font-medium">
                          {item.section}
                        </span>
                        <span className="text-xs text-[#888888]">Order: {item.order || 0}</span>
                      </div>
                      <p className="text-[#4A4A4A] text-sm line-clamp-2">
                        {item.content?.fr || item.content?.en || "No content"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.active ? t.active : t.inactive}
                      </span>
                      <button
                        onClick={() => setEditingItem({...item})}
                        className="p-2 text-[#004D33] hover:bg-[#E8F5E9] rounded-lg transition-colors"
                        title={t.edit}
                        data-testid={`edit-content-${index}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: 'content', id: item.id })}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t.delete}
                        data-testid={`delete-content-${index}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )) : (
              <p className="text-center text-[#888888] py-8">{t.noContent}</p>
            )}
        </div>
      )}
    </div>
  );
};

export default ContentTab;
