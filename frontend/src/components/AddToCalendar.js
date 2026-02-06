import { Calendar, Download, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AddToCalendar = ({ event, variant = "button" }) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const labels = {
    fr: { addToCalendar: "Ajouter au calendrier", googleCalendar: "Google Calendar", outlook: "Outlook", apple: "Apple Calendar", download: "Télécharger .ics" },
    en: { addToCalendar: "Add to Calendar", googleCalendar: "Google Calendar", outlook: "Outlook", apple: "Apple Calendar", download: "Download .ics" },
    ar: { addToCalendar: "إضافة إلى التقويم", googleCalendar: "تقويم Google", outlook: "Outlook", apple: "تقويم Apple", download: "تحميل .ics" },
    wo: { addToCalendar: "Yokk ci calendrier", googleCalendar: "Google Calendar", outlook: "Outlook", apple: "Apple Calendar", download: "Télécharge .ics" }
  };

  const t = labels[language] || labels.fr;

  // Format date for calendar links
  const formatDateForGoogle = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().replace(/-|:|\.\d{3}/g, "").slice(0, 8);
  };

  const formatDateForOutlook = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 10);
  };

  // Generate calendar URLs
  const getGoogleCalendarUrl = () => {
    const startDate = formatDateForGoogle(event.date);
    const endDate = formatDateForGoogle(new Date(new Date(event.date).getTime() + 86400000).toISOString());
    const title = encodeURIComponent(event.name_fr || event.name_en || "Événement Tivaouane");
    const description = encodeURIComponent(event.description_fr || event.description_en || "");
    const location = encodeURIComponent(event.location || "Tivaouane, Sénégal");
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}&location=${location}`;
  };

  const getOutlookUrl = () => {
    const title = encodeURIComponent(event.name_fr || event.name_en || "Événement Tivaouane");
    const description = encodeURIComponent(event.description_fr || event.description_en || "");
    const location = encodeURIComponent(event.location || "Tivaouane, Sénégal");
    const startDate = formatDateForOutlook(event.date);
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${description}&location=${location}&startdt=${startDate}&allday=true`;
  };

  const getIcsUrl = () => {
    if (event.id) {
      return `${BACKEND_URL}/api/calendar/event/${event.id}.ics`;
    }
    return `${BACKEND_URL}/api/calendar/events.ics`;
  };

  const calendarOptions = [
    {
      name: t.googleCalendar,
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 22c5.421 0 10-4.579 10-10S17.421 2 12 2 2 6.579 2 12s4.579 10 10 10zm0-18c4.337 0 8 3.663 8 8s-3.663 8-8 8-8-3.663-8-8 3.663-8 8-8zm1 4h-2v5l4.25 2.5.75-1.23-3-1.77V8z"/>
        </svg>
      ),
      url: getGoogleCalendarUrl(),
      color: "hover:bg-blue-50 hover:text-blue-600"
    },
    {
      name: t.outlook,
      icon: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.2t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.55q0-.44.3-.75.3-.3.75-.3h12.9q.44 0 .75.3.3.3.3.75V12zm-6-8.25v3h3v-3zm0 4.5v3h3v-3zm0 4.5v1.83l3 .02v-1.85zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v1.85l3.75.02v-1.87zm-5.25-9v3h3.75v-3zm0 4.5v3h3.75v-3zm0 4.5v1.87l3.75.02v-1.89z"/>
        </svg>
      ),
      url: getOutlookUrl(),
      color: "hover:bg-blue-50 hover:text-blue-700"
    },
    {
      name: t.download,
      icon: Download,
      url: getIcsUrl(),
      color: "hover:bg-gray-100 hover:text-gray-700",
      download: true
    }
  ];

  if (variant === "compact") {
    return (
      <a
        href={getIcsUrl()}
        download
        className="inline-flex items-center gap-2 text-[#004D33] hover:text-[#D4AF37] transition-colors text-sm"
        data-testid="add-to-calendar-compact"
      >
        <Calendar className="w-4 h-4" />
        <span>{t.addToCalendar}</span>
      </a>
    );
  }

  return (
    <div className="relative inline-block" data-testid="add-to-calendar">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#004D33] hover:bg-[#003d29] text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        <Calendar className="w-5 h-5" />
        {t.addToCalendar}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
            {calendarOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <a
                  key={index}
                  href={option.url}
                  target={option.download ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  download={option.download}
                  className={`flex items-center gap-3 px-4 py-3 text-[#4A4A4A] transition-colors ${option.color} border-b border-gray-50 last:border-b-0`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{option.name}</span>
                  {!option.download && <ExternalLink className="w-4 h-4 ml-auto opacity-50" />}
                </a>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AddToCalendar;
