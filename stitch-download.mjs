import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Load .env manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, ".env");
const envContent = readFileSync(envPath, "utf8");
for (const line of envContent.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
}

const { stitch } = await import("@google/stitch-sdk");

const PROJECT_ID = "17067419183846908719";

const SCREENS = [
  { id: "asset-stub-assets-928834b380224580a51d4480258a3743-1780527582080", slug: "design-system" },
  { id: "0e5b20c7888c4ffd81b95f25bc7e19d1", slug: "cinematic-cream-pour" },
  { id: "bfed8bdbde8945809b1b431ba5be2c47", slug: "founder-portrait" },
  { id: "bbcf1d7c2d984e87a48c6fd1d5a0873b", slug: "luxury-celebration-collage" },
  { id: "95529f0630ba46579b4f4b53235a8479", slug: "floating-bottle" },
  { id: "cfc69ecf8c574044a67378a1516467f7", slug: "home" },
  { id: "c5a641928a6149da951b456b7accbde4", slug: "our-story" },
  { id: "3b7e2f398f764abf9bd7d0419da2bf63", slug: "experience" },
  { id: "37115301960543e6a7b9267784c428c7", slug: "flavors" },
  { id: "50fe0ce9844145eaa2cc9f0641344ee8", slug: "home-animated" },
  { id: "0174c41e50af4c66baa1cd7c2f2af02a", slug: "our-story-animated" },
  { id: "5b769d39a5f144a482d6bdd6caade88e", slug: "our-story-intimate" },
  { id: "b75bfaf7dffd48919a6ce9c9ea891b29", slug: "home-cinematic" },
  { id: "6bbc5bc3f5d54153863e1742e12a2461", slug: "our-story-hospitality" },
  { id: "96b086809eeb4331b9287e1b5cf20064", slug: "home-hospitality" },
];

const OUT_DIR = path.join(__dirname, "stitch-screens");
await fs.mkdir(OUT_DIR, { recursive: true });

const project = stitch.project(PROJECT_ID);

for (const { id, slug } of SCREENS) {
  console.log(`\nFetching [${slug}] (${id})...`);
  try {
    const screen = await project.getScreen(id);

    const htmlUrl = await screen.getHtml();
    const imageUrl = await screen.getImage();

    const screenDir = path.join(OUT_DIR, slug);
    await fs.mkdir(screenDir, { recursive: true });

    if (htmlUrl) {
      console.log(`  Downloading HTML...`);
      const res = await fetch(htmlUrl);
      if (res.ok) {
        await fs.writeFile(path.join(screenDir, "index.html"), await res.text());
        console.log(`  ✓ Saved index.html`);
      } else {
        console.warn(`  ✗ HTML fetch failed: ${res.status}`);
      }
    } else {
      console.warn(`  ✗ No HTML URL`);
    }

    if (imageUrl) {
      console.log(`  Downloading screenshot...`);
      const res = await fetch(imageUrl);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        await fs.writeFile(path.join(screenDir, "screen.png"), Buffer.from(buf));
        console.log(`  ✓ Saved screen.png`);
      } else {
        console.warn(`  ✗ Image fetch failed: ${res.status}`);
      }
    } else {
      console.warn(`  ✗ No image URL`);
    }
  } catch (err) {
    console.error(`  ✗ Error: ${err.message}`);
  }
}

console.log(`\nDone. Files saved to stitch-screens/`);
