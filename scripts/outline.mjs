// Prints a plain-text outline of an Elementor post from _source JSON, for inspecting content structure.
import fs from 'node:fs';
import * as cheerio from 'cheerio';

const [file, id] = process.argv.slice(2);
const post = JSON.parse(fs.readFileSync(file, 'utf8')).find((p) => String(p.id) === id);
const $ = cheerio.load(post.content.rendered);
$('.elementor-widget').each((_, el) => {
  const $el = $(el);
  const type = $el.attr('data-widget_type');
  if (type === 'gallery.default') {
    console.log(`[gallery] ${$el.find('a.e-gallery-item').length} images`);
  } else {
    const text = $el.text().replace(/\s+/g, ' ').trim();
    const links = $el.find('a').map((_, a) => $(a).attr('href')).get().filter((h) => h && !h.endsWith('.jpg'));
    console.log(`[${type}] ${text.slice(0, 400)}${links.length ? ' LINKS:' + links.join(',') : ''}`);
  }
});
