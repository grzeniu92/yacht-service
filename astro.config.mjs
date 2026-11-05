// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// Served from GitHub Pages project URL. With a custom domain use site: 'https://yachtservice.com.pl' and drop base.
export default defineConfig({
  site: 'https://grzeniu92.github.io',
  base: '/yacht-service',
  i18n: {
    defaultLocale: 'pl',
    locales: ['pl', 'en', 'de'],
    routing: { prefixDefaultLocale: false },
  },
});
