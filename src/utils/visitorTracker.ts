import { notifyVisitorArrival } from '../services/notificationService';
import { auth } from '../firebase';

/**
 * Helper to retrieve known user email on this device
 */
export function getDetectedUserEmail(): { email: string; name: string } {
  try {
    // 1. Check active Firebase auth instance
    if (auth.currentUser?.email) {
      return {
        email: auth.currentUser.email,
        name: auth.currentUser.displayName || ''
      };
    }

    // 2. Check local storage cache
    const cachedEmail = localStorage.getItem('svt_saved_user_email');
    const cachedName = localStorage.getItem('svt_saved_user_name');
    if (cachedEmail) {
      return {
        email: cachedEmail,
        name: cachedName || ''
      };
    }

    // 3. Check Firebase indexed/stored key in localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('firebase:authUser:')) {
        const itemStr = localStorage.getItem(key);
        if (itemStr) {
          const parsed = JSON.parse(itemStr);
          if (parsed && parsed.email) {
            return {
              email: parsed.email,
              name: parsed.displayName || ''
            };
          }
        }
      }
    }
  } catch (err) {
    // ignore
  }

  return { email: '', name: '' };
}

/**
 * Track and send instant email notification every time someone opens the app on any device
 */
export function trackVisitorArrival(pageName: string = window.location.pathname || '/') {
  try {
    const detected = getDetectedUserEmail();

    // Prepare full visitor metadata
    const payload = {
      page: pageName + (window.location.hash ? window.location.hash : ''),
      referrer: document.referrer || 'Direct / Link Click',
      userAgent: navigator.userAgent || 'Unknown Device',
      language: navigator.language || 'en-US',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      screenWidth: window.innerWidth || window.screen?.width,
      screenHeight: window.innerHeight || window.screen?.height,
      userEmail: detected.email || undefined,
      userName: detected.name || undefined,
      timestamp: new Date().toISOString()
    };

    // Dispatch async notification without blocking UI
    notifyVisitorArrival(payload);
  } catch (err) {
    console.warn('Visitor notification notice:', err);
  }
}

