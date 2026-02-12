import { useState } from "react";
import { Plus, Save, X, Edit2, Trash2, Calendar, MapPin } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const EventsTab = ({ 
  events, 
  fetchData, 
  setDeleteConfirm, 
  language,
  getAuthHeaders 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name_fr: "", name_en: "", name_ar: "", name_wo: "",
    description_fr: "", description_en: "", description_ar: "", description_wo: "",
    date: "", location: "Tivaouane", event_type: "gamou", recurring: false, recurrence_pattern: "", active: true
  });

  const t = {
    fr: {
      newEvent: "Nouvel Événement", editEvent: "Modifier l'Événement",
      french: "Français", english: "Anglais", date: "Date", location: "Lieu",
      type: "Type", recurring: "Récurrent", active: "Actif", inactive: "Inactif",
      save: "Enregistrer", cancel: "Annuler", edit: "Modifier", delete: "Supprimer",
      addNew: "Ajouter", noEvents: "Aucun événement", description: "Description"
    },
    en: {
      newEvent: "New Event", editEvent: "Edit Event",
      french: "French", english: "English", date: "Date", location: "Location",
      type: "Type", recurring: "Recurring", active: "Active", inactive: "Inactive",
      save: "Save", cancel: "Cancel", edit: "Edit", delete: "Delete",
      addNew: "Add", noEvents: "No events", description: "Description"
    }
  }[language] || {
    newEvent: "Nouvel Événement", editEvent: "Modifier l'Événement",
    french: "Français", english: "Anglais", date: "Date", location: "Lieu",
    type: "Type", recurring: "Récurrent", active: "Actif", inactive: "Inactif",
    save: "Enregistrer", cancel: "Annuler", edit: "Modifier", delete: "Supprimer",
    addNew: "Ajouter", noEvents: "Aucun événement", description: "Description"
  };

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

  const eventTypeLabels = {
    gamou: "Gamou",
    ziarra: "Ziarra",
    hadratoul_joumah: "Hadratoul Joumah",
    other: "Autre"
  };

  return (
    <div className="space-y-4">
      {/* Add Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingItem(null); }}
          className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33] px-4 py-2 rounded-lg font-medium transition-colors"
          data-testid="add-event-btn"
        >
          <Plus className="w-5 h-5" />
          {t.addNew}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-[#F9F7F2] rounded-lg p-6 mb-4" data-testid="add-event-form">
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
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.description} ({t.french})</label>
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
      )}

      {/* Events List */}
      {events.length > 0 ? events.map((event, index) => (
        <div key={event.id || index} className="border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`event-item-${index}`}>
          {editingItem?.id === event.id ? (
            <div className="bg-[#F9F7F2] rounded-lg p-6" data-testid="edit-event-form">
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
                <label className="block text-sm font-medium text-[#4A4A4A] mb-1">{t.description} ({t.french})</label>
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
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-[#004D33]">{event.name_fr}</h4>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-[#888888]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </span>
                  <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#004D33] rounded-full text-xs">
                    {eventTypeLabels[event.event_type] || event.event_type}
                  </span>
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
          )}
        </div>
      )) : (
        <p className="text-center text-[#888888] py-8">{t.noEvents}</p>
      )}
    </div>
  );
};

export default EventsTab;
