const { createClient } = supabase;

const SUPABASE_URL = 'https://lmeszvvlejrfribqveek.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZXN6dnZsZWpyZnJpYnF2ZWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1ODE4MzUsImV4cCI6MjA5NjE1NzgzNX0.e9_EbR8HuEvYEOdsjFgsezr9F_XwUnGM1HQA35GFln8';

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── UUID helper (crypto.randomUUID with fallback) ────────────────
function _genUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ (crypto.getRandomValues ? crypto.getRandomValues(new Uint8Array(1))[0] : Math.random() * 256 | 0) & 15 >> c / 4).toString(16)
  );
}

// ── Notification: save to Supabase (fire-and-forget) ─────────────
// Inserts into the notifications table using the anon key.
// Fails silently — the customer's form submission is never blocked.
async function _saveNotification({ type, title, body, relatedId, relatedType }) {
  try {
    await db.from('notifications').insert({
      type,
      title,
      body: body || '',
      related_id: relatedId ? String(relatedId) : null,
      related_type: relatedType || null,
      is_read: false
    });
  } catch (e) { /* non-critical */ }
}

// ── Notification: trigger email + webhook via backend ────────────
// POSTs to /api/notify on the local Express server (serve.mjs).
// No API keys are ever exposed to the browser.
// Fails silently when the endpoint is unavailable (static hosting).
async function _triggerEmail(payload) {
  try {
    await fetch(window.location.origin + '/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined
    });
  } catch (e) { /* non-critical — endpoint may not be available on all hosts */ }
}

// ── Save a contact inquiry ───────────────────────────────────────
async function saveInquiry({ name, email, subject, message, inquiryType }) {
  const id = _genUUID();
  const { error } = await db.from('inquiries').insert({
    id,
    name,
    email,
    subject: subject || inquiryType || 'General',
    message,
    inquiry_type: inquiryType || 'General'
  });
  if (error) return error;

  const dt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const preview = (message || '').slice(0, 120) + ((message || '').length > 120 ? '…' : '');
  _saveNotification({
    type: 'inquiry',
    title: `New Inquiry — ${inquiryType || subject || 'General'}`,
    body: `${name} (${email}): ${preview}`,
    relatedId: id,
    relatedType: 'inquiries'
  });
  _triggerEmail({
    type: 'inquiry',
    customerName: name,
    customerEmail: email,
    customerPhone: '',
    subject: subject || inquiryType || 'General Inquiry',
    message: message || '',
    datetime: dt,
    relatedId: id
  });

  return null;
}

// ── Save a newsletter subscriber ─────────────────────────────────
async function saveSubscriber(email, source) {
  const { error } = await db.from('subscribers').upsert(
    { email, source: source || 'website', is_active: true },
    { onConflict: 'email', ignoreDuplicates: false }
  );
  if (error) return error;

  const dt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  _saveNotification({
    type: 'signup',
    title: 'New Subscriber',
    body: `${email} joined the Sandou Circle (${source || 'website'})`,
    relatedId: email,
    relatedType: 'subscribers'
  });
  _triggerEmail({
    type: 'signup',
    customerName: '',
    customerEmail: email,
    customerPhone: '',
    subject: `Newsletter signup — ${source || 'website'}`,
    message: `${email} joined the Sandou Circle via ${source || 'website'}`,
    datetime: dt,
    relatedId: email
  });

  return null;
}

// ── Save an order/reservation ────────────────────────────────────
async function saveOrder({ customerName, customerEmail, customerPhone, productName, quantity, shippingState, shippingAddress, notes }) {
  const { data: { user } } = await db.auth.getUser();
  const id = _genUUID();
  const { error } = await db.from('orders').insert({
    id,
    user_id: user?.id || null,
    customer_name: customerName,
    customer_email: customerEmail,
    customer_phone: customerPhone || null,
    product_name: productName || 'General Inquiry',
    quantity: quantity || 1,
    shipping_state: shippingState || null,
    shipping_address: shippingAddress || null,
    notes: notes || null,
    status: 'pending'
  });
  if (error) { console.error('[Sandou] saveOrder error:', error); return error; }

  const dt = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
  const addrLine = shippingAddress ? `Ship to: ${shippingAddress.split('\n')[0]}` : '';
  _saveNotification({
    type: 'order',
    title: `New Order — ${productName || 'Reservation'}`,
    body: `${customerName} (${customerEmail}) · ${quantity}x ${productName || 'item'}${shippingState ? ' · ' + shippingState : ''}`,
    relatedId: id,
    relatedType: 'orders'
  });
  _triggerEmail({
    type: 'order',
    customerName,
    customerEmail,
    customerPhone: customerPhone || '',
    subject: `${quantity}x ${productName || 'Reservation'}`,
    message: [notes, addrLine].filter(Boolean).join('\n'),
    datetime: dt,
    relatedId: id
  });

  return null;
}

// ── Update account nav state based on auth session ───────────────
async function updateAccountNav() {
  const { data: { user } } = await db.auth.getUser();
  const accountLinks = document.querySelectorAll('.sk-account-link');
  accountLinks.forEach(el => {
    if (user) {
      el.setAttribute('aria-label', `Account: ${user.email}`);
      const dot = el.querySelector('.sk-auth-dot');
      if (dot) dot.classList.remove('hidden');
    }
  });
}

document.addEventListener('DOMContentLoaded', updateAccountNav);
