const { createClient } = supabase;

const SUPABASE_URL = 'https://lmeszvvlejrfribqveek.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZXN6dnZsZWpyZnJpYnF2ZWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1ODE4MzUsImV4cCI6MjA5NjE1NzgzNX0.e9_EbR8HuEvYEOdsjFgsezr9F_XwUnGM1HQA35GFln8';

const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Save a contact inquiry
async function saveInquiry({ name, email, subject, message, inquiryType }) {
  const { error } = await db.from('inquiries').insert({
    name,
    email,
    subject: subject || inquiryType || 'General',
    message,
    inquiry_type: inquiryType || 'General'
  });
  return error;
}

// Save a newsletter subscriber (deduplicates by email)
async function saveSubscriber(email, source) {
  const { error } = await db.from('subscribers').upsert(
    { email, source: source || 'website', is_active: true },
    { onConflict: 'email', ignoreDuplicates: false }
  );
  return error;
}

// Save an order/reservation
async function saveOrder({ customerName, customerEmail, customerPhone, productName, quantity, shippingState, shippingAddress, notes }) {
  const { data: { user } } = await db.auth.getUser();
  const { data, error } = await db.from('orders').insert({
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
  if (error) console.error('[Sandou] saveOrder error:', error);
  return error;
}

// Update account nav state based on auth session
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
