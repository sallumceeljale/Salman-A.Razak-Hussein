import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for recent notifications audit trail
interface NotificationLog {
  id: string;
  type: 'visitor' | 'volunteer_signin' | 'test';
  recipient: string;
  subject: string;
  summary: string;
  details: Record<string, any>;
  timestamp: string;
  emailDispatched: boolean;
  error?: string;
}

const recentNotifications: NotificationLog[] = [];

// Helper to get admin notification email
const getAdminEmail = () => {
  return process.env.ADMIN_NOTIFICATION_EMAIL || 'sallumrazak@gmail.com';
};

// Create Nodemailer Transporter with fallback support
function getValidSmtpConfig() {
  let host = (process.env.SMTP_HOST || '').trim();
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = (process.env.SMTP_USER || process.env.ADMIN_NOTIFICATION_EMAIL || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();

  // If host is a placeholder like 'svt' or has no dot and is not localhost, check if user is gmail
  const isValidHost = host === 'localhost' || (host.includes('.') && !host.includes(' '));
  if (!isValidHost) {
    if (user.endsWith('@gmail.com')) {
      host = 'smtp.gmail.com';
    } else if (!host) {
      host = 'smtp.gmail.com';
    } else {
      // Unusable host format
      return null;
    }
  }

  // Check that credentials are not trivial placeholder strings
  if (!user || !pass || user.length < 3 || pass.length < 3) {
    return null;
  }

  return { host, port, secure, user, pass };
}

function createEmailTransporter() {
  const config = getValidSmtpConfig();
  if (!config) return null;

  try {
    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
      tls: {
        rejectUnauthorized: false
      }
    });
  } catch (err: any) {
    console.warn('[SMTP Config Warning] Could not initialize transporter:', err?.message || err);
    return null;
  }
}

// Ultra-reliable multi-channel email dispatch (Direct HTTP Relay + SMTP)
async function dispatchEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  userGmail?: string;
  details?: Record<string, any>;
}) {
  const targetEmail = options.to || 'sallumrazak@gmail.com';
  let httpRelaySuccess = false;
  let smtpSuccess = false;
  let errorMsg = '';

  // 1. Direct HTTP Email Relay (guaranteed delivery without manual SMTP configuration)
  try {
    const relayResponse = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: options.subject,
        _template: 'table',
        _captcha: 'false',
        Notification: 'Someone opened the app',
        Visitor_Gmail: options.userGmail || 'Guest visitor (Not logged in)',
        Details: options.text,
        Time: new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
        ...(options.details || {})
      })
    });

    if (relayResponse.ok) {
      httpRelaySuccess = true;
      console.log(`[Direct Email Relay] Successfully dispatched alert to ${targetEmail}`);
    } else {
      const errTxt = await relayResponse.text().catch(() => '');
      console.warn(`[Direct Email Relay Warning] HTTP ${relayResponse.status}: ${errTxt}`);
    }
  } catch (relayErr: any) {
    console.warn('[Direct Email Relay Error]', relayErr?.message || relayErr);
    errorMsg = relayErr?.message || String(relayErr);
  }

  // 2. SMTP Transporter (if configured and valid)
  const transporter = createEmailTransporter();
  if (transporter) {
    try {
      const from = process.env.SMTP_FROM || `SVT Notification System <${process.env.SMTP_USER || targetEmail}>`;
      const info = await transporter.sendMail({
        from,
        to: targetEmail,
        subject: options.subject,
        text: options.text,
        html: options.html
      });
      smtpSuccess = true;
      console.log(`[SMTP Email Sent] MessageId: ${info.messageId} to ${targetEmail}`);
    } catch (smtpErr: any) {
      console.warn('[SMTP Dispatch Notice] Direct SMTP delivery bypassed:', smtpErr?.message || smtpErr);
      if (!httpRelaySuccess) errorMsg = smtpErr?.message || String(smtpErr);
    }
  }

  const overallSuccess = httpRelaySuccess || smtpSuccess;
  return {
    success: overallSuccess,
    httpRelaySuccess,
    smtpSuccess,
    error: overallSuccess ? undefined : errorMsg
  };
}

// API Route: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// API Route: Get notification settings & status
app.get('/api/notification-status', (req, res) => {
  const adminEmail = getAdminEmail();
  const validConfig = getValidSmtpConfig();

  res.json({
    recipient: adminEmail,
    smtpConfigured: !!validConfig,
    smtpHost: validConfig?.host || process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpUser: validConfig?.user ? `${validConfig.user.slice(0, 3)}***` : '(Not configured)',
    totalLogsCount: recentNotifications.length,
    recentLogs: recentNotifications.slice(0, 30)
  });
});

// API Route: Notify on website visitor
app.post('/api/notify-visitor', async (req, res) => {
  try {
    const {
      page = '/',
      referrer = 'Direct Visit',
      userAgent = 'Unknown Device',
      language = 'en',
      timezone = 'UTC',
      screenWidth,
      screenHeight,
      userEmail,
      userName,
      timestamp = new Date().toISOString()
    } = req.body || {};

    const adminEmail = getAdminEmail();
    const formattedDate = new Date().toLocaleString('en-US', {
      timeZone: timezone !== 'UTC' ? timezone : undefined,
      dateStyle: 'full',
      timeStyle: 'long'
    });

    const visitorGmailStr = userEmail ? userEmail : 'Guest visitor (Not signed in with Gmail yet)';
    const subject = userEmail 
      ? `Someone opened the app, here is his gmail: ${userEmail}`
      : `Someone opened the app (Website Visit)`;

    const text = `Someone opened the app.
Here is his gmail: ${visitorGmailStr}
${userName ? `User Name: ${userName}\n` : ''}Page: ${page}
Device / Browser: ${userAgent}
Referrer: ${referrer}
Time: ${formattedDate}
Location / Timezone: ${timezone} (${language})
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 28px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
    .badge { display: inline-block; padding: 4px 12px; background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px; }
    h1 { margin: 0 0 8px 0; font-size: 20px; color: #ffffff; font-weight: 700; }
    p.highlight { font-size: 16px; color: #38bdf8; font-weight: bold; margin: 12px 0; padding: 12px; background: rgba(56, 189, 248, 0.1); border-radius: 8px; border-left: 4px solid #38bdf8; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
    .info-table td { padding: 10px 14px; border-bottom: 1px solid #334155; }
    .info-table td.label { color: #94a3b8; font-weight: 500; width: 35%; background: rgba(15, 23, 42, 0.4); }
    .info-table td.value { color: #f1f5f9; font-weight: 600; }
    .footer { text-align: center; margin-top: 24px; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🌐 Website Alert</div>
    <h1>Someone opened the app</h1>
    <p class="highlight">Here is his gmail: <strong>${visitorGmailStr}</strong></p>
    
    <table class="info-table">
      <tr>
        <td class="label">Gmail / Account</td>
        <td class="value"><span style="color: #38bdf8;">${visitorGmailStr}</span></td>
      </tr>
      ${userName ? `<tr><td class="label">Display Name</td><td class="value">${userName}</td></tr>` : ''}
      <tr>
        <td class="label">Page Visited</td>
        <td class="value">${page}</td>
      </tr>
      <tr>
        <td class="label">Time Opened</td>
        <td class="value">${formattedDate}</td>
      </tr>
      <tr>
        <td class="label">Device & Browser</td>
        <td class="value" style="font-size: 12px; color: #cbd5e1;">${userAgent}</td>
      </tr>
      <tr>
        <td class="label">Traffic Source</td>
        <td class="value">${referrer}</td>
      </tr>
    </table>

    <div class="footer">
      Sent to <strong>${adminEmail}</strong> • SVT Real-Time Notifications
    </div>
  </div>
</body>
</html>
`;

    const dispatchResult = await dispatchEmail({
      to: adminEmail,
      subject,
      text,
      html,
      userGmail: visitorGmailStr,
      details: {
        page,
        userAgent,
        referrer,
        time: formattedDate
      }
    });

    const logEntry: NotificationLog = {
      id: `vis_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: 'visitor',
      recipient: adminEmail,
      subject,
      summary: `Someone opened the app. Gmail: ${visitorGmailStr}`,
      details: { page, referrer, userAgent, userEmail: visitorGmailStr, language, timezone },
      timestamp: new Date().toISOString(),
      emailDispatched: dispatchResult.success,
      error: dispatchResult.error
    };
    recentNotifications.unshift(logEntry);
    if (recentNotifications.length > 100) recentNotifications.pop();

    res.json({ success: true, logged: true, dispatchResult });
  } catch (err: any) {
    console.error('Error in /api/notify-visitor:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Route: Notify on volunteer sign in
app.post('/api/notify-volunteer-signin', async (req, res) => {
  try {
    const {
      name = 'Volunteer Member',
      email = 'Unknown Email',
      uid = 'unknown_uid',
      role = 'member',
      status = 'active',
      customBadge = '',
      region = 'Global',
      timestamp = new Date().toISOString()
    } = req.body || {};

    const adminEmail = getAdminEmail();
    const formattedDate = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    });

    const subject = `Someone opened the app and signed in, here is his gmail: ${email}`;
    const text = `Someone opened the app and signed in as a volunteer.
Here is his gmail: ${email}
Name: ${name}
Role: ${role}
Status: ${status}
UID: ${uid}
Time: ${formattedDate}
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 28px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); }
    .badge { display: inline-block; padding: 4px 12px; background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px; }
    h1 { margin: 0 0 8px 0; font-size: 20px; color: #ffffff; font-weight: 700; }
    p.highlight { font-size: 16px; color: #34d399; font-weight: bold; margin: 12px 0; padding: 12px; background: rgba(52, 211, 153, 0.1); border-radius: 8px; border-left: 4px solid #34d399; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
    .info-table td { padding: 10px 14px; border-bottom: 1px solid #334155; }
    .info-table td.label { color: #94a3b8; font-weight: 500; width: 35%; background: rgba(15, 23, 42, 0.4); }
    .info-table td.value { color: #f1f5f9; font-weight: 600; }
    .footer { text-align: center; margin-top: 24px; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🤝 Volunteer Signed In</div>
    <h1>Someone opened the app and signed in</h1>
    <p class="highlight">Here is his gmail: <strong>${email}</strong></p>
    
    <table class="info-table">
      <tr>
        <td class="label">Gmail / Email</td>
        <td class="value"><span style="color: #34d399;">${email}</span></td>
      </tr>
      <tr>
        <td class="label">Name</td>
        <td class="value">${name}</td>
      </tr>
      <tr>
        <td class="label">Role</td>
        <td class="value"><span style="text-transform: capitalize;">${role}</span></td>
      </tr>
      <tr>
        <td class="label">Status</td>
        <td class="value"><span style="text-transform: capitalize;">${status}</span></td>
      </tr>
      <tr>
        <td class="label">Sign-in Time</td>
        <td class="value">${formattedDate}</td>
      </tr>
    </table>

    <div class="footer">
      Sent to <strong>${adminEmail}</strong> • SVT Real-Time Notifications
    </div>
  </div>
</body>
</html>
`;

    const dispatchResult = await dispatchEmail({
      to: adminEmail,
      subject,
      text,
      html,
      userGmail: email,
      details: {
        name,
        role,
        status,
        time: formattedDate
      }
    });

    const logEntry: NotificationLog = {
      id: `sgn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: 'volunteer_signin',
      recipient: adminEmail,
      subject,
      summary: `Someone opened and signed in. Gmail: ${email} (${name})`,
      details: { name, email, uid, role, status, customBadge, region },
      timestamp: new Date().toISOString(),
      emailDispatched: dispatchResult.success,
      error: dispatchResult.error
    };
    recentNotifications.unshift(logEntry);
    if (recentNotifications.length > 100) recentNotifications.pop();

    res.json({ success: true, logged: true, dispatchResult });
  } catch (err: any) {
    console.error('Error in /api/notify-volunteer-signin:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// API Route: Send Test Notification
app.post('/api/test-email', async (req, res) => {
  try {
    const adminEmail = req.body?.recipient || getAdminEmail();
    const formattedDate = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    });

    const subject = `🧪 SVT Notification System Test (${formattedDate})`;
    const text = `
This is a test notification from The Scholars Volunteer Team (SVT) notification system.
Email alerts for website visitors and volunteer sign-ins are successfully active for: ${adminEmail}
Timestamp: ${formattedDate}
`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; margin: 0; padding: 24px; }
    .card { max-width: 600px; margin: 0 auto; background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 28px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); text-align: center; }
    .badge { display: inline-block; padding: 4px 12px; background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 16px; }
    h1 { margin: 0 0 8px 0; font-size: 22px; color: #ffffff; font-weight: 700; }
    p { color: #94a3b8; font-size: 14px; line-height: 1.6; }
    .status-box { background: rgba(15, 23, 42, 0.5); border: 1px solid #334155; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: left; }
    .footer { margin-top: 24px; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✓ Verification Test</div>
    <h1>Email Notifications Active</h1>
    <p>Your SVT notification dispatch pipeline is active and configured to alert <strong>${adminEmail}</strong> whenever someone visits the website or signs in as a volunteer.</p>
    
    <div class="status-box">
      <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px;"><strong>Target Recipient:</strong> ${adminEmail}</div>
      <div style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px;"><strong>Visitor Alerts:</strong> Enabled</div>
      <div style="font-size: 13px; color: #cbd5e1;"><strong>Volunteer Sign-in Alerts:</strong> Enabled</div>
    </div>

    <div class="footer">
      The Scholars Volunteer Team (SVT) • Founder: Salman A.Razak
    </div>
  </div>
</body>
</html>
`;

    const dispatchResult = await dispatchEmail({
      to: adminEmail,
      subject,
      text,
      html
    });

    const logEntry: NotificationLog = {
      id: `tst_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type: 'test',
      recipient: adminEmail,
      subject,
      summary: `Test notification dispatched to ${adminEmail}`,
      details: { sentTo: adminEmail, test: true },
      timestamp: new Date().toISOString(),
      emailDispatched: dispatchResult.success,
      error: dispatchResult.error
    };
    recentNotifications.unshift(logEntry);

    res.json({ success: true, dispatchResult, recipient: adminEmail });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server and mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SVT Server] Server listening on http://0.0.0.0:${PORT} (Notification email: ${getAdminEmail()})`);
  });
}

startServer();
