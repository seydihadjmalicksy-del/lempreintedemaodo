import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Quote, Calendar, Video, Users, Plus, Trash2, Edit2, Save, X, RefreshCw, CheckCircle, LogOut } from "lucide-react";
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
  const [stats, setStats] = useState({ newsletter: 0, contact: 0, videos: 0 });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
    
    // Check if token expired
    if (new Date(expires) < new Date()) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminExpires");
      localStorage.removeItem("adminUsername");
      navigate("/admin/login");
      return;
    }
    
    // Verify token with backend
    try {
      await axios.get(`${API}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAuthenticated(true);
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
    } catch (e) {
      // Ignore errors
    }
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
      const [quotesRes, eventsRes, newsletterRes, contactRes, videosRes] = await Promise.all([
        axios.get(`${API}/quotes?active_only=false`),
        axios.get(`${API}/events?upcoming_only=false`),
        axios.get(`${API}/newsletter/subscribers`).catch(() => ({ data: { total_subscribers: 0 } })),
        axios.get(`${API}/contact/messages`).catch(() => ({ data: { count: 0 } })),
        axios.get(`${API}/videos`).catch(() => ({ data: [] }))
      ]);

      setQuotes(quotesRes.data?.quotes || []);
      setEvents(eventsRes.data?.events || []);
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

  const handleAddQuote = async () => {
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
    }
  };

  const handleAddEvent = async () => {
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
    }
  };

  const labels = {
    fr: {
      title: "Panneau d'Administration",
      quotes: "Citations",
      events: "Événements",
      stats: "Statistiques",
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
      logout: "Déconnexion"
    },
    en: {
      title: "Administration Panel",
      quotes: "Quotes",
      events: "Events",
      stats: "Statistics",
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
      logout: "Logout",
      date: "Date",
      location: "Location",
      type: "Type",
      recurring: "Recurring"
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

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="admin-panel">
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
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setActiveTab("quotes"); setShowAddForm(false); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "quotes" ? "bg-[#004D33] text-white" : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
            }`}
          >
            <Quote className="w-5 h-5" />
            {t.quotes} ({quotes.length})
          </button>
          <button
            onClick={() => { setActiveTab("events"); setShowAddForm(false); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "events" ? "bg-[#004D33] text-white" : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
            }`}
          >
            <Calendar className="w-5 h-5" />
            {t.events} ({events.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Add Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t.addNew}
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-[#F9F7F2] rounded-lg p-6 mb-6">
              {activeTab === "quotes" ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-[#004D33] mb-4">Nouvelle Citation</h3>
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
                      className="flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-lg"
                    >
                      <Save className="w-4 h-4" />
                      {t.save}
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
              ) : (
                <div className="space-y-4">
                  <h3 className="font-bold text-[#004D33] mb-4">Nouvel Événement</h3>
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
                      className="flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-lg"
                    >
                      <Save className="w-4 h-4" />
                      {t.save}
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
            </div>
          )}

          {/* Quotes List */}
          {activeTab === "quotes" && (
            <div className="space-y-4">
              {quotes.length > 0 ? quotes.map((quote, index) => (
                <div
                  key={quote.id || index}
                  className={`p-4 rounded-lg border ${quote.active ? 'bg-white border-[#E8F5E9]' : 'bg-gray-50 border-gray-200'}`}
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
                    </div>
                  </div>
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
                <div
                  key={event.id || index}
                  className={`p-4 rounded-lg border ${event.active ? 'bg-white border-[#E8F5E9]' : 'bg-gray-50 border-gray-200'}`}
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
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {event.active ? t.active : t.inactive}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-center text-[#888888] py-8">Aucun événement</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
