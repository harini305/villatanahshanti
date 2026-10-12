// Downloads the original Wix media (64 images + video poster + favicon + hero video)
// into assets-src/ (gitignored). Run once: `npm run assets:fetch`.
// Source list: planning/research/media-originals.txt
import { readFile, mkdir, stat, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'assets-src');
const LIST = path.join(ROOT, 'planning', 'research', 'media-originals.txt');

const EXTRA = [
  { name: '1ae893_5b4378d4cf4841fbbd2019dfed802db0~mv2.jpg', url: 'https://static.wixstatic.com/media/1ae893_5b4378d4cf4841fbbd2019dfed802db0~mv2.jpg' },
  { name: 'favicon.ico', url: 'https://static.wixstatic.com/ficons/1ae893_ce3076b4dce34c4f8dca8ceced7f89f9%7Emv2.ico' },
  { name: 'hero-video-1080p.mp4', url: 'https://video.wixstatic.com/video/1ae893_898e7b7b81a64af9b83fc9b2c1d7542d/1080p/mp4/file.mp4' },
];

async function exists(p) {
  try { return (await stat(p)).size > 0; } catch { return false; }
}

async function download({ name, url }, attempt = 1) {
  const dest = path.join(OUT, name);
  if (await exists(dest)) return { name, status: 'cached' };
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (asset archive for site rebuild)' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
    const { size } = await stat(dest);
    return { name, status: 'ok', size };
  } catch (err) {
    if (attempt < 3) return download({ name, url }, attempt + 1);
    return { name, status: `failed: ${err.message}` };
  }
}

const lines = (await readFile(LIST, 'utf8')).split(/\r?\n/).filter(Boolean);
const items = lines.map((l) => {
  const name = l.split('|')[0].trim();
  return { name, url: `https://static.wixstatic.com/media/${name}` };
});
items.push(...EXTRA);

await mkdir(OUT, { recursive: true });
const results = [];
const queue = [...items];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const r = await download(queue.shift());
      results.push(r);
      console.log(`${r.status.padEnd(8)} ${r.name}${r.size ? ` (${(r.size / 1e6).toFixed(1)} MB)` : ''}`);
    }
  })
);
await writeFile(path.join(OUT, 'download-log.json'), JSON.stringify(results, null, 2));
const failed = results.filter((r) => r.status.startsWith('failed'));
console.log(`\n${results.length - failed.length}/${results.length} assets available.`);
if (failed.length) process.exitCode = 1;
