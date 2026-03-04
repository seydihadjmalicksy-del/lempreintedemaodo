import { useState, useEffect } from "react";
import { Mail, Trash2, RefreshCw, Users, Globe, Calendar } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const NewsletterTab = ({ getAuthHeaders, onDelete }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, inactive: 0, by_language: {} });

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/newsletter/subscribers/list`, {
        headers: getAuthHeaders()
      });
      setSubscribers(response.data.subscribers || []);
      setStats({
        total: response.data.total || 0,
        inactive: response.data.inactive || 0
      });
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      toast.error("Erreur lors du chargement des abonnés");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subscriberId, email) => {
    if (!window.confirm(`Supprimer l'abonné ${email} ?`)) return;
    
    try {
      await axios.delete(`${API}/newsletter/subscribers/${subscriberId}`, {
        headers: getAuthHeaders()
      });
      setSubscribers(subscribers.filter(s => s.id !== subscriberId));
      setStats(prev => ({ ...prev, total: prev.total - 1 }));
      toast.success("Abonné supprimé");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getLanguageLabel = (lang) => {
    const labels = { fr: "Français", en: "English", ar: "العربية" };
    return labels[lang] || lang || "Non spécifié";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-[#004D33]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="newsletter-tab">
      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#D4AF37] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span className="font-bold">{stats.total}</span> abonné{stats.total > 1 ? 's' : ''}
          </div>
          {stats.inactive > 0 && (
            <div className="bg-gray-400 text-white px-4 py-2 rounded-lg">
              <span className="font-bold">{stats.inactive}</span> inactif{stats.inactive > 1 ? 's' : ''}
            </div>
          )}
        </div>
        <button
          onClick={fetchSubscribers}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Subscribers List */}
      {subscribers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun abonné</h3>
          <p className="text-gray-500">Les abonnés à la newsletter apparaîtront ici</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Langue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50" data-testid={`subscriber-${subscriber.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                      <a 
                        href={`mailto:${subscriber.email}`}
                        className="text-sm font-medium text-gray-900 hover:text-[#004D33]"
                      >
                        {subscriber.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      {getLanguageLabel(subscriber.language)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(subscriber.subscribed_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleDelete(subscriber.id, subscriber.email)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NewsletterTab;
