// Vercel serverless function — mirrors POST /api/notify in serve.mjs
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      type,
      customerName,
      customerEmail,
      customerPhone,
      subject,
      message,
      datetime,
      relatedId
    } = req.body || {};

    const ADMIN_EMAIL     = process.env.ADMIN_EMAIL;
    const RESEND_KEY      = process.env.RESEND_API_KEY;
    const RESEND_FROM     = process.env.RESEND_FROM || 'Sandou Kremas <onboarding@resend.dev>';
    const N8N_URL         = process.env.N8N_WEBHOOK_URL;
    const NTFY_TOPIC      = process.env.NTFY_TOPIC;
    const ADMIN_PANEL_URL = process.env.ADMIN_PANEL_URL || 'https://sandou-kremas.vercel.app/admin-site/';

    const typeLabels = { order: 'New Order', inquiry: 'New Inquiry', signup: 'New Subscriber' };
    const typeColors = { order: '#C9A84C', inquiry: '#81B2D4', signup: '#52B788' };
    const typeLabel  = typeLabels[type] || 'New Activity';
    const typeColor  = typeColors[type] || '#C9A84C';

    let emailSent    = false;
    let ntfySent     = false;
    let webhookFired = false;

    // ── 1. Email via Resend ─────────────────────────────────────────
    if (RESEND_KEY && ADMIN_EMAIL) {
      try {
        const emailRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: RESEND_FROM,
            to: [ADMIN_EMAIL],
            subject: `[Sandou] ${typeLabel}: ${customerName || customerEmail || 'Customer'}`,
            html: buildEmailHtml({
              typeLabel, typeColor,
              customerName, customerEmail, customerPhone,
              subject, message,
              datetime: datetime || new Date().toLocaleString('en-US'),
              adminPanelUrl: ADMIN_PANEL_URL
            })
          })
        });
        emailSent = emailRes.ok;
        if (!emailRes.ok) console.error('[notify] Resend error:', await emailRes.text());
      } catch (e) {
        console.error('[notify] Email error:', e.message);
      }
    }

    // ── 2. Phone push via ntfy.sh ───────────────────────────────────
    if (NTFY_TOPIC) {
      try {
        const tagMap      = { order: 'shopping_cart', inquiry: 'speech_balloon', signup: 'envelope' };
        const priorityMap = { order: 'high', inquiry: 'default', signup: 'low' };
        const lines       = [
          customerName  && `Name: ${customerName}`,
          customerEmail && `Email: ${customerEmail}`,
          customerPhone && `Phone: ${customerPhone}`,
          subject       && `Type: ${subject}`,
          message       && message.slice(0, 200),
          datetime      && `Time: ${datetime}`,
        ].filter(Boolean).join('\n');

        const ntfyRes = await fetch(`https://ntfy.sh/${encodeURIComponent(NTFY_TOPIC)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
            'Title':    `[Sandou] ${typeLabel}: ${customerName || customerEmail || 'Customer'}`,
            'Priority': priorityMap[type] || 'default',
            'Tags':     tagMap[type] || 'bell',
            'Actions':  `view, Open Admin Panel, ${ADMIN_PANEL_URL}`,
          },
          body: lines || typeLabel,
        });
        ntfySent = ntfyRes.ok;
        if (!ntfyRes.ok) console.error('[notify] ntfy error:', await ntfyRes.text());
      } catch (e) {
        console.error('[notify] ntfy error:', e.message);
      }
    }

    // ── 3. n8n webhook ─────────────────────────────────────────────
    if (N8N_URL) {
      try {
        await fetch(N8N_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            source: 'sandou-kremas', type,
            customerName:  customerName  || '',
            customerEmail: customerEmail || '',
            customerPhone: customerPhone || '',
            subject:       subject       || '',
            message:       message       || '',
            datetime:      datetime      || new Date().toISOString(),
            relatedId:     relatedId     || null
          })
        });
        webhookFired = true;
      } catch (e) {
        console.error('[notify] Webhook error:', e.message);
      }
    }

    res.json({ ok: true, emailSent, ntfySent, webhookFired });

  } catch (err) {
    console.error('[notify] Unhandled:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
};

function buildEmailHtml({ typeLabel, typeColor, customerName, customerEmail, customerPhone, subject, message, datetime, adminPanelUrl }) {
  const row = (label, value) => value ? `
    <tr><td style="padding:12px 0;border-bottom:1px solid rgba(201,168,76,0.08);">
      <div style="font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(242,238,228,0.35);margin-bottom:4px;">${label}</div>
      <div style="font-size:14px;color:#F2EEE4;line-height:1.5;">${esc(value)}</div>
    </td></tr>` : '';

  const msgRow = message ? `
    <tr><td style="padding:12px 0;border-bottom:1px solid rgba(201,168,76,0.08);">
      <div style="font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(242,238,228,0.35);margin-bottom:4px;">Message / Details</div>
      <div style="font-size:13px;color:rgba(242,238,228,0.75);line-height:1.7;">${esc(message).replace(/\n/g, '<br/>')}</div>
    </td></tr>` : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#07070A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#07070A;padding:32px 16px;">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#131319;border:1px solid rgba(201,168,76,0.18);border-radius:12px;overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#0D0D13,#1A1A22);padding:24px 32px;border-bottom:1px solid rgba(201,168,76,0.12);">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td><span style="font-family:Georgia,serif;font-size:18px;font-weight:600;color:#F2EEE4;">Sandou Kremas</span><br/>
            <span style="font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:${typeColor};display:block;margin-top:3px;">${esc(typeLabel)}</span></td>
          <td align="right"><span style="display:inline-block;background:${typeColor}22;border:1px solid ${typeColor}44;border-radius:99px;padding:5px 13px;font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${typeColor};">${esc(typeLabel)}</span></td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:24px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${row('Customer Name', customerName)}
          ${row('Email', customerEmail)}
          ${row('Phone', customerPhone)}
          ${row('Subject / Type', subject)}
          ${msgRow}
          ${row('Date &amp; Time', datetime)}
        </table>
        <a href="${esc(adminPanelUrl)}" style="display:block;margin-top:22px;background:linear-gradient(135deg,#9A7A2E,#C9A84C);color:#0A0800;text-align:center;padding:13px 24px;font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;border-radius:7px;">
          Open Admin Panel →
        </a>
      </td></tr>
      <tr><td style="padding:14px 32px;border-top:1px solid rgba(201,168,76,0.08);text-align:center;">
        <div style="font-size:9px;color:rgba(242,238,228,0.2);">Sandou Kremas · Admin Notifications · Do not share this email</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
