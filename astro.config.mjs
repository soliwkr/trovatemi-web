import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  integrations: [react()],
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
