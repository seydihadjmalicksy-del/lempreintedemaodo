import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// VAPID public key (would be from environment in production)
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Check if app is installed
  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIosStandalone = window.navigator.standalone === true;
      setIsInstalled(isStandalone || isIosStandalone);
    };
    
    checkInstalled();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkInstalled);
    
    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkInstalled);
    };
  }, []);

  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Listen for online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
          
          // Check for existing subscription
          registration.pushManager.getSubscription()
            .then((subscription) => {
              setIsSubscribed(!!subscription);
            });
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Install app
  const installApp = useCallback(async () => {
    if (!deferredPrompt) return false;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    setDeferredPrompt(null);
    setIsInstallable(false);
    
    return outcome === 'accepted';
  }, [deferredPrompt]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      console.log('Notifications not supported');
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    return permission === 'granted';
  }, []);

  // Subscribe to push notifications
  const subscribeToPush = useCallback(async (language = 'fr') => {
    try {
      // Request permission first
      const permission = await requestNotificationPermission();
      if (!permission) return false;

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;
      
      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      // Send subscription to server
      await axios.post(`${API}/notifications/subscribe`, {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
          auth: arrayBufferToBase64(subscription.getKey('auth'))
        },
        user_agent: navigator.userAgent,
        language
      });

      setIsSubscribed(true);
      return true;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return false;
    }
  }, [requestNotificationPermission]);

  // Unsubscribe from push notifications
  const unsubscribeFromPush = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        await axios.post(`${API}/notifications/unsubscribe`, {
          endpoint: subscription.endpoint
        });
      }

      setIsSubscribed(false);
      return true;
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      return false;
    }
  }, []);

  // Show local notification (for testing)
  const showNotification = useCallback((title, options = {}) => {
    if (notificationPermission !== 'granted') return false;

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body: options.body || '',
          icon: options.icon || '/logo192.png',
          badge: '/logo192.png',
          tag: options.tag || 'tivaouane',
          ...options
        });
      });
      return true;
    }

    // Fallback to Notification API
    new Notification(title, options);
    return true;
  }, [notificationPermission]);

  return {
    isInstallable,
    isInstalled,
    isOnline,
    notificationPermission,
    isSubscribed,
    installApp,
    requestNotificationPermission,
    subscribeToPush,
    unsubscribeFromPush,
    showNotification
  };
};

// Helper functions
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export default usePWA;
