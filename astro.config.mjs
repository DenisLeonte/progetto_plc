import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://DenisLeonte.github.io',
  base: '/progetto_plc',
  integrations: [react()],
  output: 'static',
});
