import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { language } = useLanguage();

  const translations = {
    fr: {
      title: "Installer l'application",
      description: "Installez L'empreinte de Maodo sur votre appareil pour un accès rapide et hors-ligne aux Khassaides.",
      install: "Installer",
      later: "Plus tard",
      iosTitle: "Installer sur iPhone/iPad",
      iosStep1: "Appuyez sur",
      iosStep2: "puis 'Sur l'écran d'accueil'",
      shareIcon: "Partager"
    },
    en: {
      title: "Install App",
      description: "Install The Legacy of Maodo on your device for quick access and offline Khassaides.",
      install: "Install",
      later: "Later",
      iosTitle: "Install on iPhone/iPad",
      iosStep1: "Tap",
      iosStep2: "then 'Add to Home Screen'",
      shareIcon: "Share"
    },
    ar: {
      title: "تثبيت التطبيق",
      description: "قم بتثبيت بصمة مودو على جهازك للوصول السريع والقصائد بدون إنترنت.",
      install: "تثبيت",
      later: "لاحقاً",
      iosTitle: "التثبيت على iPhone/iPad",
      iosStep1: "اضغط على",
      iosStep2: "ثم 'إضافة إلى الشاشة الرئيسية'",
      shareIcon: "مشاركة"
    },
    wo: {
      title: "Installer application bi",
      description: "Installer L'empreinte de Maodo ci sa telefon ngir am accès bu gaaw ak Khassaides offline.",
      install: "Installer",
      later: "Ginnaaw",
      iosTitle: "Installer ci iPhone/iPad",
      iosStep1: "Bës ci",
      iosStep2: "ba 'Sur l'écran d'accueil'",
      shareIcon: "Partager"
    }
  };

  const t = translations[language] || translations.fr;

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 30 seconds or on second visit
      const hasVisited = localStorage.getItem('maodo-visited');
      if (hasVisited) {
        setTimeout(() => setShowPrompt(true), 5000);
      } else {
        localStorage.setItem('maodo-visited', 'true');
        setTimeout(() => setShowPrompt(true), 30000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show iOS prompt after delay
    if (isIOSDevice && !localStorage.getItem('maodo-ios-prompt-dismissed')) {
      setTimeout(() => setShowPrompt(true), 10000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('[PWA] App installed');
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    if (isIOS) {
      localStorage.setItem('maodo-ios-prompt-dismissed', 'true');
    }
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-slide-up"
      data-testid="pwa-install-prompt"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#004D33] to-[#006644] p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{t.title}</h3>
              <p className="text-white/80 text-sm">L'empreinte de Maodo</p>
            </div>
          </div>
          <button 
            onClick={handleDismiss}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {isIOS ? (
          // iOS instructions
          <div className="space-y-3">
            <p className="text-[#4A4A4A] text-sm">{t.iosTitle}</p>
            <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
              <span>{t.iosStep1}</span>
              <div className="w-8 h-8 bg-[#007AFF] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <span>{t.iosStep2}</span>
            </div>
            <button
              onClick={handleDismiss}
              className="w-full py-3 bg-[#E8F5E9] text-[#004D33] rounded-xl font-semibold hover:bg-[#d4e8d7] transition-colors"
            >
              {t.later}
            </button>
          </div>
        ) : (
          // Android/Desktop install
          <div className="space-y-4">
            <p className="text-[#4A4A4A] text-sm">{t.description}</p>
            <div className="flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 py-3 bg-gray-100 text-[#4A4A4A] rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                {t.later}
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 py-3 bg-[#004D33] text-white rounded-xl font-semibold hover:bg-[#003d29] transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {t.install}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="px-4 pb-4">
        <div className="flex gap-4 text-xs text-[#888]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Hors-ligne
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Notifications
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Rapide
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PWAInstallPrompt;
