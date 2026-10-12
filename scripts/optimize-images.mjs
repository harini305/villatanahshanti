// Pre-optimises the original Wix images in assets-src/ into public/images/<section>/<name>
// and writes src/data/images.generated.json (src, width, height, blurDataURL, wixId).
// Also generates app icons and 1200x630 Open Graph crops.
// Run after `npm run assets:fetch`: `npm run assets:optimize`.
import { readdir, mkdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets-src');
const PUB = path.join(ROOT, 'public', 'images');
const APP = path.join(ROOT, 'src', 'app');

// wixId prefix -> [section, descriptive name, max long edge]
// Every one of the 64 originals in planning/research/media-originals.txt is listed (plus the video poster).
const MAP = {
  // brand
  f9bc4b25: ['brand', 'logo-rice-plant', 900],
  '54b9bc8d': ['brand', 'wheat-field', 1600],
  '7f94b1fb': ['brand', 'palm-leaf-janur', 3200],
  a1770ccd: ['brand', 'young-coconuts', 3200],
  // home
  e63ec642: ['home', 'team-on-stairs', 2400],
  '91cd5331': ['home', 'team-in-doorway', 1800],
  '5b4378d4': ['home', 'video-poster', 2400],
  // rooms (only the Batur hero is not part of the gallery)
  e209957e: ['rooms', 'batur-hero', 3200],
  // yoga
  '0ef9903b': ['yoga', 'yoga-shala', 3200],
  '90c98efd': [null, 'yoga-shala-duplicate', 0], // byte-identical to 0ef9903b, intentionally skipped
  '178a47be': ['yoga', 'yoga-room-entrance', 3200],
  d5fb8eb6: ['yoga', 'ganesha-statue', 3200],
  e1e48ad2: ['yoga', 'shala-set-up-with-mats', 3200],
  // spa
  c47c41cb: ['spa', 'exhale-spa', 3200],
  '51f7f6cc': ['spa', 'spa-treatment-room', 3200],
  // food
  '280212a8': ['food', 'tofu-cashew-curry', 3200],
  '63902a37': ['food', 'mexican-bean-wraps', 3200],
  '353e0d2d': ['food', 'noodle-salad', 3200],
  // gallery: Agung
  '8b10d97a': ['gallery', 'agung-canopy-bed', 3200],
  '2516867c': ['gallery', 'agung-ensuite-bath', 3200],
  '6fe930df': ['gallery', 'agung-bedroom', 3200],
  '570f3281': ['gallery', 'agung-veranda', 3200],
  e0feeb0e: ['gallery', 'agung-timber-ceiling', 3200],
  // Batukaru
  '1cab49fa': ['gallery', 'batukaru-bedroom-wide', 3200],
  a0007530: ['gallery', 'batukaru-veranda', 3200],
  '6cb715c6': ['gallery', 'batukaru-bedroom', 3200],
  '91c3852f': ['gallery', 'batukaru-bedroom-desk', 3200],
  '2a40da28': ['gallery', 'batukaru-petal-bath', 3200],
  a625b014: ['gallery', 'batukaru-ensuite-vanity', 3200],
  // Catur
  e1addf58: ['gallery', 'catur-bedroom-framed', 3200],
  '406f5b8d': ['gallery', 'catur-bedroom-portrait-art', 3200],
  cae49497: ['gallery', 'catur-bedroom', 3200],
  e8f58b73: ['gallery', 'catur-bedroom-wall', 3200],
  dcb6e008: ['gallery', 'catur-rain-shower', 3200],
  // Batur
  a4025be4: ['gallery', 'batur-two-beds', 3200],
  '5c1bcad2': ['gallery', 'batur-ensuite-vanity', 3200],
  a1d37fac: ['gallery', 'batur-seating-nook', 3200],
  c981078f: ['gallery', 'batur-three-beds', 3200],
  f99496fb: ['gallery', 'batur-twin-beds', 3200],
  ad17aa64: ['gallery', 'batur-window-bed', 3200],
  // Abang
  '34bfdccd': ['gallery', 'abang-garden-terrace', 3200],
  ebbe6757: ['gallery', 'abang-ensuite', 3200],
  '275870cb': ['gallery', 'abang-bedroom', 3200],
  '44e22d5c': ['gallery', 'abang-stone-shower', 3200],
  '121c065b': ['gallery', 'abang-pool-wall-garden', 3200],
  e6f625ae: ['gallery', 'abang-garden-staircase', 3200],
  // Living area
  '00898232': ['gallery', 'living-dining-kitchen', 3200],
  '267fa72e': ['gallery', 'living-dining-wide', 3200],
  '6b85387f': ['gallery', 'living-lounge-mural', 3200],
  '0f0b8b75': ['gallery', 'living-retreat-group-sofa', 3200],
  '99e7ff26': ['gallery', 'living-infinity-pool', 3200],
  '0cbc1ba1': ['gallery', 'living-pool-pavilion', 3200],
  '0ed3ce5c': ['gallery', 'living-infinity-pool-edge', 3200],
  e168f7de: ['gallery', 'living-poolside-yoga', 3200],
  // Happy snaps
  f2ea6f6b: ['gallery', 'snaps-villa-render', 3200],
  '339f8204': ['gallery', 'snaps-staircase-hall', 3200],
  '2915eece': ['gallery', 'snaps-aerial-view', 3200],
  bccd2060: ['gallery', 'snaps-carved-entry-door', 3200],
  f8814167: ['gallery', 'snaps-staff-jumping', 3200],
  '689c62ab': ['gallery', 'snaps-towel-art-bed', 3200],
  c19118c1: ['gallery', 'snaps-entrance-courtyard', 3200],
  '6e5dabf6': ['gallery', 'snaps-towel-swans', 3200],
  e28fa068: ['gallery', 'snaps-flower-mandala', 3200],
  '180a6e47': ['gallery', 'snaps-kitten-statue', 3200],
  ca99018f: ['gallery', 'snaps-offerings-on-steps', 3200],
};

const OG = [
  ['home', '5b4378d4', 'centre'],
  ['rooms', '6fe930df', 'centre'],
  ['yoga', '0ef9903b', 'centre'],
  ['spa', '51f7f6cc', 'centre'],
  ['food', '280212a8', 'centre'],
  ['photos', '2915eece', 'centre'],
  ['contact', '99e7ff26', 'centre'],
];

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
const byPrefix = (p) => files.find((f) => f.startsWith(`1ae893_${p}`));
const manifest = {};
let missing = 0;

for (const [prefix, [section, name, maxEdge]] of Object.entries(MAP)) {
  const file = byPrefix(prefix);
  if (!file) { console.warn('MISSING', prefix); missing++; continue; }
  const wixId = file;
  if (!section) { manifest[name] = { skipped: true, reason: 'duplicate of 0ef9903b', wixId }; continue; }

  const input = sharp(path.join(SRC, file), { limitInputPixels: false }).rotate();
  const meta = await input.metadata();
  const isPng = /\.png$/i.test(file) && meta.hasAlpha;
  const ext = isPng ? 'png' : 'jpg';
  await mkdir(path.join(PUB, section), { recursive: true });
  const out = path.join(PUB, section, `${name}.${ext}`);

  let pipeline = input.clone().resize({ width: maxEdge, height: maxEdge, fit: 'inside', withoutEnlargement: true });
  pipeline = isPng
    ? pipeline.png({ compressionLevel: 9, palette: false })
    : pipeline.jpeg({ quality: 90, mozjpeg: true, progressive: true, chromaSubsampling: '4:4:4' });
  const info = await pipeline.toFile(out);

  const blur = await input.clone().resize(16, 16, { fit: 'inside' }).webp({ quality: 40 }).toBuffer();
  manifest[name] = {
    src: `/images/${section}/${name}.${ext}`,
    width: info.width,
    height: info.height,
    blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
    wixId,
  };
  console.log(`${section}/${name}.${ext}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

// Open Graph crops (1200x630)
await mkdir(path.join(PUB, 'og'), { recursive: true });
for (const [page, prefix] of OG) {
  await sharp(path.join(SRC, byPrefix(prefix)), { limitInputPixels: false })
    .rotate().resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(PUB, 'og', `og-${page}.jpg`));
}

// Icons: the rice-plant mark centred in a white circle (as on the original logo oval)
const logo = path.join(SRC, byPrefix('f9bc4b25'));
async function icon(size, out, round) {
  const inner = Math.round(size * 0.74);
  const plant = await sharp(logo).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const bg = round
    ? Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`)
    : Buffer.from(`<svg width="${size}" height="${size}"><rect width="100%" height="100%" fill="#fff"/></svg>`);
  await sharp(bg).composite([{ input: plant, gravity: 'centre' }]).png().toFile(out);
}
await icon(512, path.join(APP, 'icon.png'), true);
await icon(180, path.join(APP, 'apple-icon.png'), false);
await copyFile(path.join(SRC, 'favicon.ico'), path.join(APP, 'favicon.ico'));

await mkdir(path.join(ROOT, 'src', 'data'), { recursive: true });
await writeFile(path.join(ROOT, 'src', 'data', 'images.generated.json'), JSON.stringify(manifest, null, 2));
console.log(`\n${Object.keys(manifest).length} originals accounted for (${missing} missing).`);
if (missing) process.exitCode = 1;
