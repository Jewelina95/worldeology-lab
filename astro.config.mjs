import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://jewelina95.github.io',
  output: 'static',
  build: {
    assets: '_assets'
  },
  vite: {
    build: {
      cssMinify: 'lightningcss'
    }
  }
});
