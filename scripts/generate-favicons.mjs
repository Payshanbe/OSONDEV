/**
 * Favicon generator from public/favicon-source.jpg (tab icon only).
 * Run: node scripts/generate-favicons.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "favicon-source.jpg");
/** >1 zooms the mark so it fills more of the browser tab (browsers render favicons small). */
const TAB_ICON_ZOOM = 1.18;

async function squareIcon(buffer, size) {
  const zoomed = Math.round(size * TAB_ICON_ZOOM);
  const offset = Math.floor((zoomed - size) / 2);

  return sharp(buffer)
    .resize(zoomed, zoomed, { fit: "cover", position: "centre" })
    .extract({ left: offset, top: offset, width: size, height: size })
    .png()
    .toBuffer();
}

const srcBuf = await readFile(src);

const icon32 = await squareIcon(srcBuf, 32);
const icon180 = await squareIcon(srcBuf, 180);
const icon512 = await squareIcon(srcBuf, 512);
const fav48 = await squareIcon(srcBuf, 48);

await writeFile(path.join(root, "app", "icon.png"), icon32);
await writeFile(path.join(root, "app", "apple-icon.png"), icon180);
await writeFile(path.join(root, "public", "icon-512.png"), icon512);
await writeFile(path.join(root, "public", "favicon-48.png"), fav48);

const { execFileSync } = await import("node:child_process");
const ico = execFileSync(
  "npx",
  ["--yes", "png-to-ico", path.join(root, "public", "favicon-48.png")],
  { cwd: root, shell: true },
);
await writeFile(path.join(root, "public", "favicon.ico"), ico);

console.log("Generated app/icon.png, app/apple-icon.png, public/favicon.ico, public/icon-512.png");
