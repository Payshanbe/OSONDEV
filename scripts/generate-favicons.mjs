/**
 * One-off favicon generator from public/logo-oson.png.
 * Run: node scripts/generate-favicons.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "logo-oson.png");

/** Crop to OD monogram (top ~58% of wordmark), then square pad. */
async function squareMonogram(buffer, size) {
  const meta = await sharp(buffer).metadata();
  const cropH = Math.round(meta.height * 0.58);
  const cropped = await sharp(buffer)
    .extract({ left: 0, top: 0, width: meta.width, height: cropH })
    .png()
    .toBuffer();

  const cMeta = await sharp(cropped).metadata();
  const side = Math.max(cMeta.width, cMeta.height);
  const padX = Math.floor((side - cMeta.width) / 2);
  const padY = Math.floor((side - cMeta.height) / 2);

  return sharp(cropped)
    .extend({
      top: padY,
      bottom: side - cMeta.height - padY,
      left: padX,
      right: side - cMeta.width - padX,
      background: { r: 9, g: 9, b: 11, alpha: 1 },
    })
    .resize(size, size, { fit: "contain", background: { r: 9, g: 9, b: 11, alpha: 1 } })
    .png()
    .toBuffer();
}

const srcBuf = await readFile(src);

const icon32 = await squareMonogram(srcBuf, 32);
const icon180 = await squareMonogram(srcBuf, 180);
const icon512 = await squareMonogram(srcBuf, 512);

await writeFile(path.join(root, "app", "icon.png"), icon32);
await writeFile(path.join(root, "app", "apple-icon.png"), icon180);
await writeFile(path.join(root, "public", "icon-512.png"), icon512);

const fav48 = await squareMonogram(srcBuf, 48);
await writeFile(path.join(root, "public", "favicon-48.png"), fav48);

const { execFileSync } = await import("node:child_process");
const ico = execFileSync("npx", ["--yes", "png-to-ico", path.join(root, "public", "favicon-48.png")], {
  cwd: root,
  shell: true,
});
await writeFile(path.join(root, "public", "favicon.ico"), ico);

console.log("Generated app/icon.png, app/apple-icon.png, public/favicon.ico, public/icon-512.png");
