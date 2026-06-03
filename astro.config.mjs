import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://plc-group.it',
  integrations: [react()],
  output: 'static',
});
