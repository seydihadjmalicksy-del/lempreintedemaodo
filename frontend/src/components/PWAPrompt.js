import { useState } from 'react';
import { Bell, BellOff, Download, Wifi, WifiOff, X } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

const PWAPrompt = () => {
  const { language } = useLanguage();
  const {
    isInstallable,
    isInstalled,
    isOnline,
    notificationPermission,
    isSubscribed,
    installApp,
    subscribeToPush,
    unsubscribeFromPush
  } = usePWA();
  
  const [showPrompt, setShowPrompt] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const labels = {
    fr: {
      installTitle: "Installer l'application",
      installDesc: "Accédez rapidement à Tivaouane depuis votre écran d'accueil",
      install: "Installer",
      notifyTitle: "Notifications",
      notifyDesc: "Recevez les alertes pour les événements importants",
      enable: "Activer",
      disable: "Désactiver",
      enabled: "Activées",
      disabled: "Désactivées",
      offline: "Mode hors ligne",
      online: "En ligne",
      installed: "Application installée",
      close: "Fermer"
    },
    en: {
      installTitle: "Install App",
      installDesc: "Quick access to Tivaouane from your home screen",
      install: "Install",
      notifyTitle: "Notifications",
      notifyDesc: "Receive alerts for important events",
      enable: "Enable",
      disable: "Disable",
      enabled: "Enabled",
      disabled: "Disabled",
      offline: "Offline mode",
      online: "Online",
      installed: "App installed",
      close: "Close"
    },
    ar: {
      installTitle: "تثبيت التطبيق",
      installDesc: "وصول سريع إلى تيفاوان من شاشتك الرئيسية",
      install: "تثبيت",
      notifyTitle: "الإشعارات",
      notifyDesc: "تلقي تنبيهات للأحداث المهمة",
      enable: "تفعيل",
      disable: "تعطيل",
      enabled: "مفعّلة",
      disabled: "معطّلة",
      offline: "وضع عدم الاتصال",
      online: "متصل",
      installed: "التطبيق مثبت",
      close: "إغلاق"
    },
    wo: {
      installTitle: "Installer application bi",
      installDesc: "Accès gaaw ci Tivaouane ci sa écran d'accueil",
      install: "Installer",
      notifyTitle: "Notifications",
      notifyDesc: "Am alertes ci événements yu am solo",
      enable: "Tëkki",
      disable: "Fay",
      enabled: "Tëkki na",
      disabled: "Fay na",
      offline: "Mode hors ligne",
      online: "En ligne",
      installed: "Application bi install na",
      close: "Tëj"
    }
  };

  const t = labels[language] || labels.fr;

  const handleInstall = async () => {
    setIsLoading(true);
    const success = await installApp();
    setIsLoading(false);
    
    if (success) {
      toast.success(t.installed);
      setShowPrompt(false);
    }
  };

  const handleNotificationToggle = async () => {
    setIsLoading(true);
    
    if (isSubscribed) {
      const success = await unsubscribeFromPush();
      if (success) {
        toast.success(language === 'en' ? 'Notifications disabled' : 'Notifications désactivées');
      }
    } else {
      const success = await subscribeToPush(language);
      if (success) {
        toast.success(language === 'en' ? 'Notifications enabled!' : 'Notifications activées !');
      } else {
        toast.error(language === 'en' ? 'Could not enable notifications' : 'Impossible d\'activer les notifications');
      }
    }
    
    setIsLoading(false);
  };

  // Don't show if installed and subscribed
  if (isInstalled && isSubscribed) return null;
  
  // Don't show if user closed the prompt
  if (!showPrompt) return null;

  // Don't show if nothing to offer
  if (!isInstallable && notificationPermission === 'denied') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm" data-testid="pwa-prompt">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004D33] to-[#003d29] p-4 text-white relative">
          <button
            onClick={() => setShowPrompt(false)}
            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          {/* Online Status */}
          <div className="flex items-center gap-2 text-sm mb-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400">{t.online}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">{t.offline}</span>
              </>
            )}
          </div>
          
          <h3 className="font-bold">L'empreinte de Maodo</h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Install Prompt */}
          {isInstallable && !isInstalled && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#E8F5E9] rounded-full flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-[#004D33]" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#004D33] text-sm">{t.installTitle}</h4>
                <p className="text-xs text-[#888888] mb-2">{t.installDesc}</p>
                <button
                  onClick={handleInstall}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-[#004D33] hover:bg-[#003d29] text-white text-xs rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {t.install}
                </button>
              </div>
            </div>
          )}

          {/* Notification Prompt */}
          {notificationPermission !== 'denied' && (
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isSubscribed ? 'bg-[#D4AF37]/20' : 'bg-[#E8F5E9]'
              }`}>
                {isSubscribed ? (
                  <Bell className="w-5 h-5 text-[#D4AF37]" />
                ) : (
                  <BellOff className="w-5 h-5 text-[#004D33]" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-[#004D33] text-sm">{t.notifyTitle}</h4>
                <p className="text-xs text-[#888888] mb-2">{t.notifyDesc}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleNotificationToggle}
                    disabled={isLoading}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors disabled:opacity-50 ${
                      isSubscribed
                        ? 'bg-gray-100 hover:bg-gray-200 text-[#4A4A4A]'
                        : 'bg-[#D4AF37] hover:bg-[#b8952e] text-[#004D33]'
                    }`}
                  >
                    {isSubscribed ? t.disable : t.enable}
                  </button>
                  <span className={`text-xs ${isSubscribed ? 'text-green-600' : 'text-[#888888]'}`}>
                    {isSubscribed ? t.enabled : t.disabled}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAPrompt;
