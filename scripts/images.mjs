// Copies only the photos the site actually uses from _source/uploads into src/assets/photos (GIFs become PNG).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf8'));
const extra = ['da-vinci-35-3.jpeg', 'LeonardoYachts-Logo.png', 'DaVinciYachts-logo.png', 'mantra-yachts-logo.gif', 'bente-yachts-logo.png'];
const used = new Set([...extra, ...products.flatMap((p) => [p.featured, ...p.gallery])]);

fs.mkdirSync('src/assets/photos', { recursive: true });
let missing = 0;
for (const name of used) {
  const from = path.join('_source/uploads', name);
  if (!fs.existsSync(from)) { console.warn('missing', name); missing++; continue; }
  const to = path.join('src/assets/photos', name.replace(/\.gif$/i, '.png'));
  if (name.endsWith('.gif')) await sharp(from).png().toFile(to);
  else fs.copyFileSync(from, to);
}
console.log(`${used.size - missing} photos copied`);
