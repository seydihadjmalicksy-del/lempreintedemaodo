import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Quote, Calendar, Video, Users, Plus, Trash2, Edit2, Save, X, RefreshCw, LogOut, AlertTriangle, FileText, FilePlus, Layers } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPanel = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("quotes");
  const [quotes, setQuotes] = useState([]);
  const [events, setEvents] = useState([]);
  const [pageContent, setPageContent] = useState([]);
  const [pages, setPages] = useState([]);
  const [khalifes, setKhalifes] = useState([]);
  const [stats, setStats] = useState({ newsletter: 0, contact: 0, videos: 0 });
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [showNewSectionForm, setShowNewSectionForm] = useState(false);

  // New item forms
  const [newQuote, setNewQuote] = useState({
    text_fr: "", text_en: "", text_ar: "", text_wo: "",
    author: "El Hadji Malick Sy", context_fr: "", context_en: "", active: true, order: 0
  });

  const [newEvent, setNewEvent] = useState({
    name_fr: "", name_en: "", name_ar: "", name_wo: "",
    description_fr: "", description_en: "", description_ar: "", description_wo: "",
    date: "", location: "Tivaouane", event_type: "gamou", recurring: false, recurrence_pattern: "", active: true
  });

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

  // New page/section form
  const [newPage, setNewPage] = useState({ slug: "", title: "" });
  const [newSection, setNewSection] = useState({
    slug: "",
    section: "",
    content: { fr: "", en: "", ar: "", wo: "" },
    metadata: { type: "text" },
    order: 0,
    active: true
  });

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("adminToken");
    const expires = localStorage.getItem("adminExpires");
    
    if (!token || !expires) {
      navigate("/admin/login");
      return;
    }
    
    if (new Date(expires) < new Date()) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminExpires");
      localStorage.removeItem("adminUsername");
      navigate("/admin/login");
      return;
    }
    
    try {
      await axios.get(`${API}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminExpires");
      localStorage.removeItem("adminUsername");
      navigate("/admin/login");
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.post(`${API}/admin/logout`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {}
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminExpires");
    localStorage.removeItem("adminUsername");
    toast.success(language === 'en' ? "Logged out successfully" : "Déconnexion réussie");
    navigate("/admin/login");
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return { Authorization: `Bearer ${token}` };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [quotesRes, eventsRes, newsletterRes, contactRes, videosRes, contentRes, khalifesRes] = await Promise.all([
        axios.get(`${API}/quotes?active_only=false`),
        axios.get(`${API}/events?upcoming_only=false`),
        axios.get(`${API}/newsletter/subscribers`).catch(() => ({ data: { total_subscribers: 0 } })),
        axios.get(`${API}/contact/messages`).catch(() => ({ data: { count: 0 } })),
        axios.get(`${API}/videos`).catch(() => ({ data: [] })),
        axios.get(`${API}/content?active_only=false`).catch(() => ({ data: { content: [] } })),
        axios.get(`${API}/khalifes?active_only=false`).catch(() => ({ data: { khalifes: [] } }))
      ]);

      setQuotes(quotesRes.data?.quotes || []);
      setEvents(eventsRes.data?.events || []);
      setPageContent(contentRes.data?.content || []);
      setKhalifes(khalifesRes.data?.khalifes || []);
      setStats({
        newsletter: newsletterRes.data?.total_subscribers || 0,
        contact: contactRes.data?.count || 0,
        videos: Array.isArray(videosRes.data) ? videosRes.data.length : 0
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  // ===== QUOTES CRUD =====
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

  const handleDeleteQuote = async (quoteId) => {
    setActionLoading(true);
    try {
      await axios.delete(`${API}/quotes/${quoteId}`, {
        headers: getAuthHeaders()
      });
      toast.success("Citation supprimée");
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setActionLoading(false);
    }
  };

  // ===== EVENTS CRUD =====
  const handleAddEvent = async () => {
    setActionLoading(true);
    try {
      await axios.post(`${API}/events`, newEvent);
      toast.success("Événement ajouté avec succès");
      setShowAddForm(false);
      setNewEvent({
        name_fr: "", name_en: "", name_ar: "", name_wo: "",
        description_fr: "", description_en: "", description_ar: "", description_wo: "",
        date: "", location: "Tivaouane", event_type: "gamou", recurring: false, recurrence_pattern: "", active: true
      });
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de l'événement");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateEvent = async (eventId) => {
    setActionLoading(true);
    try {
      await axios.put(`${API}/events/${eventId}`, editingItem, {
        headers: getAuthHeaders()
      });
      toast.success("Événement mis à jour");
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    setActionLoading(true);
    try {
      await axios.delete(`${API}/events/${eventId}`, {
        headers: getAuthHeaders()
      });
      toast.success("Événement supprimé");
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setActionLoading(false);
    }
  };

  // ===== PAGE CONTENT CRUD =====
  const handleUpdateContent = async (contentId) => {
    setActionLoading(true);
    try {
      await axios.put(`${API}/content/${contentId}`, editingItem, {
        headers: getAuthHeaders()
      });
      toast.success("Contenu mis à jour");
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    setActionLoading(true);
    try {
      await axios.delete(`${API}/content/${contentId}`, {
        headers: getAuthHeaders()
      });
      toast.success("Contenu supprimé");
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSeedContent = async (slug) => {
    setActionLoading(true);
    try {
      await axios.post(`${API}/content/seed/${slug}`, null, {
        headers: getAuthHeaders()
      });
      toast.success(`Contenu initialisé pour ${slug}`);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'initialisation");
    } finally {
      setActionLoading(false);
    }
  };

  // ===== KHALIFES (HERITIERS) CRUD =====
  const handleAddKhalife = async () => {
    setActionLoading(true);
    try {
      // Parse contributions from string to array if needed
      const khalifeData = {
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
      await axios.post(`${API}/khalifes`, khalifeData, {
        headers: getAuthHeaders()
      });
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
      const khalifeData = {
        ...editingItem,
        contributions: editingItem.contributions ? {
          fr: typeof editingItem.contributions.fr === 'string'
            ? editingItem.contributions.fr.split('\n').filter(c => c.trim())
            : editingItem.contributions.fr,
          en: typeof editingItem.contributions.en === 'string'
            ? editingItem.contributions.en.split('\n').filter(c => c.trim())
            : editingItem.contributions.en,
          ar: typeof editingItem.contributions.ar === 'string'
            ? editingItem.contributions.ar.split('\n').filter(c => c.trim())
            : editingItem.contributions.ar,
          wo: typeof editingItem.contributions.wo === 'string'
            ? editingItem.contributions.wo.split('\n').filter(c => c.trim())
            : editingItem.contributions.wo
        } : editingItem.contributions
      };
      await axios.put(`${API}/khalifes/${khalifeId}`, khalifeData, {
        headers: getAuthHeaders()
      });
      toast.success("Héritier mis à jour");
      setEditingItem(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteKhalife = async (khalifeId) => {
    setActionLoading(true);
    try {
      await axios.delete(`${API}/khalifes/${khalifeId}`, {
        headers: getAuthHeaders()
      });
      toast.success("Héritier supprimé");
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setActionLoading(false);
    }
  };

  const labels = {
    fr: {
      title: "Panneau d'Administration",
      quotes: "Citations",
      events: "Événements",
      content: "Contenu Pages",
      heritiers: "Héritiers",
      addNew: "Ajouter",
      refresh: "Actualiser",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      edit: "Modifier",
      active: "Actif",
      inactive: "Inactif",
      newsletters: "Abonnés Newsletter",
      messages: "Messages Contact",
      videos: "Vidéos",
      french: "Français",
      english: "Anglais",
      arabic: "Arabe",
      wolof: "Wolof",
      author: "Auteur",
      context: "Contexte",
      date: "Date",
      location: "Lieu",
      type: "Type",
      recurring: "Récurrent",
      logout: "Déconnexion",
      confirmDelete: "Confirmer la suppression",
      confirmDeleteMsg: "Êtes-vous sûr de vouloir supprimer cet élément ?",
      yes: "Oui, supprimer",
      no: "Annuler",
      newQuote: "Nouvelle Citation",
      newEvent: "Nouvel Événement",
      newHeritier: "Nouvel Héritier",
      editQuote: "Modifier la Citation",
      editEvent: "Modifier l'Événement",
      editContent: "Modifier le Contenu",
      editHeritier: "Modifier l'Héritier",
      page: "Page",
      section: "Section",
      seedContent: "Initialiser contenu",
      noContent: "Aucun contenu. Initialisez le contenu des pages.",
      name: "Nom",
      period: "Période",
      titleLabel: "Titre",
      description: "Description",
      contributions: "Contributions (une par ligne)",
      image: "URL de l'image",
      currentKhalife: "Khalife actuel",
      order: "Ordre"
    },
    en: {
      title: "Administration Panel",
      quotes: "Quotes",
      events: "Events",
      content: "Page Content",
      heritiers: "Heirs",
      addNew: "Add",
      refresh: "Refresh",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      active: "Active",
      inactive: "Inactive",
      newsletters: "Newsletter Subscribers",
      messages: "Contact Messages",
      videos: "Videos",
      french: "French",
      english: "English",
      arabic: "Arabic",
      wolof: "Wolof",
      author: "Author",
      context: "Context",
      date: "Date",
      location: "Location",
      type: "Type",
      recurring: "Recurring",
      logout: "Logout",
      confirmDelete: "Confirm Deletion",
      confirmDeleteMsg: "Are you sure you want to delete this item?",
      yes: "Yes, delete",
      no: "Cancel",
      newQuote: "New Quote",
      newEvent: "New Event",
      newHeritier: "New Heir",
      editQuote: "Edit Quote",
      editEvent: "Edit Event",
      editContent: "Edit Content",
      editHeritier: "Edit Heir",
      page: "Page",
      section: "Section",
      seedContent: "Seed content",
      noContent: "No content. Initialize page content.",
      name: "Name",
      period: "Period",
      titleLabel: "Title",
      description: "Description",
      contributions: "Contributions (one per line)",
      image: "Image URL",
      currentKhalife: "Current Khalife",
      order: "Order"
    }
  };

  const t = labels[language] || labels.fr;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#004D33]"></div>
      </div>
    );
  }

  // Delete Confirmation Modal
  const DeleteModal = () => {
    if (!deleteConfirm) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="delete-modal">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-[#004D33]">{t.confirmDelete}</h3>
          </div>
          <p className="text-[#4A4A4A] mb-6">{t.confirmDeleteMsg}</p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#4A4A4A] rounded-lg font-medium transition-colors"
              data-testid="cancel-delete-btn"
            >
              {t.no}
            </button>
            <button
              onClick={() => {
                if (deleteConfirm.type === 'quote') {
                  handleDeleteQuote(deleteConfirm.id);
                } else if (deleteConfirm.type === 'event') {
                  handleDeleteEvent(deleteConfirm.id);
                } else if (deleteConfirm.type === 'content') {
                  handleDeleteContent(deleteConfirm.id);
                } else if (deleteConfirm.type === 'khalife') {
                  handleDeleteKhalife(deleteConfirm.id);
                }
              }}
              disabled={actionLoading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              data-testid="confirm-delete-btn"
            >
              {actionLoading ? "..." : t.yes}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Edit Content Form
  const EditContentForm = ({ item }) => (
    <div className="bg-[#F9F7F2] rounded-lg p-6 mb-4" data-testid="edit-content-form">
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
          <label className="text-sm font-medium text-[#4A4A4A] mr-2">Order:</label>
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
  );

  // Edit Quote Form
  const EditQuoteForm = ({ quote }) => (
    <div className="bg-[#F9F7F2] rounded-lg p-6 mb-4" data-testid="edit-quote-form">
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
  );

  // Edit Event Form
  const EditEventForm = ({ event }) => (
    <div className="bg-[#F9F7F2] rounded-lg p-6 mb-4" data-testid="edit-event-form">
      <h3 className="font-bold text-[#004D33] mb-4">{t.editEvent}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Nom ({t.french})</label>
          <input
            type="text"
            value={editingItem?.name_fr || ""}
            onChange={(e) => setEditingItem({...editingItem, name_fr: e.target.value})}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Nom ({t.english})</label>
          <input
            type="text"
            value={editingItem?.name_en || ""}
            onChange={(e) => setEditingItem({...editingItem, name_en: e.target.value})}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.date}</label>
          <input
            type="date"
            value={editingItem?.date || ""}
            onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.location}</label>
          <input
            type="text"
            value={editingItem?.location || ""}
            onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.type}</label>
          <select
            value={editingItem?.event_type || "gamou"}
            onChange={(e) => setEditingItem({...editingItem, event_type: e.target.value})}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
          >
            <option value="gamou">Gamou</option>
            <option value="ziarra">Ziarra</option>
            <option value="hadratoul_joumah">Hadratoul Joumah</option>
            <option value="other">Autre</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="event-recurring"
              checked={editingItem?.recurring || false}
              onChange={(e) => setEditingItem({...editingItem, recurring: e.target.checked})}
              className="w-5 h-5"
            />
            <label htmlFor="event-recurring" className="text-sm font-medium text-[#4A4A4A]">{t.recurring}</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="event-active"
              checked={editingItem?.active || false}
              onChange={(e) => setEditingItem({...editingItem, active: e.target.checked})}
              className="w-5 h-5"
            />
            <label htmlFor="event-active" className="text-sm font-medium text-[#4A4A4A]">{t.active}</label>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Description ({t.french})</label>
        <textarea
          value={editingItem?.description_fr || ""}
          onChange={(e) => setEditingItem({...editingItem, description_fr: e.target.value})}
          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
          rows={3}
        />
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => handleUpdateEvent(event.id)}
          disabled={actionLoading}
          className="flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-lg disabled:opacity-50"
          data-testid="save-event-btn"
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
  );

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="admin-panel">
      <DeleteModal />
      
      {/* Header */}
      <div className="bg-[#004D33] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-[#D4AF37]" />
              <h1 className="text-2xl font-bold">{t.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchData}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                {t.refresh}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 px-4 py-2 rounded-lg transition-colors"
                data-testid="admin-logout"
              >
                <LogOut className="w-4 h-4" />
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#D4AF37]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#888888]">{t.newsletters}</p>
                <p className="text-3xl font-bold text-[#004D33]">{stats.newsletter}</p>
              </div>
              <Users className="w-10 h-10 text-[#D4AF37]" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-[#004D33]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#888888]">{t.messages}</p>
                <p className="text-3xl font-bold text-[#004D33]">{stats.contact}</p>
              </div>
              <Quote className="w-10 h-10 text-[#004D33]" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#888888]">{t.videos}</p>
                <p className="text-3xl font-bold text-[#004D33]">{stats.videos}</p>
              </div>
              <Video className="w-10 h-10 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setActiveTab("quotes"); setShowAddForm(false); setEditingItem(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "quotes" ? "bg-[#004D33] text-white" : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
            }`}
          >
            <Quote className="w-5 h-5" />
            {t.quotes} ({quotes.length})
          </button>
          <button
            onClick={() => { setActiveTab("events"); setShowAddForm(false); setEditingItem(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "events" ? "bg-[#004D33] text-white" : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
            }`}
          >
            <Calendar className="w-5 h-5" />
            {t.events} ({events.length})
          </button>
          <button
            onClick={() => { setActiveTab("heritiers"); setShowAddForm(false); setEditingItem(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "heritiers" ? "bg-[#004D33] text-white" : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
            }`}
          >
            <Users className="w-5 h-5" />
            {t.heritiers} ({khalifes.length})
          </button>
          <button
            onClick={() => { setActiveTab("content"); setShowAddForm(false); setEditingItem(null); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "content" ? "bg-[#004D33] text-white" : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
            }`}
          >
            <FileText className="w-5 h-5" />
            {t.content} ({pageContent.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Add Button - only for quotes, events, and heritiers */}
          {activeTab !== "content" && (
            <div className="flex justify-end mb-6">
              <button
                onClick={() => { setShowAddForm(!showAddForm); setEditingItem(null); }}
                className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-4 py-2 rounded-lg font-medium transition-colors"
                data-testid="add-new-btn"
              >
                <Plus className="w-5 h-5" />
                {t.addNew}
              </button>
            </div>
          )}

          {/* Seed Buttons for Content */}
          {activeTab === "content" && pageContent.length === 0 && (
            <div className="mb-6 p-4 bg-[#FFF8E1] rounded-lg">
              <p className="text-[#4A4A4A] mb-4">{t.noContent}</p>
              <div className="flex flex-wrap gap-2">
                {["maodo", "gamou", "ecole"].map(slug => (
                  <button
                    key={slug}
                    onClick={() => handleSeedContent(slug)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] rounded-lg font-medium disabled:opacity-50"
                  >
                    {t.seedContent}: {slug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-[#F9F7F2] rounded-lg p-6 mb-6">
              {activeTab === "quotes" ? (
                <div className="space-y-4">
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
              ) : activeTab === "events" ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-[#004D33] mb-4">{t.newEvent}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Nom ({t.french})</label>
                      <input
                        type="text"
                        value={newEvent.name_fr}
                        onChange={(e) => setNewEvent({...newEvent, name_fr: e.target.value})}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Nom ({t.english})</label>
                      <input
                        type="text"
                        value={newEvent.name_en}
                        onChange={(e) => setNewEvent({...newEvent, name_en: e.target.value})}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.date}</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.location}</label>
                      <input
                        type="text"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.type}</label>
                      <select
                        value={newEvent.event_type}
                        onChange={(e) => setNewEvent({...newEvent, event_type: e.target.value})}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                      >
                        <option value="gamou">Gamou</option>
                        <option value="ziarra">Ziarra</option>
                        <option value="hadratoul_joumah">Hadratoul Joumah</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="recurring"
                        checked={newEvent.recurring}
                        onChange={(e) => setNewEvent({...newEvent, recurring: e.target.checked})}
                        className="w-5 h-5"
                      />
                      <label htmlFor="recurring" className="text-sm font-medium text-[#4A4A4A]">{t.recurring}</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Description ({t.french})</label>
                    <textarea
                      value={newEvent.description_fr}
                      onChange={(e) => setNewEvent({...newEvent, description_fr: e.target.value})}
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleAddEvent}
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
              ) : activeTab === "heritiers" ? (
                <div className="space-y-4">
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
                    <div className="flex items-center gap-2">
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
              ) : null}
            </div>
          )}

          {/* Quotes List */}
          {activeTab === "quotes" && (
            <div className="space-y-4">
              {quotes.length > 0 ? quotes.map((quote, index) => (
                <div key={quote.id || index}>
                  {editingItem?.id === quote.id ? (
                    <EditQuoteForm quote={quote} />
                  ) : (
                    <div
                      className={`p-4 rounded-lg border ${quote.active ? 'bg-white border-[#E8F5E9]' : 'bg-gray-50 border-gray-200'}`}
                      data-testid={`quote-item-${index}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-[#004D33] font-medium mb-2">"{quote.text_fr}"</p>
                          <p className="text-sm text-[#888888]">— {quote.author}</p>
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
                    </div>
                  )}
                </div>
              )) : (
                <p className="text-center text-[#888888] py-8">Aucune citation</p>
              )}
            </div>
          )}

          {/* Events List */}
          {activeTab === "events" && (
            <div className="space-y-4">
              {events.length > 0 ? events.map((event, index) => (
                <div key={event.id || index}>
                  {editingItem?.id === event.id ? (
                    <EditEventForm event={event} />
                  ) : (
                    <div
                      className={`p-4 rounded-lg border ${event.active ? 'bg-white border-[#E8F5E9]' : 'bg-gray-50 border-gray-200'}`}
                      data-testid={`event-item-${index}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-[#004D33] font-bold">{event.name_fr}</h4>
                            <span className="px-2 py-1 bg-[#D4AF37] text-[#004D33] text-xs font-semibold rounded-full">
                              {event.event_type}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-[#888888]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {event.date}
                            </span>
                            <span>{event.location}</span>
                            {event.recurring && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                {event.recurrence_pattern}
                              </span>
                            )}
                          </div>
                          {event.description_fr && (
                            <p className="text-sm text-[#4A4A4A] mt-2">{event.description_fr}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            event.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {event.active ? t.active : t.inactive}
                          </span>
                          <button
                            onClick={() => setEditingItem({...event})}
                            className="p-2 text-[#004D33] hover:bg-[#E8F5E9] rounded-lg transition-colors"
                            title={t.edit}
                            data-testid={`edit-event-${index}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'event', id: event.id })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={t.delete}
                            data-testid={`delete-event-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )) : (
                <p className="text-center text-[#888888] py-8">Aucun événement</p>
              )}
            </div>
          )}

          {/* Page Content List */}
          {activeTab === "content" && (
            <div className="space-y-4">
              {/* Group content by page */}
              {pageContent.length > 0 ? (
                Object.entries(
                  pageContent.reduce((acc, item) => {
                    if (!acc[item.slug]) acc[item.slug] = [];
                    acc[item.slug].push(item);
                    return acc;
                  }, {})
                ).map(([slug, sections]) => (
                  <div key={slug} className="border rounded-lg overflow-hidden">
                    <div className="bg-[#004D33] text-white px-4 py-2 font-semibold capitalize">
                      {t.page}: {slug}
                    </div>
                    <div className="divide-y">
                      {sections.sort((a, b) => a.order - b.order).map((item, index) => (
                        <div key={item.id}>
                          {editingItem?.id === item.id ? (
                            <EditContentForm item={item} />
                          ) : (
                            <div
                              className={`p-4 ${item.active ? 'bg-white' : 'bg-gray-50'}`}
                              data-testid={`content-item-${slug}-${index}`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-[#E8F5E9] text-[#004D33] text-xs font-semibold rounded">
                                      {item.section}
                                    </span>
                                    <span className="text-xs text-[#888888]">Order: {item.order}</span>
                                  </div>
                                  <p className="text-[#4A4A4A] text-sm line-clamp-2">
                                    {item.content?.fr?.substring(0, 200)}...
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    item.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                  }`}>
                                    {item.active ? t.active : t.inactive}
                                  </span>
                                  <button
                                    onClick={() => setEditingItem({...item})}
                                    className="p-2 text-[#004D33] hover:bg-[#E8F5E9] rounded-lg transition-colors"
                                    title={t.edit}
                                    data-testid={`edit-content-${slug}-${index}`}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirm({ type: 'content', id: item.id })}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title={t.delete}
                                    data-testid={`delete-content-${slug}-${index}`}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#888888] mb-4">{t.noContent}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["maodo", "gamou", "ecole"].map(slug => (
                      <button
                        key={slug}
                        onClick={() => handleSeedContent(slug)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] rounded-lg font-medium disabled:opacity-50"
                      >
                        {t.seedContent}: {slug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Heritiers (Khalifes) List */}
          {activeTab === "heritiers" && (
            <div className="space-y-4">
              {khalifes.length > 0 ? khalifes.map((khalife, index) => (
                <div key={khalife.id || index}>
                  {editingItem?.id === khalife.id ? (
                    <div className="bg-[#F9F7F2] rounded-lg p-4">
                      <h4 className="font-bold text-[#004D33] mb-4">{t.editHeritier}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.name}</label>
                          <input
                            type="text"
                            value={editingItem.name}
                            onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.period}</label>
                          <input
                            type="text"
                            value={editingItem.period}
                            onChange={(e) => setEditingItem({...editingItem, period: e.target.value})}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.titleLabel} ({t.french})</label>
                          <input
                            type="text"
                            value={editingItem.title?.fr || ''}
                            onChange={(e) => setEditingItem({...editingItem, title: {...editingItem.title, fr: e.target.value}})}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.titleLabel} ({t.english})</label>
                          <input
                            type="text"
                            value={editingItem.title?.en || ''}
                            onChange={(e) => setEditingItem({...editingItem, title: {...editingItem.title, en: e.target.value}})}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.image}</label>
                          <input
                            type="text"
                            value={editingItem.image || ''}
                            onChange={(e) => setEditingItem({...editingItem, image: e.target.value})}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.description} ({t.french})</label>
                          <textarea
                            value={editingItem.description?.fr || ''}
                            onChange={(e) => setEditingItem({...editingItem, description: {...editingItem.description, fr: e.target.value}})}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.description} ({t.english})</label>
                          <textarea
                            value={editingItem.description?.en || ''}
                            onChange={(e) => setEditingItem({...editingItem, description: {...editingItem.description, en: e.target.value}})}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.contributions} ({t.french})</label>
                          <textarea
                            value={Array.isArray(editingItem.contributions?.fr) ? editingItem.contributions.fr.join('\n') : editingItem.contributions?.fr || ''}
                            onChange={(e) => setEditingItem({...editingItem, contributions: {...editingItem.contributions, fr: e.target.value}})}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.contributions} ({t.english})</label>
                          <textarea
                            value={Array.isArray(editingItem.contributions?.en) ? editingItem.contributions.en.join('\n') : editingItem.contributions?.en || ''}
                            onChange={(e) => setEditingItem({...editingItem, contributions: {...editingItem.contributions, en: e.target.value}})}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.order}</label>
                          <input
                            type="number"
                            value={editingItem.order || 0}
                            onChange={(e) => setEditingItem({...editingItem, order: parseInt(e.target.value) || 0})}
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#004D33] focus:border-transparent"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="editCurrentKhalife"
                            checked={editingItem.current || false}
                            onChange={(e) => setEditingItem({...editingItem, current: e.target.checked})}
                            className="w-5 h-5"
                          />
                          <label htmlFor="editCurrentKhalife" className="text-sm font-medium text-[#4A4A4A]">{t.currentKhalife}</label>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleUpdateKhalife(khalife.id)}
                          disabled={actionLoading}
                          className="flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-lg disabled:opacity-50"
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
                    <div
                      className={`border rounded-lg p-4 ${khalife.active ? 'bg-white' : 'bg-gray-50'} ${khalife.current ? 'ring-2 ring-[#D4AF37]' : ''}`}
                      data-testid={`khalife-admin-${index}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          {khalife.image && (
                            <img
                              src={khalife.image}
                              alt={khalife.name}
                              className="w-16 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-[#004D33]">{khalife.name}</h3>
                              {khalife.current && (
                                <span className="px-2 py-0.5 bg-[#D4AF37] text-[#004D33] text-xs font-bold rounded-full">
                                  {t.currentKhalife}
                                </span>
                              )}
                            </div>
                            <p className="text-[#D4AF37] text-sm font-medium">{khalife.title?.fr || khalife.title?.en}</p>
                            <p className="text-[#888888] text-sm">{khalife.period}</p>
                            <p className="text-[#4A4A4A] text-sm mt-2 line-clamp-2">
                              {khalife.description?.fr?.substring(0, 150)}...
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#888888]">#{khalife.order}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            khalife.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {khalife.active ? t.active : t.inactive}
                          </span>
                          <button
                            onClick={() => setEditingItem({...khalife})}
                            className="p-2 text-[#004D33] hover:bg-[#E8F5E9] rounded-lg transition-colors"
                            title={t.edit}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'khalife', id: khalife.id })}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={t.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )) : (
                <p className="text-center text-[#888888] py-8">Aucun héritier</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
