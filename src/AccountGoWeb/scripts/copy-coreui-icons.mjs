/**
 * Copies @coreui/icons assets into wwwroot so Razor layouts can load
 * ~/css/coreui/icons/css/all.min.css (see Views/Shared/_Layout.cshtml).
 */
import { cp, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = join(__dirname, "..");
const iconsPkg = join(webRoot, "node_modules", "@coreui", "icons");
const destRoot = join(webRoot, "wwwroot", "css", "coreui", "icons");

async function main() {
  const cssSrc = join(iconsPkg, "css", "coreui-icons.min.css");
  const cssDestDir = join(destRoot, "css");
  const cssDest = join(cssDestDir, "all.min.css");
  const fontsSrc = join(iconsPkg, "fonts");
  const fontsDest = join(destRoot, "fonts");

  await mkdir(cssDestDir, { recursive: true });
  await mkdir(fontsDest, { recursive: true });
  await cp(cssSrc, cssDest, { force: true });
  await cp(fontsSrc, fontsDest, { recursive: true, force: true });

  const mapSrc = join(iconsPkg, "css", "coreui-icons.min.css.map");
  try {
    await cp(mapSrc, join(cssDestDir, "all.min.css.map"), { force: true });
  } catch {
    // optional source map
  }

  console.log("CoreUI Icons copied to wwwroot/css/coreui/icons/");
}

main().catch((err) => {
  console.error("copy-coreui-icons:", err.message);
  process.exit(1);
});
