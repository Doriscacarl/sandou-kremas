import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/sport/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');
import fs from 'fs';
import path from 'path';

const dir = './temporary screenshots';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
let next = nums.length ? Math.max(...nums) + 1 : 1;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });

async function shot(page, label, viewport = {width:1440,height:900}) {
  await page.setViewport({...viewport, deviceScaleFactor:2});
  const filename = path.join(dir, `screenshot-${next++}-${label}.png`);
  await page.screenshot({ path: filename });
  console.log(`Saved → ${filename}`);
}

async function injectDemoData(page) {
  await page.evaluate(() => {
    // Show app, hide login
    document.getElementById('login-screen').style.display = 'none';
    const app = document.getElementById('admin-app');
    app.style.display = 'flex'; app.classList.add('visible');
    document.getElementById('sb-email').textContent = 'doriscacarlm40@gmail.com';
    document.getElementById('sb-av').textContent = 'D';
    document.getElementById('sb-o').textContent = '24';
    document.getElementById('sb-i').textContent = '8';
    document.getElementById('sb-s').textContent = '61';
    document.getElementById('last-updated').textContent = 'Last updated Jun 4, 3:00 PM';
    document.getElementById('access-banner').style.display = 'none';

    const kpis = [
      {ico:'shopping_bag', lbl:'Total Orders',       val:'24',     trend:'up'},
      {ico:'payments',     lbl:'Est. Revenue',        val:'$628',   trend:'up'},
      {ico:'storefront',   lbl:'Wholesale Leads',     val:'5',      trend:'neutral'},
      {ico:'mark_email_read',lbl:'Contact Requests',  val:'3',      trend:'neutral'},
      {ico:'group',        lbl:'Subscribers',         val:'61',     trend:'up'},
      {ico:'trending_up',  lbl:'Conversion Rate',     val:'75.0%',  trend:'up'},
      {ico:'repeat',       lbl:'Returning Customers', val:'4',      trend:'neutral'},
      {ico:'person_check', lbl:'Active (30d)',         val:'9',      trend:'up'},
    ];
    document.getElementById('kpi-grid').innerHTML = kpis.map(k => `
      <div class="kpi">
        <div class="kpi-ico"><span class="ms">${k.ico}</span></div>
        <div class="kpi-lbl">${k.lbl}</div>
        <div class="kpi-val">${k.val}</div>
        <div class="kpi-trend ${k.trend}">
          <span class="ms">${k.trend==='up'?'arrow_upward':'remove'}</span>
          <span>${k.trend==='up'?'Growing':'Stable'}</span>
        </div>
      </div>`).join('');
  });
  await new Promise(r => setTimeout(r, 800));
}

// ── DESKTOP OVERVIEW ──────────────────────────────
const page1 = await browser.newPage();
await page1.goto('http://localhost:3000/admin.html', { waitUntil: 'networkidle2', timeout: 20000 });
await injectDemoData(page1);
await shot(page1, 'admin-desktop-overview');
await page1.close();

// ── DESKTOP ORDERS VIEW ───────────────────────────
const page2 = await browser.newPage();
await page2.goto('http://localhost:3000/admin.html', { waitUntil: 'networkidle2', timeout: 20000 });
await injectDemoData(page2);
await page2.evaluate(() => {
  showView('orders', document.querySelector('.sb-link[href="#orders"]'));
  const rows = [
    ['Alexandra Louis','alexandra@sandou.com','Original Reserve','1','confirmed','$28','(786) 555-0101','Jun 4'],
    ['Marcus Belfort','marcus@gmail.com','Holiday Collection','2','shipped','$104','(305) 555-0202','Jun 3'],
    ['Diane Moreau','diane@outlook.com','Mango Passion','1','pending','$24','—','Jun 2'],
    ['James Toussaint','james@me.com','Coconut Cream','3','delivered','$72','(954) 555-0303','Jun 1'],
    ['Sophie Renard','sophie@yahoo.com','Grenadia Reserve','1','confirmed','$26','(561) 555-0404','May 30'],
  ];
  document.getElementById('o-rc').textContent = '24 results';
  document.getElementById('o-tbody').innerHTML = rows.map(r => `
    <tr>
      <td><div class="bold">${r[0]}</div><div style="font-size:10px;color:var(--t3)">${r[1]}</div></td>
      <td>${r[2]}</td>
      <td class="mono hm">${r[3]}</td>
      <td><span class="badge b-${r[4]}">
        <select class="ssel"><option selected>${r[4]}</option></select>
      </span></td>
      <td class="mono hm">${r[5]}</td>
      <td class="ht" style="font-size:11px">${r[6]}</td>
      <td style="font-size:10px;color:var(--t3)">${r[7]}</td>
    </tr>`).join('');
});
await new Promise(r => setTimeout(r, 400));
await shot(page2, 'admin-desktop-orders');
await page2.close();

// ── MOBILE OVERVIEW ───────────────────────────────
const page3 = await browser.newPage();
await page3.goto('http://localhost:3000/admin.html', { waitUntil: 'networkidle2', timeout: 20000 });
await injectDemoData(page3);
await shot(page3, 'admin-mobile-overview', { width: 390, height: 844 });
await page3.close();

// ── TABLET OVERVIEW ───────────────────────────────
const page4 = await browser.newPage();
await page4.goto('http://localhost:3000/admin.html', { waitUntil: 'networkidle2', timeout: 20000 });
await injectDemoData(page4);
await shot(page4, 'admin-tablet-overview', { width: 768, height: 1024 });
await page4.close();

await browser.close();
console.log('All screenshots done.');
