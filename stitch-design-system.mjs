import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(path.join(__dirname, ".env"), "utf8");
for (const line of envContent.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
}

const { StitchToolClient } = await import("@google/stitch-sdk");

const client = new StitchToolClient({ apiKey: process.env.STITCH_API_KEY });
const PROJECT_ID = "17067419183846908719";

// Try list_design_systems
console.log("Fetching design systems...");
try {
  const ds = await client.callTool("list_design_systems", { projectId: PROJECT_ID });
  console.log(JSON.stringify(ds, null, 2));

  const systems = ds?.designSystems || [];
  if (systems.length > 0) {
    const first = systems[0];
    const designMd = first?.designSystem?.theme?.designMd;
    if (designMd) {
      const outDir = path.join(__dirname, "stitch-screens", "design-system");
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(path.join(outDir, "DESIGN.md"), designMd);
      console.log("✓ Saved DESIGN.md");
    }
  }
} catch (err) {
  console.error("list_design_systems failed:", err.message);
}

// Also try get_design_system with the stub asset ID
console.log("\nTrying get_design_system with asset stub ID...");
try {
  const result = await client.callTool("get_design_system", {
    projectId: PROJECT_ID,
    name: `projects/${PROJECT_ID}/designSystems/assets-928834b380224580a51d4480258a3743`,
  });
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error("get_design_system failed:", err.message);
}
