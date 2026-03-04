import { useState, useEffect } from "react";
import { Mail, MailOpen, Trash2, Eye, Calendar, User, MessageSquare, RefreshCw } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = `${BACKEND_URL}/api`;

const MessagesTab = ({ getAuthHeaders }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [stats, setStats] = useState({ total: 0, unread: 0 });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/contact/messages`, {
        headers: getAuthHeaders()
      });
      setMessages(response.data.messages || []);
      setStats({
        total: response.data.total || 0,
        unread: response.data.unread || 0
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await axios.put(`${API}/contact/messages/${messageId}/read`, {}, {
        headers: getAuthHeaders()
      });
      setMessages(messages.map(m => 
        m.id === messageId ? { ...m, read: true } : m
      ));
      setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
      toast.success("Message marqué comme lu");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="w-8 h-8 animate-spin text-[#004D33]" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="messages-tab">
      {/* Stats Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-[#004D33] text-white px-4 py-2 rounded-lg">
            <span className="font-bold">{stats.total}</span> messages
          </div>
          {stats.unread > 0 && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg">
              <span className="font-bold">{stats.unread}</span> non lu{stats.unread > 1 ? 's' : ''}
            </div>
          )}
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      </div>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Message List */}
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun message reçu</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (!message.read) {
                    markAsRead(message.id);
                  }
                }}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedMessage?.id === message.id
                    ? 'border-[#D4AF37] bg-amber-50'
                    : message.read
                    ? 'border-gray-200 bg-white'
                    : 'border-[#004D33] bg-green-50'
                }`}
                data-testid={`message-item-${message.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {message.read ? (
                      <MailOpen className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Mail className="w-5 h-5 text-[#004D33]" />
                    )}
                    <span className={`font-medium ${!message.read ? 'text-[#004D33]' : 'text-gray-700'}`}>
                      {message.nom}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(message.created_at)}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800 mt-2 truncate">
                  {message.sujet}
                </p>
                <p className="text-sm text-gray-500 mt-1 truncate">
                  {message.message}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 min-h-[400px]">
          {selectedMessage ? (
            <div className="space-y-4" data-testid="message-detail">
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-lg font-bold text-[#004D33]">
                  {selectedMessage.sujet}
                </h3>
                {!selectedMessage.read && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Nouveau
                  </span>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="font-medium">{selectedMessage.nom}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="text-[#004D33] hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{formatDate(selectedMessage.created_at)}</span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.sujet}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#004D33] text-white rounded-lg hover:bg-[#003D28] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Répondre
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Eye className="w-12 h-12 mb-4" />
              <p>Sélectionnez un message pour le lire</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesTab;
