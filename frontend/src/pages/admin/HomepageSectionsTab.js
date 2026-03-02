/**
 * Homepage Sections Tab - Full CRUD for homepage sections
 * Manages dynamic sections: Wattu, Donations, Custom sections
 */
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, GripVertical, Home, Loader2, RefreshCw } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SECTION_TYPES = [
  { value: "wattu_promo", label: "Section Wattu", description: "Promotion de la page Wattu avec bouton de lien" },
  { value: "donations", label: "Section Dons (Hadiya)", description: "Section pour les dons avec méthodes de paiement" },
  { value: "custom", label: "Section Personnalisée", description: "Section libre avec titre et description" },
  { value: "quote", label: "Citation", description: "Citation spirituelle mise en avant" },
  { value: "cta", label: "Appel à l'action", description: "Bouton avec lien vers une page" }
];

const BACKGROUND_STYLES = [
  { value: "green", label: "Vert (Couleur principale)" },
  { value: "gold", label: "Or (Couleur accent)" },
  { value: "white", label: "Blanc" },
  { value: "gradient", label: "Dégradé vert-or" }
];

const HomepageSectionsTab = ({ getAuthHeaders }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const getEmptyFormData = () => ({
    section_type: "custom",
    title_fr: "",
    title_en: "",
    title_ar: "",
    title_wo: "",
    description_fr: "",
    description_en: "",
    description_ar: "",
    description_wo: "",
    is_active: true,
    display_order: sections.length + 1,
    background_style: "white",
    // Donations specific
    payment_label: "Wave / Orange Money",
    payment_value: "",
    quote_fr: "",
    // Wattu/CTA specific
    button_text_fr: "",
    button_text_en: "",
    link: ""
  });
  
  const [formData, setFormData] = useState(getEmptyFormData());

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/homepage-sections/admin/all`, {
        headers: getAuthHeaders()
      });
      setSections(response.data || []);
    } catch (error) {
      console.error("Error fetching homepage sections:", error);
      toast.error("Erreur lors du chargement des sections");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section.id);
    setShowAddForm(false);
    setFormData({
      section_type: section.section_type,
      title_fr: section.title?.fr || "",
      title_en: section.title?.en || "",
      title_ar: section.title?.ar || "",
      title_wo: section.title?.wo || "",
      description_fr: section.description?.fr || "",
      description_en: section.description?.en || "",
      description_ar: section.description?.ar || "",
      description_wo: section.description?.wo || "",
      is_active: section.is_active,
      display_order: section.display_order,
      background_style: section.background_style || "white",
      // Donations specific
      payment_label: section.content?.payment_methods?.[0]?.label || "Wave / Orange Money",
      payment_value: section.content?.payment_methods?.[0]?.value || "",
      quote_fr: section.content?.quote?.fr || "",
      // Wattu/CTA specific
      button_text_fr: section.content?.button_text?.fr || "",
      button_text_en: section.content?.button_text?.en || "",
      link: section.content?.link || ""
    });
  };

  const handleAdd = () => {
    setEditingSection(null);
    setShowAddForm(true);
    setFormData({
      ...getEmptyFormData(),
      display_order: sections.length + 1
    });
  };

  const buildSectionData = () => {
    const data = {
      section_type: formData.section_type,
      title: {
        fr: formData.title_fr,
        en: formData.title_en || formData.title_fr,
        ar: formData.title_ar,
        wo: formData.title_wo
      },
      description: {
        fr: formData.description_fr,
        en: formData.description_en || formData.description_fr,
        ar: formData.description_ar,
        wo: formData.description_wo
      },
      is_active: formData.is_active,
      display_order: formData.display_order,
      background_style: formData.background_style
    };

    // Build content based on section type
    if (formData.section_type === "donations") {
      data.content = {
        how_to_donate_title: {
          fr: "Comment faire un don",
          en: "How to Donate",
          ar: "كيفية التبرع",
          wo: "Nan ngay jox"
        },
        payment_methods: [
          {
            type: "mobile_money",
            label: formData.payment_label,
            value: formData.payment_value
          }
        ],
        quote: {
          fr: formData.quote_fr,
          en: formData.quote_fr,
          ar: "",
          wo: ""
        }
      };
    } else if (formData.section_type === "wattu_promo" || formData.section_type === "cta") {
      data.content = {
        button_text: {
          fr: formData.button_text_fr,
          en: formData.button_text_en || formData.button_text_fr,
          ar: "",
          wo: ""
        },
        link: formData.link
      };
    } else if (formData.section_type === "quote") {
      data.content = {
        quote: {
          fr: formData.quote_fr,
          en: formData.quote_fr,
          ar: "",
          wo: ""
        }
      };
    }

    return data;
  };

  const handleSave = async (sectionId = null) => {
    setActionLoading(true);
    try {
      const sectionData = buildSectionData();

      if (sectionId) {
        // Update existing
        await axios.put(`${API}/homepage-sections/admin/${sectionId}`, sectionData, {
          headers: getAuthHeaders()
        });
        toast.success("Section mise à jour");
      } else {
        // Create new
        await axios.post(`${API}/homepage-sections/admin`, sectionData, {
          headers: getAuthHeaders()
        });
        toast.success("Section créée");
      }
      
      setEditingSection(null);
      setShowAddForm(false);
      fetchSections();
    } catch (error) {
      console.error("Error saving section:", error.response?.data);
      toast.error(error.response?.data?.detail || "Erreur lors de l'enregistrement");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleActive = async (section) => {
    try {
      await axios.put(`${API}/homepage-sections/admin/${section.id}`, {
        is_active: !section.is_active
      }, {
        headers: getAuthHeaders()
      });
      toast.success(section.is_active ? "Section désactivée" : "Section activée");
      fetchSections();
    } catch (error) {
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDelete = async (sectionId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette section ?")) return;
    
    try {
      await axios.delete(`${API}/homepage-sections/admin/${sectionId}`, {
        headers: getAuthHeaders()
      });
      toast.success("Section supprimée");
      fetchSections();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm("Réinitialiser toutes les sections aux valeurs par défaut ? Cette action supprimera les sections personnalisées.")) return;
    
    try {
      await axios.post(`${API}/homepage-sections/admin/reset-defaults`, {}, {
        headers: getAuthHeaders()
      });
      toast.success("Sections réinitialisées");
      fetchSections();
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation");
    }
  };

  const cancelForm = () => {
    setEditingSection(null);
    setShowAddForm(false);
    setFormData(getEmptyFormData());
  };

  const getSectionTypeName = (type) => {
    const found = SECTION_TYPES.find(t => t.value === type);
    return found ? found.label : type;
  };

  const renderForm = (isNew = false, sectionId = null) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#D4AF37] mb-6" data-testid="section-form">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#004D33]">
          {isNew ? "Ajouter une section" : "Modifier la section"}
        </h3>
        <button onClick={cancelForm} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Section Type */}
        {isNew && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de section *</label>
            <select
              value={formData.section_type}
              onChange={(e) => setFormData({ ...formData, section_type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
            >
              {SECTION_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label} - {type.description}</option>
              ))}
            </select>
          </div>
        )}

        {/* Title multilingual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR) *</label>
            <input
              type="text"
              value={formData.title_fr}
              onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre (EN)</label>
            <input
              type="text"
              value={formData.title_en}
              onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={formData.title_fr || "Reprendra le titre FR si vide"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre (AR)</label>
            <input
              type="text"
              value={formData.title_ar}
              onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre (Wolof)</label>
            <input
              type="text"
              value={formData.title_wo}
              onChange={(e) => setFormData({ ...formData, title_wo: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
            <textarea
              value={formData.description_fr}
              onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
            <textarea
              value={formData.description_en}
              onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg h-24"
              placeholder={formData.description_fr ? "Reprendra la description FR si vide" : ""}
            />
          </div>
        </div>

        {/* Type-specific fields */}
        {formData.section_type === "donations" && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-[#004D33] mb-3">Paramètres des dons</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
                <input
                  type="text"
                  value={formData.payment_label}
                  onChange={(e) => setFormData({ ...formData, payment_label: e.target.value })}
                  placeholder="Wave / Orange Money"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone *</label>
                <input
                  type="text"
                  value={formData.payment_value}
                  onChange={(e) => setFormData({ ...formData, payment_value: e.target.value })}
                  placeholder="77 338 90 95"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Citation</label>
                <input
                  type="text"
                  value={formData.quote_fr}
                  onChange={(e) => setFormData({ ...formData, quote_fr: e.target.value })}
                  placeholder={'"Les meilleurs des gens sont ceux qui sont les plus bénéfiques pour les autres." - Hadith'}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {(formData.section_type === "wattu_promo" || formData.section_type === "cta") && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-[#004D33] mb-3">Bouton d'action</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton (FR) *</label>
                <input
                  type="text"
                  value={formData.button_text_fr}
                  onChange={(e) => setFormData({ ...formData, button_text_fr: e.target.value })}
                  placeholder="Accéder à Wattu"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton (EN)</label>
                <input
                  type="text"
                  value={formData.button_text_en}
                  onChange={(e) => setFormData({ ...formData, button_text_en: e.target.value })}
                  placeholder="Access Wattu"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lien *</label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/wattu"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {formData.section_type === "quote" && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-[#004D33] mb-3">Citation</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texte de la citation *</label>
              <textarea
                value={formData.quote_fr}
                onChange={(e) => setFormData({ ...formData, quote_fr: e.target.value })}
                placeholder={'"Les meilleurs des gens sont ceux qui sont les plus bénéfiques pour les autres." - Hadith'}
                className="w-full px-4 py-2 border rounded-lg h-24"
                required
              />
            </div>
          </div>
        )}

        {/* Display options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Style de fond</label>
            <select
              value={formData.background_style}
              onChange={(e) => setFormData({ ...formData, background_style: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {BACKGROUND_STYLES.map(style => (
                <option key={style.value} value={style.value}>{style.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Section active</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => handleSave(isNew ? null : sectionId)}
            disabled={actionLoading}
            className="flex items-center gap-2 px-6 py-2 bg-[#004D33] text-white rounded-lg hover:bg-[#003d29] disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isNew ? "Créer" : "Mettre à jour"}
          </button>
          <button
            type="button"
            onClick={cancelForm}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#004D33]" />
        <p className="mt-2 text-gray-600">Chargement des sections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="homepage-sections-tab">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Home className="w-6 h-6 text-[#004D33]" />
          <h2 className="text-xl font-bold text-[#004D33]">
            Sections Page d'Accueil ({sections.length})
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            title="Réinitialiser aux valeurs par défaut"
          >
            <RefreshCw className="w-4 h-4" />
            Réinitialiser
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#004D33] rounded-lg hover:bg-[#b8952e] font-medium"
            data-testid="add-section-btn"
          >
            <Plus className="w-5 h-5" />
            Ajouter une section
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Gérez les sections dynamiques de la page d'accueil : Wattu, Dons, Citations, etc.
      </p>

      {/* Add Form */}
      {showAddForm && renderForm(true)}

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((section) => (
          <div 
            key={section.id}
            className={`border rounded-lg overflow-hidden ${
              section.is_active ? 'border-[#004D33] bg-white' : 'border-gray-300 bg-gray-50'
            }`}
            data-testid={`section-${section.id}`}
          >
            {editingSection === section.id ? (
              renderForm(false, section.id)
            ) : (
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      section.background_style === 'green' ? 'bg-[#004D33]' :
                      section.background_style === 'gold' ? 'bg-[#D4AF37]' :
                      section.background_style === 'gradient' ? 'bg-gradient-to-r from-[#004D33] to-[#D4AF37]' :
                      'bg-gray-300'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#004D33]">{getSectionTypeName(section.section_type)}</span>
                      <span className="text-xs text-gray-400">#{section.display_order}</span>
                      {!section.is_active && (
                        <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">Désactivée</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{section.title?.fr}</p>
                    {section.section_type === "donations" && section.content?.payment_methods?.[0] && (
                      <p className="text-sm text-[#D4AF37] font-medium">
                        📱 {section.content.payment_methods[0].value}
                      </p>
                    )}
                    {(section.section_type === "wattu_promo" || section.section_type === "cta") && section.content?.link && (
                      <p className="text-sm text-blue-600">
                        🔗 {section.content.link}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(section)}
                    className={`p-2 rounded ${section.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                    title={section.is_active ? "Désactiver" : "Activer"}
                  >
                    {section.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleEdit(section)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Modifier"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Aucune section configurée</p>
          <button
            onClick={handleResetDefaults}
            className="text-[#004D33] hover:underline"
          >
            Cliquez ici pour créer les sections par défaut
          </button>
        </div>
      )}
    </div>
  );
};

export default HomepageSectionsTab;
