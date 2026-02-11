import { useState, useEffect } from 'react';
import { Download, X, Wifi, WifiOff, Bell, BellOff, Share, Plus, MoreVertical, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import usePWA from '../hooks/usePWA';
import { useLanguage } from '../contexts/LanguageContext';

const PWAPrompt = () => {
  const { 
    isInstallable, 
    isInstalled, 
    isOnline, 
    installApp,
    isSubscribed,
    subscribeToPush,
    unsubscribeFromPush,
    notificationPermission
  } = usePWA();
  
  const [showPrompt, setShowPrompt] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { language } = useLanguage();

  // Detect device type
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;
  const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

  const labels = {
    fr: {
      installTitle: "Installer l'application",
      installDesc: "Accédez rapidement depuis votre écran d'accueil",
      install: "Installer",
      howToInstall: "Comment installer ?",
      notifyTitle: "Activer les notifications",
      notifyDesc: "Recevez les alertes pour les événements importants",
      enable: "Activer",
      disable: "Désactiver",
      online: "En ligne",
      offline: "Hors ligne",
      installed: "Application installée !",
      close: "Fermer",
      // iOS Instructions
      iosTitle: "Installation sur iPhone/iPad",
      iosStep1: "Appuyez sur le bouton",
      iosStep2: "Partager",
      iosStep3: "Puis sélectionnez",
      iosStep4: "Sur l'écran d'accueil",
      // Android Instructions
      androidTitle: "Installation sur Android",
      androidStep1: "Appuyez sur le menu",
      androidStep2: "en haut à droite",
      androidStep3: "Puis sélectionnez",
      androidStep4: "Installer l'application",
      // Desktop Instructions
      desktopTitle: "Installation sur PC",
      desktopStep1: "Cliquez sur l'icône",
      desktopStep2: "dans la barre d'adresse",
      desktopStep3: "Ou menu → Installer",
      gotIt: "Compris !",
      back: "Retour"
    },
    en: {
      installTitle: "Install App",
      installDesc: "Quick access from your home screen",
      install: "Install",
      howToInstall: "How to install?",
      notifyTitle: "Enable Notifications",
      notifyDesc: "Get alerts for important events",
      enable: "Enable",
      disable: "Disable",
      online: "Online",
      offline: "Offline",
      installed: "App installed!",
      close: "Close",
      iosTitle: "Install on iPhone/iPad",
      iosStep1: "Tap the",
      iosStep2: "Share",
      iosStep3: "Then select",
      iosStep4: "Add to Home Screen",
      androidTitle: "Install on Android",
      androidStep1: "Tap the menu",
      androidStep2: "at top right",
      androidStep3: "Then select",
      androidStep4: "Install app",
      desktopTitle: "Install on PC",
      desktopStep1: "Click the icon",
      desktopStep2: "in the address bar",
      desktopStep3: "Or menu → Install",
      gotIt: "Got it!",
      back: "Back"
    },
    ar: {
      installTitle: "تثبيت التطبيق",
      installDesc: "وصول سريع من شاشتك الرئيسية",
      install: "تثبيت",
      howToInstall: "كيفية التثبيت؟",
      notifyTitle: "تفعيل الإشعارات",
      notifyDesc: "تلقي تنبيهات للأحداث المهمة",
      enable: "تفعيل",
      disable: "إلغاء",
      online: "متصل",
      offline: "غير متصل",
      installed: "تم تثبيت التطبيق!",
      close: "إغلاق",
      iosTitle: "التثبيت على iPhone/iPad",
      iosStep1: "اضغط على زر",
      iosStep2: "مشاركة",
      iosStep3: "ثم اختر",
      iosStep4: "إضافة إلى الشاشة الرئيسية",
      androidTitle: "التثبيت على Android",
      androidStep1: "اضغط على القائمة",
      androidStep2: "في أعلى اليمين",
      androidStep3: "ثم اختر",
      androidStep4: "تثبيت التطبيق",
      desktopTitle: "التثبيت على الكمبيوتر",
      desktopStep1: "انقر على الأيقونة",
      desktopStep2: "في شريط العنوان",
      desktopStep3: "أو القائمة ← تثبيت",
      gotIt: "فهمت!",
      back: "رجوع"
    },
    wo: {
      installTitle: "Installer application bi",
      installDesc: "Accès bu gaaw dale écran d'accueil",
      install: "Installer",
      howToInstall: "Nan la installer?",
      notifyTitle: "Activer notifications yi",
      notifyDesc: "Jot alerte yi ngir événement yu am solo",
      enable: "Activer",
      disable: "Désactiver",
      online: "En ligne",
      offline: "Hors ligne",
      installed: "Application bi install na!",
      close: "Tëj",
      iosTitle: "Installer ci iPhone/iPad",
      iosStep1: "Bës ci bouton bi",
      iosStep2: "Partager",
      iosStep3: "Ba tànn",
      iosStep4: "Sur l'écran d'accueil",
      androidTitle: "Installer ci Android",
      androidStep1: "Bës ci menu bi",
      androidStep2: "ci kow ndijoor",
      androidStep3: "Ba tànn",
      androidStep4: "Installer application",
      desktopTitle: "Installer ci PC",
      desktopStep1: "Bës ci icône bi",
      desktopStep2: "ci barre d'adresse bi",
      desktopStep3: "Walla menu → Installer",
      gotIt: "Dégg na!",
      back: "Déllu"
    }
  };

  const t = labels[language] || labels.fr;

  const handleInstall = async () => {
    if (isInstallable) {
      setIsLoading(true);
      const success = await installApp();
      setIsLoading(false);
      
      if (success) {
        toast.success(t.installed);
        setShowPrompt(false);
      }
    } else {
      // Show instructions if direct install not available
      setShowInstructions(true);
    }
  };

  const handleNotificationToggle = async () => {
    setIsLoading(true);
    
    if (isSubscribed) {
      await unsubscribeFromPush();
      toast.success(language === 'fr' ? 'Notifications désactivées' : 'Notifications disabled');
    } else {
      const success = await subscribeToPush(language);
      if (success) {
        toast.success(language === 'fr' ? 'Notifications activées !' : 'Notifications enabled!');
      }
    }
    
    setIsLoading(false);
  };

  // Don't show if already installed
  if (isInstalled) return null;
  
  // Don't show if user closed the prompt
  if (!showPrompt) return null;

  // Installation Instructions Modal
  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowInstructions(false)}>
        <div 
          className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#004D33] to-[#003d29] p-4 text-white">
            <div className="flex items-center gap-3">
              <Smartphone className="w-8 h-8" />
              <div>
                <h3 className="font-bold text-lg">
                  {isIOS ? t.iosTitle : isAndroid ? t.androidTitle : t.desktopTitle}
                </h3>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="p-6 space-y-6">
            {isIOS ? (
              // iOS Instructions
              <>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#007AFF] rounded-xl flex items-center justify-center">
                    <Share className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-[#004D33]">{t.iosStep1}</p>
                    <p className="text-[#D4AF37] font-bold">{t.iosStep2}</p>
                  </div>
                </div>
                <div className="border-l-2 border-dashed border-[#D4AF37] ml-6 h-4"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-[#004D33]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#004D33]">{t.iosStep3}</p>
                    <p className="text-[#D4AF37] font-bold">{t.iosStep4}</p>
                  </div>
                </div>
              </>
            ) : isAndroid ? (
              // Android Instructions
              <>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <MoreVertical className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <p className="font-medium text-[#004D33]">{t.androidStep1}</p>
                    <p className="text-[#888]">{t.androidStep2}</p>
                  </div>
                </div>
                <div className="border-l-2 border-dashed border-[#D4AF37] ml-6 h-4"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E8F5E9] rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-[#004D33]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#004D33]">{t.androidStep3}</p>
                    <p className="text-[#D4AF37] font-bold">{t.androidStep4}</p>
                  </div>
                </div>
              </>
            ) : (
              // Desktop Instructions
              <>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                    ⊕
                  </div>
                  <div>
                    <p className="font-medium text-[#004D33]">{t.desktopStep1}</p>
                    <p className="text-[#888]">{t.desktopStep2}</p>
                  </div>
                </div>
                <p className="text-center text-[#888]">{t.desktopStep3}</p>
              </>
            )}
          </div>

          {/* Button */}
          <div className="p-4 border-t">
            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-3 bg-[#004D33] hover:bg-[#003d29] text-white rounded-xl font-bold transition-colors"
            >
              {t.gotIt}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm" data-testid="pwa-prompt">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#004D33] to-[#003d29] p-4 text-white relative">
          <button
            onClick={() => setShowPrompt(false)}
            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label={t.close}
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
          {/* Install Section */}
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
                className="px-4 py-2 bg-[#004D33] hover:bg-[#003d29] text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isInstallable ? t.install : t.howToInstall}
              </button>
            </div>
          </div>

          {/* Notification Section */}
          {notificationPermission !== 'denied' && (
            <div className="flex items-start gap-3 pt-3 border-t">
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
                <button
                  onClick={handleNotificationToggle}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors disabled:opacity-50 ${
                    isSubscribed
                      ? 'bg-gray-100 text-[#4A4A4A] hover:bg-gray-200'
                      : 'bg-[#D4AF37] text-[#004D33] hover:bg-[#b8952e]'
                  }`}
                >
                  {isSubscribed ? t.disable : t.enable}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PWAPrompt;
