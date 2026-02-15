import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff, GripVertical } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomepageSectionsTab = ({ getAuthHeaders, onDelete }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState(null);
  const [editForm, setEditForm] = useState({});

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
    setEditForm({
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
      // For donations section
      payment_label: section.content?.payment_methods?.[0]?.label || "",
      payment_value: section.content?.payment_methods?.[0]?.value || "",
      quote_fr: section.content?.quote?.fr || "",
      // For wattu section
      button_text_fr: section.content?.button_text?.fr || "",
      link: section.content?.link || ""
    });
  };

  const handleSave = async (sectionId) => {
    try {
      const section = sections.find(s => s.id === sectionId);
      
      const updateData = {
        title: {
          fr: editForm.title_fr,
          en: editForm.title_en,
          ar: editForm.title_ar,
          wo: editForm.title_wo
        },
        description: {
          fr: editForm.description_fr,
          en: editForm.description_en,
          ar: editForm.description_ar,
          wo: editForm.description_wo
        },
        is_active: editForm.is_active,
        display_order: editForm.display_order
      };

      // Handle section-specific content
      if (section.section_type === "donations") {
        updateData.content = {
          ...section.content,
          payment_methods: [
            {
              type: "mobile_money",
              label: editForm.payment_label,
              value: editForm.payment_value
            }
          ],
          quote: {
            ...section.content?.quote,
            fr: editForm.quote_fr
          }
        };
      } else if (section.section_type === "wattu_promo") {
        updateData.content = {
          ...section.content,
          button_text: {
            ...section.content?.button_text,
            fr: editForm.button_text_fr
          },
          link: editForm.link
        };
      }

      await axios.put(`${API}/homepage-sections/admin/${sectionId}`, updateData, {
        headers: getAuthHeaders()
      });

      toast.success("Section mise à jour");
      setEditingSection(null);
      fetchSections();
    } catch (error) {
      console.error("Error updating section:", error);
      toast.error("Erreur lors de la mise à jour");
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

  const getSectionTypeName = (type) => {
    switch(type) {
      case "wattu_promo": return "Section Wattu";
      case "donations": return "Section Dons (Hadiya)";
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#004D33]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#004D33]">
          Sections Page d'Accueil ({sections.length})
        </h2>
      </div>

      <p className="text-sm text-gray-600">
        Gérez les sections dynamiques de la page d'accueil (Wattu, Dons, etc.)
      </p>

      <div className="space-y-4">
        {sections.map((section) => (
          <div 
            key={section.id}
            className={`border rounded-lg p-4 ${section.is_active ? 'border-[#004D33] bg-white' : 'border-gray-300 bg-gray-50'}`}
          >
            {editingSection === section.id ? (
              // Edit Mode
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#004D33]">{getSectionTypeName(section.section_type)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(section.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-[#004D33] text-white rounded hover:bg-[#003d29]"
                    >
                      <Save className="w-4 h-4" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setEditingSection(null)}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR)</label>
                    <input
                      type="text"
                      value={editForm.title_fr}
                      onChange={(e) => setEditForm({...editForm, title_fr: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Titre (EN)</label>
                    <input
                      type="text"
                      value={editForm.title_en}
                      onChange={(e) => setEditForm({...editForm, title_en: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (FR)</label>
                  <textarea
                    value={editForm.description_fr}
                    onChange={(e) => setEditForm({...editForm, description_fr: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                    rows={3}
                  />
                </div>

                {/* Section-specific fields */}
                {section.section_type === "donations" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement</label>
                        <input
                          type="text"
                          value={editForm.payment_label}
                          onChange={(e) => setEditForm({...editForm, payment_label: e.target.value})}
                          placeholder="Wave / Orange Money"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
                        <input
                          type="text"
                          value={editForm.payment_value}
                          onChange={(e) => setEditForm({...editForm, payment_value: e.target.value})}
                          placeholder="77 338 90 95"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Citation</label>
                      <input
                        type="text"
                        value={editForm.quote_fr}
                        onChange={(e) => setEditForm({...editForm, quote_fr: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                      />
                    </div>
                  </>
                )}

                {section.section_type === "wattu_promo" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Texte du bouton</label>
                      <input
                        type="text"
                        value={editForm.button_text_fr}
                        onChange={(e) => setEditForm({...editForm, button_text_fr: e.target.value})}
                        placeholder="Accéder à Wattu"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lien</label>
                      <input
                        type="text"
                        value={editForm.link}
                        onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                        placeholder="/wattu"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                      />
                    </div>
                  </div>
                )}

                {/* Display Order */}
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={editForm.display_order}
                    onChange={(e) => setEditForm({...editForm, display_order: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  />
                </div>
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#004D33]">{getSectionTypeName(section.section_type)}</span>
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
        <div className="text-center py-8 text-gray-500">
          Aucune section configurée
        </div>
      )}
    </div>
  );
};

export default HomepageSectionsTab;
