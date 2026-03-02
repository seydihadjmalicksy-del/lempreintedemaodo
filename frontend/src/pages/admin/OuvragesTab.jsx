/**
 * Ouvrages Management Tab Component - Full CRUD
 */
import { useState, useEffect } from "react";
import { Book, FileText, Layers, Archive, Trash2, Plus, Edit, Save, X, Loader2, Download } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const OUVRAGE_TYPES = {
  majeurs: { label: "Ouvrages Majeurs", icon: Book, collection: "majeurs" },
  autres: { label: "Autres Écrits", icon: FileText, collection: "autres" },
  bibliotheque: { label: "Bibliothèque Numérique", icon: Layers, collection: "bibliotheque" },
  academiques: { label: "Archives Académiques", icon: Archive, collection: "archives-academiques" }
};

const OuvragesTab = ({ getAuthHeaders }) => {
  const [ouvrages, setOuvrages] = useState({ majeurs: [], autres: [], bibliotheque: [], academiques: [] });
  const [ouvragesStats, setOuvragesStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("majeurs");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getEmptyFormData = (type) => {
    const base = {
      titre: { fr: "", en: "", ar: "" },
      description: { fr: "", en: "" },
      active: true,
      order: 0
    };

    switch (type) {
      case "majeurs":
        return { ...base, auteur: "El Hadji Malick Sy", date: "", sous_titre: "", image: "", lien: "", categorie: "poesie" };
      case "autres":
        return { ...base, auteur: "", date: "", type_ouvrage: "correspondance" };
      case "bibliotheque":
        return { ...base, auteur: "", format: "pdf", lien: "", taille: "", pages: 0 };
      case "academiques":
        return { ...base, auteur: "", institution: "", annee: "", type_document: "these", lien: "" };
      default:
        return base;
    }
  };

  const [formData, setFormData] = useState(getEmptyFormData("majeurs"));

  useEffect(() => {
    fetchAllOuvrages();
  }, []);

  const fetchAllOuvrages = async () => {
    setLoading(true);
    try {
      const [majeursRes, autresRes, biblioRes, academiquesRes, statsRes] = await Promise.all([
        axios.get(`${API}/ouvrages/majeurs`),
        axios.get(`${API}/ouvrages/autres`),
        axios.get(`${API}/ouvrages/bibliotheque`),
        axios.get(`${API}/ouvrages/archives-academiques`),
        axios.get(`${API}/ouvrages/stats`)
      ]);
      setOuvrages({
        majeurs: majeursRes.data || [],
        autres: autresRes.data || [],
        bibliotheque: biblioRes.data || [],
        academiques: academiquesRes.data || []
      });
      setOuvragesStats(statsRes.data || { total: 0 });
    } catch (error) {
      console.error("Error fetching ouvrages:", error);
      toast.error("Erreur lors du chargement des ouvrages");
    } finally {
      setLoading(false);
    }
  };

  const getApiEndpoint = (type) => {
    if (type === "academiques") return "archives-academiques";
    return type;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const endpoint = getApiEndpoint(activeType);
    try {
      if (editingItem) {
        await axios.put(`${API}/ouvrages/${endpoint}/${editingItem.id}`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Ouvrage mis à jour");
      } else {
        await axios.post(`${API}/ouvrages/${endpoint}`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Ouvrage créé");
      }
      resetForm();
      fetchAllOuvrages();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur lors de l'enregistrement");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      titre: item.titre || { fr: "", en: "", ar: "" },
      description: item.description || { fr: "", en: "" },
      active: item.active !== false,
      order: item.order || 0,
      // Type-specific fields
      ...(activeType === "majeurs" && {
        auteur: item.auteur || "El Hadji Malick Sy",
        date: item.date || "",
        sous_titre: item.sous_titre || "",
        image: item.image || "",
        lien: item.lien || "",
        categorie: item.categorie || "poesie"
      }),
      ...(activeType === "autres" && {
        auteur: item.auteur || "",
        date: item.date || "",
        type_ouvrage: item.type_ouvrage || "correspondance"
      }),
      ...(activeType === "bibliotheque" && {
        auteur: item.auteur || "",
        format: item.format || "pdf",
        lien: item.lien || "",
        taille: item.taille || "",
        pages: item.pages || 0
      }),
      ...(activeType === "academiques" && {
        auteur: item.auteur || "",
        institution: item.institution || "",
        annee: item.annee || "",
        type_document: item.type_document || "these",
        lien: item.lien || ""
      })
    });
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Supprimer "${item.titre?.fr || 'cet ouvrage'}" ?`)) return;
    const endpoint = getApiEndpoint(activeType);
    try {
      await axios.delete(`${API}/ouvrages/${endpoint}/${item.id}`, {
        headers: getAuthHeaders()
      });
      toast.success("Ouvrage supprimé");
      fetchAllOuvrages();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
    setFormData(getEmptyFormData(activeType));
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    resetForm();
    setFormData(getEmptyFormData(type));
  };

  const renderTypeSpecificFields = () => {
    switch (activeType) {
      case "majeurs":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                <input
                  type="text"
                  value={formData.auteur}
                  onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="1902"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="poesie">Poésie</option>
                  <option value="prose">Prose</option>
                  <option value="fiqh">Fiqh</option>
                  <option value="tasawwuf">Tasawwuf</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre (Arabe)</label>
              <input
                type="text"
                value={formData.sous_titre}
                onChange={(e) => setFormData({ ...formData, sous_titre: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bismillah-text"
                dir="rtl"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Image</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lien PDF</label>
                <input
                  type="url"
                  value={formData.lien}
                  onChange={(e) => setFormData({ ...formData, lien: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>
          </>
        );

      case "autres":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
              <input
                type="text"
                value={formData.auteur}
                onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type_ouvrage}
                onChange={(e) => setFormData({ ...formData, type_ouvrage: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="correspondance">Correspondance</option>
                <option value="commentaire">Commentaire</option>
                <option value="traduction">Traduction</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>
        );

      case "bibliotheque":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
              <input
                type="text"
                value={formData.auteur}
                onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="pdf">PDF</option>
                <option value="epub">ePub</option>
                <option value="doc">Word</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lien de téléchargement *</label>
              <input
                type="url"
                value={formData.lien}
                onChange={(e) => setFormData({ ...formData, lien: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taille du fichier</label>
              <input
                type="text"
                value={formData.taille}
                onChange={(e) => setFormData({ ...formData, taille: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="2.5 MB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de pages</label>
              <input
                type="number"
                value={formData.pages}
                onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        );

      case "academiques":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
              <input
                type="text"
                value={formData.auteur}
                onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Université Cheikh Anta Diop"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
              <input
                type="text"
                value={formData.annee}
                onChange={(e) => setFormData({ ...formData, annee: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="2020"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de document</label>
              <select
                value={formData.type_document}
                onChange={(e) => setFormData({ ...formData, type_document: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="these">Thèse</option>
                <option value="memoire">Mémoire</option>
                <option value="article">Article</option>
                <option value="ouvrage">Ouvrage</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Lien</label>
              <input
                type="url"
                value={formData.lien}
                onChange={(e) => setFormData({ ...formData, lien: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#004D33]" />
        <p className="mt-2 text-gray-600">Chargement des ouvrages...</p>
      </div>
    );
  }

  const currentItems = ouvrages[activeType] || [];
  const TypeIcon = OUVRAGE_TYPES[activeType]?.icon || Book;

  return (
    <div className="space-y-6" data-testid="ouvrages-tab">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(OUVRAGE_TYPES).map(([key, { label, icon: Icon }]) => (
          <button
            key={key}
            onClick={() => handleTypeChange(key)}
            className={`rounded-lg p-4 transition-all ${
              activeType === key 
                ? "bg-[#004D33] text-white" 
                : "bg-[#E8F5E9] hover:bg-[#004D33] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-6 h-6" />
              <div className="text-left">
                <div className="text-2xl font-bold">{ouvrages[key]?.length || 0}</div>
                <div className="text-xs opacity-80">{label}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#004D33] flex items-center gap-2">
          <TypeIcon className="w-6 h-6" />
          {OUVRAGE_TYPES[activeType]?.label} ({currentItems.length})
        </h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#004D33] rounded-lg hover:bg-[#b8952e] font-medium"
          data-testid="add-ouvrage-btn"
        >
          <Plus className="w-5 h-5" />
          Ajouter
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#D4AF37]" data-testid="ouvrage-form">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#004D33]">
              {editingItem ? "Modifier" : "Ajouter"} - {OUVRAGE_TYPES[activeType]?.label}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common fields: Title */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR) *</label>
                <input
                  type="text"
                  value={formData.titre?.fr || ""}
                  onChange={(e) => setFormData({ ...formData, titre: { ...formData.titre, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  required
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
                  className="w-full px-4 py-2 border rounded-lg bismillah-text"
                  dir="rtl"
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
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
                <textarea
                  value={formData.description?.en || ""}
                  onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg h-20"
                />
              </div>
            </div>

            {/* Type-specific fields */}
            {renderTypeSpecificFields()}

            {/* Options */}
            <div className="flex gap-6 items-center">
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

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t">
              <button
                type="submit"
                disabled={actionLoading}
                className="flex items-center gap-2 px-6 py-2 bg-[#004D33] text-white rounded-lg hover:bg-[#003d29] disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {editingItem ? "Mettre à jour" : "Créer"}
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

      {/* Items List */}
      <div className="space-y-3">
        {currentItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <TypeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun ouvrage. Cliquez sur "Ajouter" pour commencer.</p>
          </div>
        ) : (
          currentItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg p-4 shadow-md flex items-center justify-between border-l-4 ${
                item.active !== false ? "border-[#004D33]" : "border-gray-300"
              }`}
              data-testid={`ouvrage-item-${item.id}`}
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.titre?.fr} 
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#004D33] truncate">{item.titre?.fr || "Sans titre"}</h4>
                  {item.sous_titre && (
                    <p className="text-sm text-[#D4AF37] bismillah-text truncate">{item.sous_titre}</p>
                  )}
                  <p className="text-sm text-gray-500 truncate">
                    {item.auteur || ""} {item.date ? `- ${item.date}` : ""} {item.annee ? `(${item.annee})` : ""}
                  </p>
                  <div className="flex gap-2 mt-1 text-xs text-gray-400">
                    {item.categorie && <span className="capitalize">{item.categorie}</span>}
                    {item.type_ouvrage && <span className="capitalize">{item.type_ouvrage}</span>}
                    {item.type_document && <span className="capitalize">{item.type_document}</span>}
                    {item.institution && <span>• {item.institution}</span>}
                    {item.format && <span className="uppercase">• {item.format}</span>}
                    {item.pages > 0 && <span>• {item.pages} pages</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {item.lien && (
                  <a
                    href={item.lien}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Télécharger"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                )}
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Modifier"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Supprimer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OuvragesTab;
