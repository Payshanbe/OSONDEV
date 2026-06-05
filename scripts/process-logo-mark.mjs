/**
 * Convert black-on-white OD mark JPEG → white-on-transparent PNG for dark UI.
 * Run: node scripts/process-logo-mark.mjs [input-path]
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const defaultInput = path.join(root, "public", "logo-oson-source.jpg");
const output = path.join(root, "public", "logo-oson.png");

const input = process.argv[2] ? path.resolve(process.argv[2]) : defaultInput;
const THRESHOLD = 235;

const { data, info } = await sharp(await readFile(input))
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const pixels = new Uint8Array(data);
for (let i = 0; i < pixels.length; i += info.channels) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  const lum = (r + g + b) / 3;

  if (lum >= THRESHOLD) {
    pixels[i] = 0;
    pixels[i + 1] = 0;
    pixels[i + 2] = 0;
    pixels[i + 3] = 0;
  } else {
    pixels[i] = 255;
    pixels[i + 1] = 255;
    pixels[i + 2] = 255;
    pixels[i + 3] = 255;
  }
}

const meta = await sharp(pixels, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 10 })
  .png()
  .toBuffer({ resolveWithObject: true });

await writeFile(output, meta.data);
console.log(`Wrote ${output} (${meta.info.width}x${meta.info.height})`);
