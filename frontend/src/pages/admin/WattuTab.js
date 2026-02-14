import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, StarOff, Save, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WattuTab = ({ getAuthHeaders, onDelete }) => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titre: { fr: "", en: "", ar: "", wo: "" },
    contenu: { fr: "", en: "", ar: "", wo: "" },
    auteur: "",
    image: "",
    categorie: "general",
    tags: [],
    active: true,
    featured: false
  });

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${API}/wattu/admin/articles`, {
        headers: getAuthHeaders()
      });
      setArticles(response.data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/wattu/categories`);
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await axios.put(`${API}/wattu/admin/articles/${editingArticle.id}`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Article mis à jour");
      } else {
        await axios.post(`${API}/wattu/admin/articles`, formData, {
          headers: getAuthHeaders()
        });
        toast.success("Article créé");
      }
      resetForm();
      fetchArticles();
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      titre: article.titre || { fr: "", en: "", ar: "", wo: "" },
      contenu: article.contenu || { fr: "", en: "", ar: "", wo: "" },
      auteur: article.auteur || "",
      image: article.image || "",
      categorie: article.categorie || "general",
      tags: article.tags || [],
      active: article.active !== false,
      featured: article.featured || false
    });
    setShowForm(true);
  };

  const handleToggleActive = async (article) => {
    try {
      await axios.put(`${API}/wattu/admin/articles/${article.id}`, 
        { active: !article.active },
        { headers: getAuthHeaders() }
      );
      toast.success(article.active ? "Article désactivé" : "Article activé");
      fetchArticles();
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const handleToggleFeatured = async (article) => {
    try {
      await axios.put(`${API}/wattu/admin/articles/${article.id}`, 
        { featured: !article.featured },
        { headers: getAuthHeaders() }
      );
      toast.success(article.featured ? "Retiré des favoris" : "Ajouté aux favoris");
      fetchArticles();
    } catch (error) {
      toast.error("Erreur");
    }
  };

  const resetForm = () => {
    setEditingArticle(null);
    setShowForm(false);
    setFormData({
      titre: { fr: "", en: "", ar: "", wo: "" },
      contenu: { fr: "", en: "", ar: "", wo: "" },
      auteur: "",
      image: "",
      categorie: "general",
      tags: [],
      active: true,
      featured: false
    });
  };

  const handleTagsChange = (value) => {
    const tags = value.split(",").map(t => t.trim()).filter(t => t);
    setFormData({ ...formData, tags });
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#004D33]">
          Wattu - Opinions ({articles.length})
        </h2>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#004D33] text-white rounded-lg hover:bg-[#003d29]"
        >
          <Plus className="w-5 h-5" />
          Nouvel Article
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-[#D4AF37]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#004D33]">
              {editingArticle ? "Modifier l'article" : "Nouvel article"}
            </h3>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Titre multilingue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (FR) *</label>
                <input
                  type="text"
                  value={formData.titre.fr}
                  onChange={(e) => setFormData({ ...formData, titre: { ...formData.titre, fr: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (EN)</label>
                <input
                  type="text"
                  value={formData.titre.en}
                  onChange={(e) => setFormData({ ...formData, titre: { ...formData.titre, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (AR)</label>
                <input
                  type="text"
                  value={formData.titre.ar}
                  onChange={(e) => setFormData({ ...formData, titre: { ...formData.titre, ar: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre (WO)</label>
                <input
                  type="text"
                  value={formData.titre.wo}
                  onChange={(e) => setFormData({ ...formData, titre: { ...formData.titre, wo: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                />
              </div>
            </div>

            {/* Contenu FR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (FR) *</label>
              <textarea
                value={formData.contenu.fr}
                onChange={(e) => setFormData({ ...formData, contenu: { ...formData.contenu, fr: e.target.value } })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33] h-40"
                required
              />
            </div>

            {/* Contenu autres langues */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (EN)</label>
                <textarea
                  value={formData.contenu.en}
                  onChange={(e) => setFormData({ ...formData, contenu: { ...formData.contenu, en: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33] h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (AR)</label>
                <textarea
                  value={formData.contenu.ar}
                  onChange={(e) => setFormData({ ...formData, contenu: { ...formData.contenu, ar: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33] h-24"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (WO)</label>
                <textarea
                  value={formData.contenu.wo}
                  onChange={(e) => setFormData({ ...formData, contenu: { ...formData.contenu, wo: e.target.value } })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33] h-24"
                />
              </div>
            </div>

            {/* Métadonnées */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                <input
                  type="text"
                  value={formData.auteur}
                  onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label.fr}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
              <input
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004D33]"
                placeholder="spiritualité, tijaniyya, éducation"
              />
            </div>

            {/* Options */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-[#004D33]"
                />
                <span>Actif (visible sur le site)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-[#D4AF37]"
                />
                <span>Mis en avant</span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-[#004D33] text-white rounded-lg hover:bg-[#003d29]"
              >
                <Save className="w-5 h-5" />
                {editingArticle ? "Mettre à jour" : "Créer l'article"}
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

      {/* Articles List */}
      <div className="grid gap-4">
        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">Aucun article. Créez le premier !</p>
          </div>
        ) : (
          articles.map((article) => (
            <div
              key={article.id}
              className={`bg-white rounded-xl p-6 shadow-md border-l-4 ${
                article.active ? "border-[#004D33]" : "border-gray-300"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-[#004D33]">
                      {article.titre?.fr || "Sans titre"}
                    </h4>
                    {article.featured && (
                      <Star className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                    )}
                    {!article.active && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                        Inactif
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {article.contenu?.fr?.substring(0, 200)}...
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-[#E8F5E9] text-[#004D33] rounded">
                      {categories.find(c => c.id === article.categorie)?.label?.fr || article.categorie}
                    </span>
                    {article.auteur && <span>Par {article.auteur}</span>}
                    <span>{new Date(article.date_publication).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleToggleFeatured(article)}
                    className={`p-2 rounded-lg ${article.featured ? "text-[#D4AF37]" : "text-gray-400"} hover:bg-gray-100`}
                    title={article.featured ? "Retirer des favoris" : "Mettre en avant"}
                  >
                    {article.featured ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleToggleActive(article)}
                    className={`p-2 rounded-lg ${article.active ? "text-green-600" : "text-gray-400"} hover:bg-gray-100`}
                    title={article.active ? "Désactiver" : "Activer"}
                  >
                    {article.active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleEdit(article)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Modifier"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete({ type: 'wattu_article', id: article.id })}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Supprimer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WattuTab;
