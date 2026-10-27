import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: { $lib: fileURLToPath(new URL('./src/lib', import.meta.url)) },
    conditions: process.env.VITEST ? ['browser'] : undefined,
  },
  test: {
    environment: 'jsdom',
    include: [
      'src/**/*.test.{ts,svelte.ts}',
      'stories/**/*.test.{ts,svelte.ts}',
    ],
    server: { deps: { inline: [/bits-ui/] } },
  },
});
