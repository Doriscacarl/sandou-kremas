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

// ── Loading screen (capture immediately on DOMContentLoaded) ──
const loaderPage = await browser.newPage();
await loaderPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
// Intercept to pause JS so loader stays visible
await loaderPage.setJavaScriptEnabled(false);
await loaderPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await loaderPage.setJavaScriptEnabled(true);
await new Promise(r => setTimeout(r, 600));
await loaderPage.screenshot({ path: path.join(dir, `screenshot-${next}-loading-screen.png`) });
await loaderPage.close();

// ── Mobile loading screen ──
const mobileLoaderPage = await browser.newPage();
await mobileLoaderPage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await mobileLoaderPage.setJavaScriptEnabled(false);
await mobileLoaderPage.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await new Promise(r => setTimeout(r, 500));
await mobileLoaderPage.screenshot({ path: path.join(dir, `screenshot-${next + 1}-loading-mobile.png`) });
await mobileLoaderPage.close();

// ── Mobile menu open ──
const menuPage = await browser.newPage();
await menuPage.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await menuPage.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1800));
await menuPage.click('#mobile-menu-btn');
await new Promise(r => setTimeout(r, 700));
await menuPage.screenshot({ path: path.join(dir, `screenshot-${next + 2}-mobile-menu.png`) });
await menuPage.close();

// ── Footer ──
const footerPage = await browser.newPage();
await footerPage.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
await footerPage.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1500));
// scroll to footer
await footerPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await new Promise(r => setTimeout(r, 500));
await footerPage.screenshot({ path: path.join(dir, `screenshot-${next + 3}-footer.png`) });
await footerPage.close();

await browser.close();
console.log(`Saved: loading-screen, loading-mobile, mobile-menu, footer (screenshots ${next}–${next+3})`);
