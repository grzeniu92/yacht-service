import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/*.{jpg,jpeg,png}', { eager: true });
const byName = new Map(Object.entries(files).map(([path, mod]) => [decodeURIComponent(path.split('/').pop()!), mod.default]));

/** Looks up a photo copied by scripts/images.mjs by its original file name. */
export function photo(name: string): ImageMetadata {
  const image = byName.get(name.replace(/\.gif$/i, '.png'));
  if (!image) throw new Error(`Photo not found in src/assets/photos: ${name}`);
  return image;
}
