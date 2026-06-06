/* sandou-public.js — Shared Supabase data loader for all public pages
 * Handles: social links, page content (hero, SEO), site settings
 * Must load AFTER supabase.js CDN script.
 */
(function () {
  const SURL = 'https://lmeszvvlejrfribqveek.supabase.co';
  const SKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtZXN6dnZsZWpyZnJpYnF2ZWVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1ODE4MzUsImV4cCI6MjA5NjE1NzgzNX0.e9_EbR8HuEvYEOdsjFgsezr9F_XwUnGM1HQA35GFln8';

  async function run() {
    if (typeof supabase === 'undefined') return;
    const db = supabase.createClient(SURL, SKEY);

    await Promise.all([
      loadSocialLinks(db),
      loadPageContent(db),
      loadSiteSettings(db)
    ]);
  }

  /* ── Social Links ──────────────────────────────────────────── */
  async function loadSocialLinks(db) {
    try {
      const { data } = await db.from('social_links').select('platform, url');
      if (!data || !data.length) return;
      const map = {};
      data.forEach(l => { map[l.platform] = l.url; });

      // Match both nav ("Instagram") and footer ("Follow Sandou Kremas on Instagram")
      const platforms = ['instagram', 'tiktok', 'facebook'];
      platforms.forEach(key => {
        const url = map[key];
        if (!url || url === '#') return;
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        document.querySelectorAll(`[aria-label*="${label}"]`).forEach(el => {
          if (el.tagName === 'A') {
            el.href = url;
            if (!el.href.startsWith('#')) {
              el.target = '_blank';
              el.rel = 'noopener noreferrer';
            }
          }
        });
      });
    } catch (e) { /* social links non-critical */ }
  }

  /* ── Site Settings ─────────────────────────────────────────── */
  async function loadSiteSettings(db) {
    try {
      const { data } = await db.from('site_settings').select('key, value');
      if (!data || !data.length) return;
      const s = {};
      data.forEach(row => { s[row.key] = row.value; });

      // Update footer copyright text
      document.querySelectorAll('[data-sk-setting]').forEach(el => {
        const key = el.dataset.skSetting;
        if (s[key] !== undefined && s[key] !== '') el.textContent = s[key];
      });

      // Update contact email links
      if (s.contact_email) {
        document.querySelectorAll('a[href^="mailto:"][data-sk-email]').forEach(el => {
          el.href = 'mailto:' + s.contact_email;
          if (el.dataset.skEmailText !== undefined) el.textContent = s.contact_email;
        });
      }
    } catch (e) { /* settings non-critical */ }
  }

  /* ── Page Content ──────────────────────────────────────────── */
  async function loadPageContent(db) {
    const slug = document.body && document.body.dataset.skPage;
    if (!slug) return;

    try {
      const { data: row } = await db
        .from('page_content')
        .select('data')
        .eq('slug', slug)
        .maybeSingle();

      if (!row || !row.data) return;
      const c = row.data;

      // Text content → elements with data-sk-content="key"
      document.querySelectorAll('[data-sk-content]').forEach(el => {
        const key = el.dataset.skContent;
        if (c[key] !== undefined && c[key].trim() !== '') {
          el.textContent = c[key];
        }
      });

      // Image src → img[data-sk-src="key"]
      document.querySelectorAll('[data-sk-src]').forEach(el => {
        const key = el.dataset.skSrc;
        if (c[key] && el.tagName === 'IMG') {
          el.src = c[key];
        }
      });

      // Background-image CSS → [data-sk-bg="key"]
      document.querySelectorAll('[data-sk-bg]').forEach(el => {
        const key = el.dataset.skBg;
        if (c[key]) {
          el.style.backgroundImage = `url('${c[key]}')`;
        }
      });

      // Href → a[data-sk-href="key"]
      document.querySelectorAll('a[data-sk-href]').forEach(el => {
        const key = el.dataset.skHref;
        if (c[key]) el.href = c[key];
      });

      // SEO
      if (c.seoTitle) document.title = c.seoTitle;
      if (c.seoDesc) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'description';
          document.head.appendChild(meta);
        }
        meta.content = c.seoDesc;
      }
    } catch (e) { /* page content non-critical */ }
  }

  /* ── Boot ──────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    // supabase.js may still be loading if we're included inline-after
    setTimeout(run, 0);
  }
})();
