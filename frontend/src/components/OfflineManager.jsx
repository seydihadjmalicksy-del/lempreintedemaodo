/**
 * Offline Manager Component
 * Provides UI for managing offline content and downloads
 */
import { useState, useEffect } from "react";
import { Download, Wifi, WifiOff, HardDrive, Trash2, Check, Loader2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const OfflineManager = () => {
  const { language } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cacheStatus, setCacheStatus] = useState({ media: 0, api: 0, static: 0 });
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showPanel, setShowPanel] = useState(false);

  const translations = {
    fr: {
      title: "Mode Hors-ligne",
      online: "En ligne",
      offline: "Hors ligne",
      cachedFiles: "Fichiers en cache",
      media: "Médias (audio)",
      api: "Données API",
      static: "Pages",
      downloadAll: "Télécharger pour hors-ligne",
      downloading: "Téléchargement...",
      clearCache: "Vider le cache média",
      cacheCleared: "Cache vidé",
      downloadComplete: "Téléchargement terminé",
      offlineReady: "Contenu disponible hors-ligne"
    },
    en: {
      title: "Offline Mode",
      online: "Online",
      offline: "Offline",
      cachedFiles: "Cached Files",
      media: "Media (audio)",
      api: "API Data",
      static: "Pages",
      downloadAll: "Download for offline",
      downloading: "Downloading...",
      clearCache: "Clear media cache",
      cacheCleared: "Cache cleared",
      downloadComplete: "Download complete",
      offlineReady: "Content available offline"
    },
    ar: {
      title: "وضع عدم الاتصال",
      online: "متصل",
      offline: "غير متصل",
      cachedFiles: "الملفات المخزنة",
      media: "الوسائط (صوت)",
      api: "بيانات API",
      static: "الصفحات",
      downloadAll: "تحميل للاستخدام دون اتصال",
      downloading: "جاري التحميل...",
      clearCache: "مسح ذاكرة الوسائط",
      cacheCleared: "تم مسح الذاكرة",
      downloadComplete: "اكتمل التحميل",
      offlineReady: "المحتوى متاح دون اتصال"
    },
    wo: {
      title: "Mode Hors-ligne",
      online: "Am connexion",
      offline: "Amul connexion",
      cachedFiles: "Fichiers yi ñu denc",
      media: "Média (audio)",
      api: "Données API",
      static: "Xët yi",
      downloadAll: "Yéegal ngir hors-ligne",
      downloading: "Yéegal...",
      clearCache: "Sanc cache média",
      cacheCleared: "Cache bi sancu na",
      downloadComplete: "Yéegal metti na",
      offlineReady: "Contenu bi am na ci hors-ligne"
    }
  };

  const t = translations[language] || translations.fr;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Get initial cache status
    getCacheStatus();

    // Listen for service worker messages
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
    };
  }, []);

  const handleServiceWorkerMessage = (event) => {
    if (event.data.type === 'CACHE_STATUS') {
      setCacheStatus({
        media: event.data.media,
        api: event.data.api,
        static: event.data.static
      });
    }
    if (event.data.type === 'API_PRECACHED') {
      setDownloadProgress(100);
      setIsDownloading(false);
    }
    if (event.data.type === 'MEDIA_CACHE_CLEARED') {
      getCacheStatus();
    }
  };

  const getCacheStatus = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'GET_CACHE_STATUS' });
    }
  };

  const downloadForOffline = async () => {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);

    // Request API pre-caching
    navigator.serviceWorker.controller.postMessage({ type: 'PRECACHE_API' });
    
    // Simulate progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);
  };

  const clearMediaCache = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_MEDIA_CACHE' });
    }
  };

  return (
    <>
      {/* Floating offline indicator */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`fixed bottom-4 left-4 z-40 p-3 rounded-full shadow-lg transition-all ${
          isOnline 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-orange-500 hover:bg-orange-600 animate-pulse'
        }`}
        title={isOnline ? t.online : t.offline}
        data-testid="offline-indicator"
      >
        {isOnline ? (
          <Wifi className="w-5 h-5 text-white" />
        ) : (
          <WifiOff className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Offline management panel */}
      {showPanel && (
        <div className="fixed bottom-20 left-4 z-40 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-[#004D33] text-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                {t.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                isOnline ? 'bg-green-500' : 'bg-orange-500'
              }`}>
                {isOnline ? t.online : t.offline}
              </span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Cache status */}
            <div>
              <h4 className="text-sm font-semibold text-[#004D33] mb-2">{t.cachedFiles}</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#E8F5E9] rounded-lg p-2">
                  <div className="text-lg font-bold text-[#004D33]">{cacheStatus.media}</div>
                  <div className="text-xs text-[#4A4A4A]">{t.media}</div>
                </div>
                <div className="bg-[#E8F5E9] rounded-lg p-2">
                  <div className="text-lg font-bold text-[#004D33]">{cacheStatus.api}</div>
                  <div className="text-xs text-[#4A4A4A]">{t.api}</div>
                </div>
                <div className="bg-[#E8F5E9] rounded-lg p-2">
                  <div className="text-lg font-bold text-[#004D33]">{cacheStatus.static}</div>
                  <div className="text-xs text-[#4A4A4A]">{t.static}</div>
                </div>
              </div>
            </div>

            {/* Download progress */}
            {isDownloading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#4A4A4A]">{t.downloading}</span>
                  <span className="text-[#004D33] font-semibold">{downloadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#D4AF37] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Download complete indicator */}
            {downloadProgress === 100 && !isDownloading && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded-lg">
                <Check className="w-5 h-5" />
                <span className="text-sm">{t.offlineReady}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={downloadForOffline}
                disabled={isDownloading || !isOnline}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#004D33] hover:bg-[#003d29] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="download-offline-btn"
              >
                {isDownloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Download className="w-5 h-5" />
                )}
                {isDownloading ? t.downloading : t.downloadAll}
              </button>

              <button
                onClick={clearMediaCache}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                data-testid="clear-cache-btn"
              >
                <Trash2 className="w-4 h-4" />
                {t.clearCache}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OfflineManager;
