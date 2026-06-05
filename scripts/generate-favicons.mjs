/**
 * Favicon generator from public/logo-oson.png (square OD mark).
 * Run: node scripts/generate-favicons.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "logo-oson.png");

const BG = { r: 9, g: 9, b: 11, alpha: 1 };

async function squareIcon(buffer, size) {
  return sharp(buffer)
    .resize(size, size, {
      fit: "contain",
      position: "centre",
      background: BG,
    })
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
