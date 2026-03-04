import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, Quote, Calendar, Users, RefreshCw, LogOut, Archive, Book, MessageSquare, Layout, Video, Home, FolderOpen, Mail } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

// Import refactored admin components
import {
  DeleteConfirmModal,
  OuvragesTab,
  FamilyTreeTab,
  ArchivesTab,
  QuotesTab,
  EventsTab,
  KhalifesTab,
  WattuTab,
  HomepageSectionsTab,
  MediaManagerTab,
  MessagesTab,
  NewsletterTab,
  VideosTab
} from "./admin";
import DynamicPagesTab from "./admin/DynamicPagesTab";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPanel = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("homepage");
  const [quotes, setQuotes] = useState([]);
  const [events, setEvents] = useState([]);
  const [khalifes, setKhalifes] = useState([]);
  const [archives, setArchives] = useState({ manuscripts: [], photos: [], audio: [], videos: [], sources: [] });
  const [archivesStats, setArchivesStats] = useState({ total: 0 });
  const [familyTree, setFamilyTree] = useState([]);
  const [ouvrages, setOuvrages] = useState({ majeurs: [], autres: [], bibliotheque: [], academiques: [] });
  const [ouvragesStats, setOuvragesStats] = useState({ total: 0 });
  const [wattuStats, setWattuStats] = useState({ total: 0 });
  const [pagesStats, setPagesStats] = useState({ total: 0 });
  const [homepageSectionsCount, setHomepageSectionsCount] = useState(0);
  const [mediaStats, setMediaStats] = useState({ total: 0 });
  const [messagesStats, setMessagesStats] = useState({ total: 0, unread: 0 });
  const [stats, setStats] = useState({ newsletter: 0, contact: 0, videos: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Labels
  const labels = {
    fr: {
      title: "Panneau d'Administration",
      quotes: "Citations", events: "Événements", content: "Pages", heritiers: "Héritiers",
      refresh: "Actualiser", logout: "Déconnexion",
      newsletters: "Abonnés Newsletter", messages: "Messages Contact", videos: "Vidéos",
      confirmDelete: "Confirmer la suppression",
      confirmDeleteMsg: "Êtes-vous sûr de vouloir supprimer cet élément ?",
      yes: "Oui, supprimer", no: "Annuler"
    },
    en: {
      title: "Administration Panel",
      quotes: "Quotes", events: "Events", content: "Pages", heritiers: "Heirs",
      refresh: "Refresh", logout: "Logout",
      newsletters: "Newsletter Subscribers", messages: "Contact Messages", videos: "Videos",
      confirmDelete: "Confirm Deletion",
      confirmDeleteMsg: "Are you sure you want to delete this item?",
      yes: "Yes, delete", no: "Cancel"
    }
  };
  const t = labels[language] || labels.fr;

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
      const [quotesRes, eventsRes, newsletterRes, contactRes, videosRes, khalifesRes, archivesStatsRes, wattuStatsRes, dynamicPagesStatsRes, homepageSectionsRes, mediaStatsRes] = await Promise.all([
        axios.get(`${API}/quotes?active_only=false`),
        axios.get(`${API}/events?upcoming_only=false`),
        axios.get(`${API}/newsletter/subscribers`).catch(() => ({ data: { total_subscribers: 0 } })),
        axios.get(`${API}/contact/messages/count`).catch(() => ({ data: { count: 0 } })),
        axios.get(`${API}/videos`).catch(() => ({ data: [] })),
        axios.get(`${API}/khalifes?active_only=false`).catch(() => ({ data: { khalifes: [] } })),
        axios.get(`${API}/archives/stats`).catch(() => ({ data: { total: 0 } })),
        axios.get(`${API}/wattu/stats`).catch(() => ({ data: { total: 0 } })),
        axios.get(`${API}/dynamic-pages/stats`).catch(() => ({ data: { total: 0 } })),
        axios.get(`${API}/homepage-sections/`).catch(() => ({ data: [] })),
        axios.get(`${API}/media/stats`).catch(() => ({ data: { total: 0 } }))
      ]);

      setQuotes(quotesRes.data?.quotes || []);
      setEvents(eventsRes.data?.events || []);
      setKhalifes(khalifesRes.data?.khalifes || []);
      setArchivesStats(archivesStatsRes.data || { total: 0 });
      setWattuStats(wattuStatsRes.data || { total: 0 });
      setPagesStats(dynamicPagesStatsRes.data || { total: 0 });
      setHomepageSectionsCount(Array.isArray(homepageSectionsRes.data) ? homepageSectionsRes.data.length : 0);
      setMediaStats(mediaStatsRes.data || { total: 0 });
      setMessagesStats({ total: contactRes.data?.count || 0, unread: 0 });
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

  // Fetch Archives Data
  const fetchArchives = async () => {
    try {
      const [manuscriptsRes, photosRes, audioRes, videosRes, sourcesRes] = await Promise.all([
        axios.get(`${API}/archives/manuscripts`),
        axios.get(`${API}/archives/photos`),
        axios.get(`${API}/archives/audio`),
        axios.get(`${API}/archives/videos`),
        axios.get(`${API}/archives/sources`)
      ]);
      setArchives({
        manuscripts: manuscriptsRes.data || [],
        photos: photosRes.data || [],
        audio: audioRes.data || [],
        videos: videosRes.data || [],
        sources: sourcesRes.data || []
      });
    } catch (error) {
      console.error("Error fetching archives:", error);
    }
  };

  // Fetch Family Tree
  const fetchFamilyTree = async () => {
    try {
      const response = await axios.get(`${API}/family-tree`);
      setFamilyTree(response.data?.members || []);
    } catch (error) {
      console.error("Error fetching family tree:", error);
    }
  };

  // Fetch Ouvrages Data
  const fetchOuvrages = async () => {
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
    }
  };

  // Delete handlers
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    setActionLoading(true);
    try {
      const { type, id } = deleteConfirm;
      
      switch (type) {
        case 'quote':
          await axios.delete(`${API}/quotes/${id}`, { headers: getAuthHeaders() });
          break;
        case 'event':
          await axios.delete(`${API}/events/${id}`, { headers: getAuthHeaders() });
          break;
        case 'khalife':
          await axios.delete(`${API}/khalifes/${id}`, { headers: getAuthHeaders() });
          break;
        case 'family_member':
          await axios.delete(`${API}/family-tree/${id}`, { headers: getAuthHeaders() });
          fetchFamilyTree();
          break;
        case 'wattu_article':
          await axios.delete(`${API}/wattu/admin/articles/${id}`, { headers: getAuthHeaders() });
          break;
        default:
          // Handle archive types
          if (type.startsWith('archive_')) {
            const archiveType = type.replace('archive_', '');
            await axios.delete(`${API}/archives/${archiveType}/${id}`, { headers: getAuthHeaders() });
            fetchArchives();
          } else if (type.startsWith('ouvrage_')) {
            const ouvrageType = type.replace('ouvrage_', '');
            await axios.delete(`${API}/ouvrages/${ouvrageType}/${id}`, { headers: getAuthHeaders() });
            fetchOuvrages();
          }
      }
      
      toast.success("Élément supprimé");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setActionLoading(false);
      setDeleteConfirm(null);
    }
  };

  // Tab configuration
  const tabs = [
    { id: "homepage", icon: Home, label: "Accueil", count: homepageSectionsCount },
    { id: "messages", icon: Mail, label: "Messages", count: messagesStats.total || 0, highlight: messagesStats.unread > 0 },
    { id: "newsletter", icon: Users, label: "Newsletter", count: stats.newsletter || 0, color: "gold" },
    { id: "videos", icon: Video, label: "Vidéos", count: stats.videos || 0, color: "blue" },
    { id: "media", icon: FolderOpen, label: "Médias", count: mediaStats.total || 0 },
    { id: "quotes", icon: Quote, label: t.quotes, count: quotes.length },
    { id: "events", icon: Calendar, label: t.events, count: events.length },
    { id: "heritiers", icon: Users, label: t.heritiers, count: khalifes.length },
    { id: "wattu", icon: MessageSquare, label: "Wattu", count: wattuStats.total || 0 },
    { id: "dynamicPages", icon: Layout, label: "Pages", count: pagesStats.total || 0 },
    { id: "archives", icon: Archive, label: "Archives", count: archivesStats.total || 0, onSelect: fetchArchives },
    { id: "familyTree", icon: Users, label: "Arbre", count: familyTree.length, onSelect: fetchFamilyTree },
    { id: "ouvrages", icon: Book, label: "Ouvrages", count: ouvragesStats.total || 0, onSelect: fetchOuvrages }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2]" data-testid="admin-panel">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        loading={actionLoading}
        labels={{
          title: t.confirmDelete,
          message: t.confirmDeleteMsg,
          confirm: t.yes,
          cancel: t.no
        }}
      />
      
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
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { 
                setActiveTab(tab.id); 
                if (tab.onSelect) tab.onSelect();
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === tab.id ? "bg-[#004D33] text-white" : "bg-white text-[#4A4A4A] hover:bg-[#E8F5E9]"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="w-8 h-8 text-[#004D33] animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === "homepage" && (
                <HomepageSectionsTab
                  getAuthHeaders={getAuthHeaders}
                  onDelete={setDeleteConfirm}
                />
              )}

              {activeTab === "messages" && (
                <MessagesTab
                  getAuthHeaders={getAuthHeaders}
                />
              )}

              {activeTab === "newsletter" && (
                <NewsletterTab
                  getAuthHeaders={getAuthHeaders}
                  onDelete={setDeleteConfirm}
                />
              )}

              {activeTab === "videos" && (
                <VideosTab
                  getAuthHeaders={getAuthHeaders}
                  onDelete={setDeleteConfirm}
                />
              )}

              {activeTab === "media" && (
                <MediaManagerTab
                  getAuthHeaders={getAuthHeaders}
                />
              )}

              {activeTab === "quotes" && (
                <QuotesTab
                  quotes={quotes}
                  fetchData={fetchData}
                  setDeleteConfirm={setDeleteConfirm}
                  language={language}
                  getAuthHeaders={getAuthHeaders}
                />
              )}

              {activeTab === "events" && (
                <EventsTab
                  events={events}
                  fetchData={fetchData}
                  setDeleteConfirm={setDeleteConfirm}
                  language={language}
                  getAuthHeaders={getAuthHeaders}
                />
              )}

              {activeTab === "heritiers" && (
                <KhalifesTab
                  khalifes={khalifes}
                  fetchData={fetchData}
                  setDeleteConfirm={setDeleteConfirm}
                  language={language}
                  getAuthHeaders={getAuthHeaders}
                />
              )}

              {activeTab === "archives" && (
                <ArchivesTab
                  getAuthHeaders={getAuthHeaders}
                />
              )}

              {activeTab === "familyTree" && (
                <FamilyTreeTab
                  getAuthHeaders={getAuthHeaders}
                />
              )}

              {activeTab === "ouvrages" && (
                <OuvragesTab
                  getAuthHeaders={getAuthHeaders}
                />
              )}

              {activeTab === "wattu" && (
                <WattuTab
                  getAuthHeaders={getAuthHeaders}
                  onDelete={setDeleteConfirm}
                />
              )}

              {activeTab === "dynamicPages" && (
                <DynamicPagesTab
                  getAuthHeaders={getAuthHeaders}
                  onDelete={setDeleteConfirm}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
