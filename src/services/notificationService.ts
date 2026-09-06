/**
 * Notification Service for SVT Platform
 * Dispatches real-time email alerts to sallumrazak@gmail.com on:
 * 1. Website visits (new visitor arrival / page navigation)
 * 2. Volunteer sign-ins (member logins & registrations)
 */

export interface VisitorNotificationPayload {
  page?: string;
  referrer?: string;
  userAgent?: string;
  language?: string;
  timezone?: string;
  screenWidth?: number;
  screenHeight?: number;
  userEmail?: string;
  userName?: string;
  timestamp?: string;
}

export interface VolunteerSignInPayload {
  name: string;
  email: string;
  uid: string;
  role?: string;
  status?: string;
  customBadge?: string;
  region?: string;
  photoURL?: string;
  timestamp?: string;
}

export interface NotificationStatusResponse {
  recipient: string;
  smtpConfigured: boolean;
  smtpHost: string;
  smtpUser: string;
  totalLogsCount: number;
  recentLogs: Array<{
    id: string;
    type: string;
    recipient: string;
    subject: string;
    summary: string;
    timestamp: string;
    emailDispatched: boolean;
  }>;
}

/**
 * Send visitor arrival alert to the backend notification server
 */
export async function notifyVisitorArrival(payload: VisitorNotificationPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/notify-visitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString()
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || `HTTP ${res.status}` };
    }

    return await res.json();
  } catch (err: any) {
    console.warn('Notice: Visitor notification could not reach server (offline or preview):', err);
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * Send volunteer sign-in alert to the backend notification server
 */
export async function notifyVolunteerSignIn(payload: VolunteerSignInPayload): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/notify-volunteer-signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        timestamp: payload.timestamp || new Date().toISOString()
      })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || `HTTP ${res.status}` };
    }

    return await res.json();
  } catch (err: any) {
    console.warn('Notice: Volunteer sign-in notification could not reach server:', err);
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * Send a verification test email to sallumrazak@gmail.com
 */
export async function sendTestNotificationEmail(recipient?: string): Promise<{ success: boolean; recipient?: string; error?: string }> {
  try {
    const res = await fetch('/api/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || `HTTP ${res.status}` };
    }

    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

/**
 * Fetch current notification configuration and recent logs
 */
export async function fetchNotificationStatus(): Promise<NotificationStatusResponse | null> {
  try {
    const res = await fetch('/api/notification-status');
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Notice: Could not fetch notification status:', err);
    return null;
  }
}
