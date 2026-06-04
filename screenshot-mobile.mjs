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
const next = nums.length ? Math.max(...nums) + 1 : 1;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

// Mobile (375px)
const mobile = await browser.newPage();
await mobile.setViewport({ width: 375, height: 812, deviceScaleFactor: 2 });
await mobile.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1200));
await mobile.evaluate(async () => {
  await new Promise(resolve => {
    const timer = setInterval(() => {
      window.scrollBy(0, 250);
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        clearInterval(timer);
        window.scrollTo(0, 0);
        resolve();
      }
    }, 80);
  });
});
await new Promise(r => setTimeout(r, 800));
await mobile.screenshot({ path: path.join(dir, `screenshot-${next}-mobile-full.png`), fullPage: true });
await mobile.close();

// Tablet (768px)
const tablet = await browser.newPage();
await tablet.setViewport({ width: 768, height: 1024, deviceScaleFactor: 2 });
await tablet.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1200));
await tablet.evaluate(async () => {
  await new Promise(resolve => {
    const timer = setInterval(() => {
      window.scrollBy(0, 250);
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        clearInterval(timer);
        window.scrollTo(0, 0);
        resolve();
      }
    }, 80);
  });
});
await new Promise(r => setTimeout(r, 800));
await tablet.screenshot({ path: path.join(dir, `screenshot-${next + 1}-tablet-full.png`), fullPage: true });
await tablet.close();

await browser.close();
console.log(`Mobile → screenshot-${next}-mobile-full.png`);
console.log(`Tablet → screenshot-${next + 1}-tablet-full.png`);
