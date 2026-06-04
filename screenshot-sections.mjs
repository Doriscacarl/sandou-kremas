import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/sport/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');
import fs from 'fs';
import path from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const dir = './temporary screenshots';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
let counter = nums.length ? Math.max(...nums) + 1 : 1;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1200));

// Scroll through to trigger observers
await page.evaluate(async () => {
  await new Promise(resolve => {
    const timer = setInterval(() => {
      window.scrollBy(0, 200);
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        clearInterval(timer);
        resolve();
      }
    }, 60);
  });
});
await new Promise(r => setTimeout(r, 600));

// Get section positions
const sections = await page.evaluate(() => {
  return ['#story', '#experience', '#art-section', '#gallery-section', '#bottle-section'].map(id => {
    const el = document.querySelector(id);
    return el ? { id, top: el.offsetTop } : null;
  }).filter(Boolean);
});

// Screenshot each section
for (const section of sections) {
  await page.evaluate(top => window.scrollTo(0, top - 80), section.top);
  await new Promise(r => setTimeout(r, 400));
  const file = path.join(dir, `screenshot-${counter}-${section.id.replace('#','')}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`→ ${file}`);
  counter++;
}

await browser.close();
