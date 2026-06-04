import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/sport/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');
import fs from 'fs';
import path from 'path';

const dir = './temporary screenshots';
const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(n => !isNaN(n));
const next = nums.length ? Math.max(...nums) + 1 : 1;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));

// Open the concierge modal
await page.click('#concierge-trigger');
await new Promise(r => setTimeout(r, 1000));
await page.screenshot({ path: path.join(dir, `screenshot-${next}-concierge-modal.png`) });

// Mobile concierge
const mobile = await browser.newPage();
await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await mobile.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
await mobile.click('#concierge-trigger');
await new Promise(r => setTimeout(r, 1000));
await mobile.screenshot({ path: path.join(dir, `screenshot-${next + 1}-concierge-mobile.png`) });
await mobile.close();

await browser.close();
console.log(`Saved concierge screenshots`);
