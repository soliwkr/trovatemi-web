import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile',
    inspectorPort: 9229,
  }),
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: true,
    },
  },
});
