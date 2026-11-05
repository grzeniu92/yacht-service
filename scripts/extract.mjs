// Turns the raw WordPress/Elementor JSON in _source into clean data for the Astro site (src/data/*.json).
import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const read = (f) => JSON.parse(fs.readFileSync(`_source/${f}`, 'utf8'));
const portfolio = read('dt_portfolio.json');
const pages = read('pages.json');
const media = read('media.json');

const langOf = (link) => (link.includes('/en/') ? 'en' : link.includes('/de/') ? 'de' : 'pl');
// Also repairs run-on sentences in the source text ("…żeglarza.BENTE 39").
const clean = (s) =>
  s
    .replace(/\s+/g, ' ')
    .replace(/([a-zäöüßąćęłńóśźż]{3,})\.([A-ZÄÖÜĄĆĘŁŃÓŚŹŻ])/g, '$1. $2')
    .trim();
const file = (url) => decodeURIComponent(path.basename(url));
const mediaById = new Map(media.map((m) => [m.id, file(m.url)]));

/** Walks Elementor widgets and returns simplified blocks. */
function blocks(html) {
  const $ = cheerio.load(html);
  const out = [];
  $('.elementor-widget').each((_, el) => {
    const $el = $(el);
    const type = $el.attr('data-widget_type')?.replace('.default', '');
    if (type === 'gallery') {
      out.push({ type, images: $el.find('a.e-gallery-item').map((_, a) => file($(a).attr('href'))).get() });
    } else if (type === 'text-editor') {
      const paragraphsOf = () => $el.find('p, li').map((_, p) => clean($(p).text())).get().filter(Boolean);
      let paragraphs = paragraphsOf();
      if (!paragraphs.length) {
        // Body text without <p>: drop the repeated title heading but keep the rest.
        const title = clean($('.elementor-heading-title').first().text());
        $el.find('h1,h2,h3,h4').each((_, h) => { if (clean($(h).text()) === title) $(h).remove(); });
        paragraphs = [clean($el.text())].filter(Boolean);
      }
      out.push({ type, paragraphs });
    } else if (type === 'price-list') {
      const specs = $el.find('li').map((_, li) => ({
        label: clean($(li).find('.elementor-price-list-title').text()),
        value: clean($(li).find('.elementor-price-list-description').text()),
      })).get();
      out.push({ type: 'specs', specs });
    } else if (type === 'heading') {
      out.push({ type, text: clean($el.text()) });
    } else {
      out.push({ type, text: clean($el.text()), links: $el.find('a').map((_, a) => $(a).attr('href')).get() });
    }
  });
  return out;
}

const categoryOf = { 32: 'sailing', 42: 'motor', 44: 'catamaran', 43: 'laminates', 73: 'sailing', 75: 'motor', 79: 'catamaran', 81: 'laminates', 62: 'sailing', 60: 'motor', 66: 'catamaran', 64: 'laminates' };
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ł/g, 'l').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Group translations by shared featured image.
const groups = new Map();
for (const p of portfolio) {
  const lang = langOf(p.link);
  (groups.get(p.featured_media) ?? groups.set(p.featured_media, {}).get(p.featured_media))[lang] = p;
}
const RENAMED = { 38: 'eagle-38', 44: 'eagle-44' };
const SKIP = new Set(['six-cafe-racer']); // unfinished draft with lorem ipsum, not linked from the old menu
const products = [];
for (const [featured, g] of groups) {
  const pl = g.pl;
  const b = blocks(pl.content.rendered);
  const gallery = b.find((x) => x.type === 'gallery')?.images ?? [];
  const i18n = {};
  for (const lang of ['pl', 'en', 'de']) {
    const post = g[lang];
    if (!post) continue;
    const pb = blocks(post.content.rendered);
    i18n[lang] = {
      title: clean(pb.find((x) => x.type === 'heading')?.text ?? post.title.rendered),
      description: pb.find((x) => x.type === 'text-editor')?.paragraphs ?? [],
      specs: pb.find((x) => x.type === 'specs')?.specs.filter((s) => s.value && s.value !== '-') ?? [],
    };
  }
  const base = slugify(i18n.pl.title);
  if (SKIP.has(base)) continue;
  if (RENAMED[base]) for (const l of Object.keys(i18n)) i18n[l].title = `Eagle ${base}`;
  products.push({
    slug: RENAMED[base] ?? base,
    category: categoryOf[pl.dt_portfolio_category[0]],
    featured: mediaById.get(featured),
    gallery,
    i18n,
  });
}

const pageData = {};
for (const p of pages) {
  const lang = langOf(p.link);
  pageData[p.id] = { lang, slug: p.slug, title: clean(p.title.rendered), blocks: blocks(p.content.rendered) };
}

// The old site left Raku 32 untranslated and a stray editor note in the SiX text; fix both here.
const OVERRIDES = {
  'raku-32': {
    en: ['Raku is a modern 32-foot catamaran with a sporty character. Designed by Tony Grainer, this twin-hull boat will satisfy anyone looking for a high-performance craft. We offer two versions of the Raku 32 – a sport version and a cruising version.'],
    de: ['Die Raku ist ein moderner 32-Fuß-Katamaran mit sportlichem Charakter. Der von Tony Grainer entworfene Zweirumpfer überzeugt jeden, der ein leistungsstarkes Boot sucht. Wir bieten die Raku 32 in zwei Versionen an – als Sport- und als Tourenversion.'],
  },
};
for (const p of products) {
  for (const [lang, d] of Object.entries(p.i18n)) {
    d.description = OVERRIDES[p.slug]?.[lang] ?? d.description.map((t) => t.replace('(samoodplywowy?!)', 'self-draining'));
  }
}

fs.mkdirSync('src/data', { recursive: true });
fs.writeFileSync('src/data/products.json', JSON.stringify(products, null, 2));
fs.writeFileSync('_source/pages-clean.json', JSON.stringify(pageData, null, 2));
console.log(products.map((p) => `${p.category.padEnd(10)} ${p.slug.padEnd(20)} gallery=${p.gallery.length} langs=${Object.keys(p.i18n)} specs=${p.i18n.pl.specs.length}`).join('\n'));
