// ═══════════════════════════════════════════════════════════════
// SANDOU CONVERSION LAYER
// Reserve Modal · Circle Popup · Sticky CTA · Badges · Analytics
// ═══════════════════════════════════════════════════════════════

// ── Analytics ──────────────────────────────────────────────────
function skTrack(event, params) {
  try {
    if (typeof gtag !== 'undefined') gtag('event', event, params || {});
    if (typeof fbq !== 'undefined') fbq('trackCustom', event, params || {});
  } catch (e) {}
}

// ── Badge Configuration (manage from here) ─────────────────────
const SK_BADGE_CONFIG = {
  'Original Reserve':   { label: 'Best Seller',      bg: 'linear-gradient(135deg,#D8B36A,#765a1a)' },
  'Grenadia Reserve':   { label: 'New Release',       bg: 'linear-gradient(135deg,#4a7c59,#2d5a3d)' },
  'Mango Passion':      { label: 'Limited Edition',   bg: 'linear-gradient(135deg,#c07a2a,#8b4513)' },
};

// ── Reservation Modal HTML ──────────────────────────────────────
const RESERVATION_MODAL_HTML = `
<div id="reservation-modal" role="dialog" aria-modal="true" aria-label="Reserve Your Bottle"
  style="position:fixed;inset:0;z-index:85;display:flex;align-items:flex-end;justify-content:center;padding:16px;background:rgba(0,0,0,0.35);backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1);">
  <div aria-hidden="true" onclick="closeReservation()" style="position:absolute;inset:0;"></div>
  <div id="res-modal-inner"
    style="position:relative;width:100%;max-width:680px;background:rgba(255,248,246,0.98);border:1px solid rgba(216,179,106,0.45);overflow:hidden;overflow-y:auto;max-height:92vh;transform:scale(0.93) translateY(24px);transition:transform 0.7s cubic-bezier(0.16,1,0.3,1);">
    <button aria-label="Close" onclick="closeReservation()"
      style="position:absolute;top:16px;right:16px;z-index:10;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;color:#49473f;transition:color 0.3s;"
      onmouseover="this.style.color='#765a1a'" onmouseout="this.style.color='#49473f'">
      <span class="material-symbols-outlined">close</span>
    </button>

    <!-- Form screen -->
    <div id="res-form-screen" style="padding:clamp(28px,5vw,56px);">
      <div style="text-align:center;margin-bottom:32px;">
        <img src="SAndouKremas%20logo.png" alt="Sandou Kremas" style="height:48px;width:auto;mix-blend-mode:multiply;display:block;margin:0 auto 16px;" onerror="this.style.display='none'"/>
        <span style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.45em;text-transform:uppercase;color:#765a1a;display:block;margin-bottom:10px;">Private Reservation</span>
        <h3 style="font-family:'Playfair Display',serif;font-size:clamp(20px,3vw,28px);font-style:italic;color:#28180f;line-height:1.25;margin:0 0 10px;">Reserve Your Bottle</h3>
        <p style="font-family:Montserrat,sans-serif;font-size:13px;color:#49473f;line-height:1.75;max-width:420px;margin:0 auto;">Complete the form below. A Sandou representative will contact you to confirm your order.</p>
      </div>

      <form id="reservation-form" onsubmit="handleReservationSubmit(event)">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:20px;">
          <div>
            <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">First Name *</label>
            <input type="text" name="firstName" required placeholder="Alexandra"
              style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(216,179,106,0.45);padding:10px 0;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
              onfocus="this.style.borderColor='#765a1a'" onblur="this.style.borderColor='rgba(216,179,106,0.45)'"/>
          </div>
          <div>
            <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">Last Name *</label>
            <input type="text" name="lastName" required placeholder="Louis"
              style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(216,179,106,0.45);padding:10px 0;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
              onfocus="this.style.borderColor='#765a1a'" onblur="this.style.borderColor='rgba(216,179,106,0.45)'"/>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:20px;">
          <div>
            <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">Email Address *</label>
            <input type="email" name="email" required placeholder="you@email.com"
              style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(216,179,106,0.45);padding:10px 0;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
              onfocus="this.style.borderColor='#765a1a'" onblur="this.style.borderColor='rgba(216,179,106,0.45)'"/>
          </div>
          <div>
            <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">Phone Number</label>
            <input type="tel" name="phone" placeholder="+1 (555) 000-0000"
              style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(216,179,106,0.45);padding:10px 0;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
              onfocus="this.style.borderColor='#765a1a'" onblur="this.style.borderColor='rgba(216,179,106,0.45)'"/>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;margin-bottom:20px;">
          <div>
            <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">Preferred Flavor</label>
            <select name="flavor"
              style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(216,179,106,0.45);padding:10px 0;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;box-sizing:border-box;cursor:pointer;appearance:none;-webkit-appearance:none;">
              <option value="">Select a flavor…</option>
              <option>Original Reserve</option>
              <option>Coconut Cream</option>
              <option>Grenadia Reserve</option>
              <option>Mango Passion</option>
              <option>Vanilla Bean</option>
              <option>Holiday Collection</option>
            </select>
          </div>
          <div>
            <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">Quantity</label>
            <input type="number" name="quantity" min="1" max="100" value="1"
              style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(216,179,106,0.45);padding:10px 0;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
              onfocus="this.style.borderColor='#765a1a'" onblur="this.style.borderColor='rgba(216,179,106,0.45)'"/>
          </div>
        </div>
        <div style="margin-bottom:16px;padding-top:8px;border-top:1px solid rgba(216,179,106,0.2);">
          <p style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.35em;text-transform:uppercase;color:#765a1a;margin:14px 0 0;">Shipping Address</p>
        </div>
        <div style="margin-bottom:20px;">
          <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">Street Address *</label>
          <input type="text" name="streetAddress" required placeholder="123 Main Street"
            style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(216,179,106,0.45);padding:10px 0;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
            onfocus="this.style.borderColor='#765a1a'" onblur="this.style.borderColor='rgba(216,179,106,0.45)'"/>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:20px;margin-bottom:20px;">
          <div>
            <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">Apt / Suite # <span style="opacity:0.5;">(Optional)</span></label>
            <input type="text" name="apt" placeholder="Apt 4B"
              style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(216,179,106,0.45);padding:10px 0;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
              onfocus="this.style.borderColor='#765a1a'" onblur="this.style.borderColor='rgba(216,179,106,0.45)'"/>
          </div>
          <div>
            <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">City *</label>
            <input type="text" name="city" required placeholder="Miami"
              style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(216,179,106,0.45);padding:10px 0;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
              onfocus="this.style.borderColor='#765a1a'" onblur="this.style.borderColor='rgba(216,179,106,0.45)'"/>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:20px;margin-bottom:20px;">
          <div>
            <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">State *</label>
            <input type="text" name="state" required placeholder="Florida"
              style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(216,179,106,0.45);padding:10px 0;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
              onfocus="this.style.borderColor='#765a1a'" onblur="this.style.borderColor='rgba(216,179,106,0.45)'"/>
          </div>
          <div>
            <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">ZIP Code *</label>
            <input type="text" name="zip" required placeholder="33101"
              style="width:100%;background:transparent;border:none;border-bottom:1px solid rgba(216,179,106,0.45);padding:10px 0;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
              onfocus="this.style.borderColor='#765a1a'" onblur="this.style.borderColor='rgba(216,179,106,0.45)'"/>
          </div>
        </div>
        <div style="margin-bottom:28px;">
          <label style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;color:#49473f;display:block;margin-bottom:8px;">Special Notes</label>
          <textarea name="notes" rows="3" placeholder="Gift wrapping, event details, special requests…"
            style="width:100%;background:transparent;border:1px solid rgba(216,179,106,0.3);padding:14px;font-family:Montserrat,sans-serif;font-size:14px;color:#28180f;outline:none;resize:none;box-sizing:border-box;transition:border-color 0.3s;"
            onfocus="this.style.borderColor='rgba(216,179,106,0.7)'" onblur="this.style.borderColor='rgba(216,179,106,0.3)'"></textarea>
        </div>
        <button type="submit" id="res-submit-btn"
          style="width:100%;background:#2C1B12;color:#F8F3E8;padding:18px;font-family:Montserrat,sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;border:none;cursor:pointer;min-height:52px;transition:letter-spacing 0.5s cubic-bezier(0.16,1,0.3,1);"
          onmouseover="this.style.letterSpacing='0.35em'" onmouseout="this.style.letterSpacing='0.25em'">
          Reserve My Bottle
        </button>
        <p id="res-error-msg" style="display:none;font-family:Montserrat,sans-serif;font-size:12px;color:#c0392b;text-align:center;margin-top:10px;padding:10px;border:1px solid rgba(192,57,43,0.3);"></p>
        <p style="font-family:Montserrat,sans-serif;font-size:11px;color:#49473f;opacity:0.5;text-align:center;margin-top:12px;">No payment required. We'll contact you to confirm.</p>
      </form>
    </div>

    <!-- Success screen -->
    <div id="res-success-screen" style="display:none;padding:clamp(28px,5vw,64px);text-align:center;">
      <div style="width:48px;height:1px;background:#D8B36A;margin:0 auto 24px;"></div>
      <span class="material-symbols-outlined" style="font-size:48px;color:#765a1a;display:block;margin-bottom:16px;font-variation-settings:'FILL' 1,'wght' 300,'GRAD' 0,'opsz' 48;">check_circle</span>
      <h3 style="font-family:'Playfair Display',serif;font-size:clamp(22px,3vw,30px);font-style:italic;color:#28180f;margin:0 0 16px;">Thank you.</h3>
      <p style="font-family:Montserrat,sans-serif;font-size:15px;color:#49473f;line-height:1.85;max-width:440px;margin:0 auto 8px;">Your reservation has been received.</p>
      <p style="font-family:Montserrat,sans-serif;font-size:15px;color:#49473f;line-height:1.85;max-width:440px;margin:0 auto 32px;">A Sandou representative will contact you shortly.</p>
      <div style="width:48px;height:1px;background:#D8B36A;margin:0 auto 32px;"></div>
      <p style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.35em;text-transform:uppercase;color:#765a1a;margin-bottom:20px;">While You Wait</p>
      <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">
        <a href="collection.html"
          style="border:1px solid #2C1B12;color:#2C1B12;padding:12px 20px;font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;display:inline-flex;align-items:center;gap:8px;min-height:44px;text-decoration:none;transition:background 0.3s,color 0.3s;"
          onmouseover="this.style.background='#2C1B12';this.style.color='#F8F3E8'" onmouseout="this.style.background='transparent';this.style.color='#2C1B12'">
          <span class="material-symbols-outlined" style="font-size:16px;">local_bar</span>Explore Collection
        </a>
        <a href="our-story.html"
          style="border:1px solid #765a1a;color:#765a1a;padding:12px 20px;font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;display:inline-flex;align-items:center;gap:8px;min-height:44px;text-decoration:none;transition:background 0.3s,color 0.3s;"
          onmouseover="this.style.background='#765a1a';this.style.color='white'" onmouseout="this.style.background='transparent';this.style.color='#765a1a'">
          <span class="material-symbols-outlined" style="font-size:16px;">auto_stories</span>Read Our Story
        </a>
        <button onclick="closeReservation(); setTimeout(function(){ var t = document.getElementById('concierge-trigger'); if(t) t.click(); }, 400);"
          style="border:1px solid rgba(216,179,106,0.6);color:#765a1a;padding:12px 20px;font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;background:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;min-height:44px;transition:background 0.3s;"
          onmouseover="this.style.background='rgba(216,179,106,0.08)'" onmouseout="this.style.background='none'">
          <span class="material-symbols-outlined" style="font-size:16px;">stylus_note</span>Ask Sandou Concierge
        </button>
      </div>
    </div>
  </div>
</div>`;

// ── Sandou Circle Popup HTML ────────────────────────────────────
const CIRCLE_POPUP_HTML = `
<div id="circle-popup" role="dialog" aria-modal="true" aria-label="Join The Sandou Circle"
  style="position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,0.45);backdrop-filter:blur(6px);opacity:0;pointer-events:none;transition:opacity 0.7s cubic-bezier(0.16,1,0.3,1);">
  <div id="circle-popup-inner"
    style="position:relative;width:100%;max-width:500px;background:linear-gradient(135deg,#1A0F08 0%,#2C1B12 60%,#1A0F08 100%);border:1px solid rgba(216,179,106,0.3);padding:clamp(28px,5vw,56px);transform:scale(0.93) translateY(20px);transition:transform 0.7s cubic-bezier(0.16,1,0.3,1);">
    <button aria-label="Close" onclick="closeCirclePopup()"
      style="position:absolute;top:16px;right:16px;min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;color:rgba(244,230,193,0.55);transition:color 0.3s;"
      onmouseover="this.style.color='#D8B36A'" onmouseout="this.style.color='rgba(244,230,193,0.55)'">
      <span class="material-symbols-outlined">close</span>
    </button>
    <div style="text-align:center;">
      <div style="width:36px;height:1px;background:#D8B36A;margin:0 auto 20px;"></div>
      <span style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.5em;text-transform:uppercase;color:#D8B36A;display:block;margin-bottom:14px;">An Exclusive Community</span>
      <h3 style="font-family:'Playfair Display',serif;font-size:clamp(24px,4vw,34px);color:#F4E6C1;font-style:italic;line-height:1.2;margin:0 0 16px;">Join The Sandou Circle</h3>
      <p style="font-family:Montserrat,sans-serif;font-size:14px;color:rgba(244,230,193,0.68);line-height:1.85;max-width:380px;margin:0 auto 8px;">Be the first to access limited releases, private tastings,</p>
      <p style="font-family:Montserrat,sans-serif;font-size:14px;color:rgba(244,230,193,0.68);line-height:1.85;max-width:380px;margin:0 auto 28px;">founder updates, and exclusive releases.</p>
      <div style="width:36px;height:1px;background:#D8B36A;margin:0 auto 28px;"></div>
      <div id="circle-popup-form-wrap">
        <form onsubmit="handleCirclePopupSubmit(event)" style="display:flex;flex-direction:column;gap:12px;">
          <input type="email" id="circle-popup-email" required placeholder="Your email address…"
            style="width:100%;background:rgba(255,248,246,0.06);border:1px solid rgba(216,179,106,0.25);color:#F4E6C1;padding:14px 18px;font-family:Montserrat,sans-serif;font-size:14px;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
            onfocus="this.style.borderColor='rgba(216,179,106,0.65)'" onblur="this.style.borderColor='rgba(216,179,106,0.25)'"/>
          <button type="submit" id="circle-popup-btn"
            style="width:100%;background:#D8B36A;color:#1A0F08;padding:16px;font-family:Montserrat,sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;border:none;cursor:pointer;min-height:52px;transition:background 0.35s,letter-spacing 0.5s cubic-bezier(0.16,1,0.3,1);"
            onmouseover="this.style.background='#F4E6C1';this.style.letterSpacing='0.35em'" onmouseout="this.style.background='#D8B36A';this.style.letterSpacing='0.25em'">
            Join The Circle
          </button>
        </form>
        <p style="font-family:Montserrat,sans-serif;font-size:11px;color:rgba(244,230,193,0.32);margin-top:12px;">We respect your privacy. One beautiful message at a time.</p>
      </div>
      <div id="circle-popup-success-wrap" style="display:none;padding:8px 0;">
        <span class="material-symbols-outlined" style="color:#D8B36A;font-size:44px;display:block;margin-bottom:14px;">celebration</span>
        <p style="font-family:'Playfair Display',serif;font-size:20px;color:#F4E6C1;font-style:italic;">Welcome to the Sandou Circle.</p>
        <p style="font-family:Montserrat,sans-serif;font-size:13px;color:rgba(244,230,193,0.55);margin-top:10px;">We're honored to have you.</p>
      </div>
    </div>
  </div>
</div>`;

// ── Sticky CTA HTML ─────────────────────────────────────────────
const STICKY_CTA_HTML = `
<div id="sticky-reserve-desktop"
  style="position:fixed;bottom:106px;right:40px;z-index:65;opacity:0;transform:translateY(12px);transition:opacity 0.5s ease,transform 0.5s ease;pointer-events:none;display:none;">
  <button onclick="skTrack('reserve_button_click',{location:'sticky_desktop'}); toggleReservation();"
    style="background:#2C1B12;color:#F8F3E8;padding:14px 24px;font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;border:none;cursor:pointer;box-shadow:0 8px 32px rgba(44,27,18,0.3);min-height:44px;transition:letter-spacing 0.5s cubic-bezier(0.16,1,0.3,1),box-shadow 0.3s;"
    onmouseover="this.style.letterSpacing='0.35em';this.style.boxShadow='0 12px 40px rgba(44,27,18,0.45)'" onmouseout="this.style.letterSpacing='0.25em';this.style.boxShadow='0 8px 32px rgba(44,27,18,0.3)'">
    Reserve Your Bottle
  </button>
</div>
<div id="sticky-bar-mobile"
  style="position:fixed;bottom:0;left:0;right:0;z-index:65;background:rgba(255,248,246,0.97);backdrop-filter:blur(20px);border-top:1px solid rgba(216,179,106,0.3);padding:10px 16px calc(10px + env(safe-area-inset-bottom,0px));display:none;gap:10px;box-shadow:0 -4px 24px rgba(44,27,18,0.1);">
  <button onclick="skTrack('reserve_button_click',{location:'sticky_mobile'}); toggleReservation();"
    style="flex:1;background:#2C1B12;color:#F8F3E8;padding:14px 10px;font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;border:none;cursor:pointer;min-height:44px;transition:letter-spacing 0.4s ease;">
    Reserve Bottle
  </button>
  <button onclick="skTrack('circle_popup_view',{location:'sticky_mobile'}); openCirclePopup();"
    style="flex:1;background:transparent;color:#2C1B12;padding:14px 10px;font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;font-weight:600;border:1px solid rgba(44,27,18,0.28);cursor:pointer;min-height:44px;transition:background 0.3s;">
    Join Circle
  </button>
</div>`;

// ── Sandou Circle Section HTML (for collection + story pages) ───
const PAGE_CIRCLE_SECTION_HTML = `
<section id="page-circle-section" style="padding:80px 20px;background:linear-gradient(135deg,#1A0F08 0%,#2C1B12 60%,#1A0F08 100%);overflow:hidden;position:relative;">
  <div style="position:absolute;width:60%;height:60%;top:20%;left:-10%;background:radial-gradient(circle,rgba(216,179,106,0.07) 0%,transparent 70%);pointer-events:none;"></div>
  <div style="position:absolute;width:50%;height:50%;bottom:10%;right:-5%;background:radial-gradient(circle,rgba(116,90,26,0.08) 0%,transparent 70%);pointer-events:none;"></div>
  <div style="max-width:760px;margin:0 auto;text-align:center;position:relative;z-index:1;">
    <span style="font-family:Montserrat,sans-serif;font-size:9px;letter-spacing:0.5em;text-transform:uppercase;color:#D8B36A;display:block;margin-bottom:14px;">An Exclusive Community</span>
    <h2 style="font-family:'Playfair Display',serif;font-size:clamp(28px,5vw,52px);color:#F4E6C1;font-style:italic;line-height:1.15;margin:0 0 18px;">Join The Sandou Circle</h2>
    <p style="font-family:Montserrat,sans-serif;font-size:16px;color:rgba(255,248,246,0.65);line-height:1.85;max-width:560px;margin:0 auto 36px;">Reserve your place in an intimate community. Be the first to know about limited releases, holiday collections, private tastings, and messages directly from Alexandra.</p>
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:20px;margin-bottom:36px;">
      <div style="display:flex;align-items:center;gap:10px;"><span class="material-symbols-outlined" style="color:#D8B36A;font-size:20px;">new_releases</span><span style="font-family:Montserrat,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(244,230,193,0.65);">New Flavors</span></div>
      <div style="display:flex;align-items:center;gap:10px;"><span class="material-symbols-outlined" style="color:#D8B36A;font-size:20px;">star</span><span style="font-family:Montserrat,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(244,230,193,0.65);">Limited Editions</span></div>
      <div style="display:flex;align-items:center;gap:10px;"><span class="material-symbols-outlined" style="color:#D8B36A;font-size:20px;">mail</span><span style="font-family:Montserrat,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(244,230,193,0.65);">Founder Messages</span></div>
    </div>
    <div id="page-circle-form-wrap" style="max-width:480px;margin:0 auto;">
      <form onsubmit="handlePageCircleSubmit(event)" style="display:flex;flex-direction:column;gap:0;">
        <div style="display:flex;flex-direction:column;gap:10px;">
          <input type="email" id="page-circle-email" required placeholder="Your email address…"
            style="width:100%;background:rgba(255,248,246,0.06);border:1px solid rgba(216,179,106,0.25);color:#F4E6C1;padding:14px 20px;font-family:Montserrat,sans-serif;font-size:14px;outline:none;box-sizing:border-box;transition:border-color 0.3s;"
            onfocus="this.style.borderColor='rgba(216,179,106,0.65)'" onblur="this.style.borderColor='rgba(216,179,106,0.25)'"/>
          <button type="submit" id="page-circle-btn"
            style="background:#D8B36A;color:#1A0F08;padding:16px;font-family:Montserrat,sans-serif;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;border:none;cursor:pointer;min-height:52px;transition:background 0.35s,letter-spacing 0.5s cubic-bezier(0.16,1,0.3,1);"
            onmouseover="this.style.background='#F4E6C1';this.style.letterSpacing='0.35em'" onmouseout="this.style.background='#D8B36A';this.style.letterSpacing='0.25em'">
            Join The Circle
          </button>
        </div>
      </form>
      <p style="font-family:Montserrat,sans-serif;font-size:11px;color:rgba(244,230,193,0.35);margin-top:14px;">We respect your privacy. One beautiful message at a time.</p>
    </div>
    <div id="page-circle-success-wrap" style="display:none;padding:16px 0;">
      <span class="material-symbols-outlined" style="color:#D8B36A;font-size:44px;display:block;margin-bottom:14px;">celebration</span>
      <p style="font-family:'Playfair Display',serif;font-size:20px;color:#F4E6C1;font-style:italic;">Welcome to the Sandou Circle. We're honored to have you.</p>
    </div>
  </div>
</section>`;

// ═══════════════════════════════════════════════════════════════
// MODAL LOGIC
// ═══════════════════════════════════════════════════════════════

function openReservation() {
  var m = document.getElementById('reservation-modal');
  var i = document.getElementById('res-modal-inner');
  if (!m) return;
  m.style.opacity = '1';
  m.style.pointerEvents = 'auto';
  if (i) i.style.transform = 'scale(1) translateY(0)';
  document.body.style.overflow = 'hidden';
  skTrack('reserve_button_click', {});
}

function closeReservation() {
  var m = document.getElementById('reservation-modal');
  var i = document.getElementById('res-modal-inner');
  if (!m) return;
  m.style.opacity = '0';
  m.style.pointerEvents = 'none';
  if (i) i.style.transform = 'scale(0.93) translateY(24px)';
  document.body.style.overflow = '';
}

function toggleReservation() {
  var m = document.getElementById('reservation-modal');
  if (!m) return;
  if (m.style.pointerEvents === 'auto') {
    closeReservation();
  } else {
    openReservation();
  }
}

async function handleReservationSubmit(e) {
  e.preventDefault();
  var btn = document.getElementById('res-submit-btn');
  var errEl = document.getElementById('res-error-msg');
  if (errEl) errEl.style.display = 'none';
  btn.disabled = true;
  btn.textContent = 'Reserving…';
  var form = e.target;
  var d = new FormData(form);
  var firstName = d.get('firstName') || '';
  var lastName  = d.get('lastName') || '';
  var email     = d.get('email') || '';
  var phone         = d.get('phone') || '';
  var streetAddress = (d.get('streetAddress') || '').trim();
  var apt           = (d.get('apt') || '').trim();
  var city          = (d.get('city') || '').trim();
  var state         = (d.get('state') || '').trim();
  var zip           = (d.get('zip') || '').trim();
  var flavor        = d.get('flavor') || '';
  var quantity      = parseInt(d.get('quantity')) || 1;
  var notes         = d.get('notes') || '';

  var addrParts = [streetAddress];
  if (apt) addrParts.push('Apt/Suite: ' + apt);
  var cityLine = [city, state + (zip ? ' ' + zip : '')].filter(Boolean).join(', ');
  if (cityLine) addrParts.push(cityLine);
  var fullAddress = addrParts.filter(Boolean).join('\n');

  if (typeof saveOrder === 'function') {
    var err = await saveOrder({
      customerName: firstName + ' ' + lastName,
      customerEmail: email,
      customerPhone: phone || null,
      productName: flavor || 'General Reservation',
      quantity: quantity,
      shippingState: state || null,
      shippingAddress: fullAddress || null,
      notes: notes || null
    });
    if (err) {
      btn.disabled = false;
      btn.textContent = 'Reserve My Bottle';
      if (errEl) { errEl.textContent = 'Something went wrong: ' + (err.message || 'Please try again.'); errEl.style.display = 'block'; }
      console.error('[Sandou] Reservation error:', err);
      return;
    }
  }

  skTrack('reservation_submission', { flavor: flavor, quantity: quantity });
  document.getElementById('res-form-screen').style.display = 'none';
  document.getElementById('res-success-screen').style.display = 'block';
}

// ── Circle Popup Logic ──────────────────────────────────────────
var SK_CIRCLE_KEY = 'sk_circle_dismissed_at';

function shouldShowCirclePopup() {
  var ts = localStorage.getItem(SK_CIRCLE_KEY);
  if (!ts) return true;
  return (Date.now() - parseInt(ts)) / 86400000 >= 7;
}

function openCirclePopup() {
  var p = document.getElementById('circle-popup');
  var i = document.getElementById('circle-popup-inner');
  if (!p) return;
  p.style.opacity = '1';
  p.style.pointerEvents = 'auto';
  if (i) i.style.transform = 'scale(1) translateY(0)';
  skTrack('circle_popup_view', {});
}

function closeCirclePopup() {
  var p = document.getElementById('circle-popup');
  var i = document.getElementById('circle-popup-inner');
  if (!p) return;
  p.style.opacity = '0';
  p.style.pointerEvents = 'none';
  if (i) i.style.transform = 'scale(0.93) translateY(20px)';
  localStorage.setItem(SK_CIRCLE_KEY, Date.now().toString());
}

async function handleCirclePopupSubmit(e) {
  e.preventDefault();
  var btn = document.getElementById('circle-popup-btn');
  btn.disabled = true;
  btn.textContent = 'Joining…';
  var email = document.getElementById('circle-popup-email').value;
  if (typeof saveSubscriber === 'function') {
    var err = await saveSubscriber(email, 'circle-popup');
    if (err) console.error('[Sandou] Subscribe error:', err.code, err.message);
  }
  skTrack('circle_popup_conversion', { source: 'popup' });
  localStorage.setItem(SK_CIRCLE_KEY, Date.now().toString());
  document.getElementById('circle-popup-form-wrap').style.display = 'none';
  document.getElementById('circle-popup-success-wrap').style.display = 'block';
  setTimeout(closeCirclePopup, 3200);
}

async function handlePageCircleSubmit(e) {
  e.preventDefault();
  var btn = document.getElementById('page-circle-btn');
  btn.disabled = true;
  btn.textContent = 'Joining…';
  var email = document.getElementById('page-circle-email').value;
  if (typeof saveSubscriber === 'function') {
    var err = await saveSubscriber(email, 'page-circle');
    if (err) console.error('[Sandou] Subscribe error:', err.code, err.message);
  }
  skTrack('circle_submission', { source: 'page-section' });
  document.getElementById('page-circle-form-wrap').style.display = 'none';
  document.getElementById('page-circle-success-wrap').style.display = 'block';
}

// ── Reroute Reserve Buttons to Reservation Modal ────────────────
function rerouteReserveButtons() {
  document.querySelectorAll('button, a').forEach(function(el) {
    var oc = el.getAttribute('onclick') || '';
    if (!oc.includes('toggleConcierge()')) return;
    if (el.closest('#concierge-modal')) return;   // keep close/backdrop handlers
    var txt = el.textContent.trim().toLowerCase();
    if (txt.includes('reserve') || txt.includes('bottle')) {
      var newOc = oc.replace(/toggleConcierge\(\)/g, 'toggleReservation()');
      el.setAttribute('onclick', newOc);
    }
  });
}

// ── Sticky CTA Show/Hide ────────────────────────────────────────
function initStickyCTA() {
  var deskBtn = document.getElementById('sticky-reserve-desktop');
  var mobileBar = document.getElementById('sticky-bar-mobile');

  // Show desktop button only on wider screens
  function applyScreenState() {
    var wide = window.innerWidth >= 768;
    if (deskBtn) deskBtn.style.display = wide ? 'block' : 'none';
    if (mobileBar) mobileBar.style.display = !wide ? 'flex' : 'none';

    // Push concierge float above mobile bar
    var floatWrap = document.querySelector('.concierge-float');
    if (floatWrap) {
      floatWrap.style.bottom = (!wide) ? '80px' : '';
      floatWrap.style.right  = (!wide) ? '16px' : '';
    }
  }

  applyScreenState();
  window.addEventListener('resize', applyScreenState, { passive: true });

  // Fade in desktop button after scroll
  window.addEventListener('scroll', function() {
    if (!deskBtn || window.innerWidth < 768) return;
    var scrolled = window.pageYOffset > 350;
    deskBtn.style.opacity = scrolled ? '1' : '0';
    deskBtn.style.transform = scrolled ? 'translateY(0)' : 'translateY(12px)';
    deskBtn.style.pointerEvents = scrolled ? 'auto' : 'none';
  }, { passive: true });

  // Mobile bar adds bottom padding to body
  if (mobileBar && window.innerWidth < 768) {
    document.body.style.paddingBottom = '74px';
  }
}

// ── Add Badges to Collection Cards ─────────────────────────────
function applyCollectionBadges() {
  var articles = document.querySelectorAll('article.flavor-card');
  articles.forEach(function(card) {
    var h3 = card.querySelector('h3');
    if (!h3) return;
    var name = h3.textContent.trim();
    var cfg = SK_BADGE_CONFIG[name];
    if (!cfg) return;
    // Don't double-badge (Coconut Cream already has founder-badge in HTML)
    if (card.querySelector('.sk-badge')) return;
    var badge = document.createElement('div');
    badge.className = 'sk-badge';
    badge.textContent = cfg.label;
    badge.style.cssText = 'position:absolute;top:12px;right:12px;z-index:10;background:' + cfg.bg + ';color:white;padding:5px 10px;font-family:Montserrat,sans-serif;font-size:8px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;';
    // Card needs relative positioning (already has overflow-hidden)
    card.style.position = 'relative';
    card.insertBefore(badge, card.firstChild);
  });
}

// ── Gallery Image Fallback ──────────────────────────────────────
function applyGalleryFallbacks() {
  var FALLBACK = "https://placehold.co/800x600/F8F3E8/D8B36A?text=Sandou+Kremas";
  document.querySelectorAll('.gallery-item img, .passpartout-frame img').forEach(function(img) {
    if (!img.hasAttribute('onerror')) {
      img.setAttribute('onerror', "this.onerror=null;this.src='" + FALLBACK + "';this.style.objectFit='contain';");
    }
  });
}

// ── Circle Popup Timer ──────────────────────────────────────────
function startCirclePopupTimer() {
  if (!shouldShowCirclePopup()) return;
  var delay = 8000 + Math.random() * 2000;
  setTimeout(openCirclePopup, delay);
}

// ── Inject Circle Section on applicable pages ───────────────────
function injectCircleSection() {
  var pageName = window.location.pathname.split('/').pop() || 'index.html';
  if (pageName === 'collection.html' || pageName === 'our-story.html') {
    if (document.getElementById('page-circle-section')) return;
    var footer = document.querySelector('footer');
    if (footer) footer.insertAdjacentHTML('beforebegin', PAGE_CIRCLE_SECTION_HTML);
  }
}

// ── Track Concierge Opens ───────────────────────────────────────
function patchConciergeAnalytics() {
  var trigger = document.getElementById('concierge-trigger');
  if (trigger) {
    trigger.addEventListener('click', function() {
      skTrack('concierge_open', {});
    });
  }
}

// ── ESC key handler ─────────────────────────────────────────────
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeReservation();
    closeCirclePopup();
  }
});

// ═══════════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
  // Inject UI components
  document.body.insertAdjacentHTML('afterbegin', RESERVATION_MODAL_HTML);
  document.body.insertAdjacentHTML('afterbegin', CIRCLE_POPUP_HTML);
  document.body.insertAdjacentHTML('beforeend', STICKY_CTA_HTML);

  // Reroute Reserve buttons
  rerouteReserveButtons();

  // Apply collection badges (no-op on non-collection pages)
  applyCollectionBadges();

  // Apply gallery fallbacks
  applyGalleryFallbacks();

  // Inject circle section on collection/story pages
  injectCircleSection();

  // Init sticky CTA
  initStickyCTA();

  // Start circle popup timer
  startCirclePopupTimer();

  // Analytics
  patchConciergeAnalytics();

  // Wire the concierge "Send to the Cellar Master" button →
  // close concierge, pre-fill notes with any typed message, open reservation modal
  (function wireConciergeSubmit() {
    var modal = document.getElementById('concierge-modal');
    if (!modal) return;
    var buttons = modal.querySelectorAll('button');
    var sendBtn = null;
    buttons.forEach(function(b) {
      if (b.textContent.trim() === 'Send to the Cellar Master') sendBtn = b;
    });
    if (!sendBtn) return;
    sendBtn.addEventListener('click', function() {
      var textarea = modal.querySelector('textarea');
      var msg = (textarea ? textarea.value : '').trim();
      if (typeof toggleConcierge === 'function') toggleConcierge();
      setTimeout(function() {
        if (typeof openReservation === 'function') {
          openReservation();
          if (msg) {
            var notesField = document.querySelector('#reservation-form [name="notes"]');
            if (notesField && !notesField.value) notesField.value = msg;
          }
        }
      }, 350);
    });
  })();
});
