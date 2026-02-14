import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, ChevronDown, ChevronUp, FileText, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DynamicPagesTab = ({ getAuthHeaders, onDelete }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedPage, setExpandedPage] = useState(null);
  const [formData, setFormData] = useState({
    slug: "",
    titre: { fr: "", en: "", ar: "" },
    description: { fr: "", en: "" },
    hero_image: "",
    hero_icon: "",
    parent_menu: "",
    menu_order: 0,
    active: true,
    show_in_menu: true,
    sections: []
  });

  const parentMenuOptions = [
    { value: "", label: "Aucun (page autonome)" },
    { value: "histoire", label: "Histoire" },
    { value: "enseignements", label: "Enseignements" },
    { value: "evenements", label: "Événements" }
  ];

  const sectionTypes = [
    { value: "text", label: "Texte" },
    { value: "image", label: "Image" },
    { value: "quote", label: "Citation" },
    { value: "video", label: "Vidéo" },
    { value: "cards", label: "Cartes" },
    { value: "timeline", label: "Chronologie" }
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get(`${API}/dynamic-pages/admin/all`, {
        headers: getAuthHeaders()
      });
      setPages(response.data?.pages || []);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast.error("Erreur lors du chargement des pages");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedDefaults = async () => {
    try {
      const response = await axios.post(`${API}/dynamic-pages/admin/seed-defaults`, {}, {
        headers: getAuthHeaders()
      });
      toast.success(response.data.message);
      fetchPages();
    } catch (error) {
      toast.error("Erreur lors de la création des pages par défaut");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPage) {
        await axios.put(`${API}/dynamic-pages/admin/${editingPage.id}`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Page mise à jour");
      } else {
        await axios.post(`${API}/dynamic-pages/admin`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Page créée");
      }
      resetForm();
      fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug || "",
      titre: page.titre || { fr: "", en: "", ar: "" },
      description: page.description || { fr: "", en: "" },
      hero_image: page.hero_image || "",
      hero_icon: page.hero_icon || "",
      parent_menu: page.parent_menu || "",
      menu_order: page.menu_order || 0,
      active: page.active !== false,
      show_in_menu: page.show_in_menu !== false,
      sections: page.sections || []
    });
    setShowForm(true);
  };

  const handleToggleActive = async (page) => {
    try {
      await axios.put(`${API}/dynamic-pages/admin/${page.id}`, 
        { active: !page.active },
        { headers: getAuthHeaders() }
      );
      toast.success(page.active ? "Page désactivée" : "Page activée");
      fetchPages();
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const handleDeletePage = async (page) => {
    if (!window.confirm(`Supprimer la page "${page.titre?.fr || page.slug}" ?`)) return;
    try {
      await axios.delete(`${API}/dynamic-pages/admin/${page.id}`, {
        headers: getAuthHeaders()
      });
      toast.success("Page supprimée");
      fetchPages();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setEditingPage(null);
    setShowForm(false);
    setFormData({
      slug: "",
      titre: { fr: "", en: "", ar: "" },
      description: { fr: "", en: "" },
      hero_image: "",
      hero_icon: "",
      parent_menu: "",
      menu_order: 0,
      active: true,
      show_in_menu: true,
      sections: []
    });
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, {
        type: "text",
        titre: { fr: "", en: "" },
        contenu: { fr: "", en: "" },
        image: "",
        order: formData.sections.length,
        visible: true
      }]
    });
  };

  const updateSection = (index, field, value) => {
    const newSections = [...formData.sections];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newSections[index][parent] = { ...newSections[index][parent], [child]: value };
    } else {
      newSections[index][field] = value;
    }
    setFormData({ ...formData, sections: newSections });
  };

  const removeSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#004D33]" />
        <p className="mt-2 text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-[#004D33]">
          Pages Dynamiques ({pages.length})
        </h2>
        <div className="flex gap-3">
          <button
            onClick={handleSeedDefaults}
            className="px-4 py-2 border border-[#004D33] text-[#004D33] rounded-lg hover:bg-[#E8F5E9]"
          >
            Créer pages par défaut
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-[#004D33] text-white rounded-lg hover:bg-[#003d29]"
          >
            <Plus className="w-5 h-5" />
            Nouvelle Page
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#D4AF37]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#004D33]">
              {editingPage ? "Modifier la page" : "Nouvelle page"}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL) *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  placeholder="histoire/origines"
                  required
                  disabled={!!editingPage}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Parent</label>
                <select
                  value={formData.parent_menu}
                  onChange={(e) => setFormData({ ...formData, parent_menu: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                >
                  {parentMenuOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR) *</label>
                <input
                  type="text"
                  value={formData.titre.fr}
                  onChange={(e) => setFormData({ ...formData, titre: { ...formData.titre, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (EN)</label>
                <input
                  type="text"
                  value={formData.titre.en}
                  onChange={(e) => setFormData({ ...formData, titre: { ...formData.titre, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (AR)</label>
                <input
                  type="text"
                  value={formData.titre.ar}
                  onChange={(e) => setFormData({ ...formData, titre: { ...formData.titre, ar: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg"
                  dir="rtl"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
                <textarea
                  value={formData.description.fr}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                <textarea
                  value={formData.description.en}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Page active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.show_in_menu}
                  onChange={(e) => setFormData({ ...formData, show_in_menu: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Afficher dans le menu</span>
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm">Ordre:</label>
                <input
                  type="number"
                  value={formData.menu_order}
                  onChange={(e) => setFormData({ ...formData, menu_order: parseInt(e.target.value) || 0 })}
                  className="w-20 px-2 py-1 border rounded"
                />
              </div>
            </div>

            {/* Sections */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-[#004D33]">Sections de contenu</h4>
                <button
                  type="button"
                  onClick={addSection}
                  className="flex items-center gap-1 px-3 py-1 bg-[#E8F5E9] text-[#004D33] rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" /> Ajouter section
                </button>
              </div>

              {formData.sections.map((section, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-600">Section {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                      value={section.type}
                      onChange={(e) => updateSection(index, 'type', e.target.value)}
                      className="px-3 py-2 border rounded"
                    >
                      {sectionTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={section.titre?.fr || ''}
                      onChange={(e) => updateSection(index, 'titre.fr', e.target.value)}
                      placeholder="Titre section (FR)"
                      className="px-3 py-2 border rounded"
                    />
                    <input
                      type="text"
                      value={section.image || ''}
                      onChange={(e) => updateSection(index, 'image', e.target.value)}
                      placeholder="URL image"
                      className="px-3 py-2 border rounded"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={section.visible !== false}
                        onChange={(e) => updateSection(index, 'visible', e.target.checked)}
                      />
                      Visible
                    </label>
                  </div>
                  <textarea
                    value={section.contenu?.fr || ''}
                    onChange={(e) => updateSection(index, 'contenu.fr', e.target.value)}
                    placeholder="Contenu (FR)"
                    className="w-full mt-3 px-3 py-2 border rounded h-24"
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-[#004D33] text-white rounded-lg hover:bg-[#003d29]"
              >
                <Save className="w-5 h-5" />
                {editingPage ? "Mettre à jour" : "Créer la page"}
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

      {/* Pages List */}
      <div className="space-y-3">
        {pages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune page. Cliquez sur "Créer pages par défaut" pour commencer.</p>
          </div>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
                page.active ? "border-[#004D33]" : "border-gray-300"
              }`}
            >
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedPage(expandedPage === page.id ? null : page.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-bold text-[#004D33]">{page.titre?.fr || page.slug}</h4>
                    <p className="text-sm text-gray-500">/{page.slug}</p>
                  </div>
                  {page.parent_menu && (
                    <span className="px-2 py-1 bg-[#E8F5E9] text-[#004D33] text-xs rounded">
                      {page.parent_menu}
                    </span>
                  )}
                  {!page.active && (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                      Inactif
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{page.sections?.length || 0} sections</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleActive(page); }}
                    className={`p-2 rounded-lg ${page.active ? "text-green-600" : "text-gray-400"} hover:bg-gray-100`}
                  >
                    {page.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(page); }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletePage(page); }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {expandedPage === page.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
              
              {expandedPage === page.id && (
                <div className="px-4 pb-4 border-t bg-gray-50">
                  <p className="py-3 text-sm text-gray-600">{page.description?.fr || "Pas de description"}</p>
                  {page.sections?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Sections:</p>
                      {page.sections.map((section, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 pl-4">
                          <span className="w-2 h-2 bg-[#D4AF37] rounded-full"></span>
                          {section.type}: {section.titre?.fr || "(sans titre)"}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DynamicPagesTab;
