import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import rehypeBase from '../../scripts/rehype-base.mjs';

// While running `astro dev`, use the library's source so edits show up without
// rebuilding the package. `astro build` uses the real, built package, which is
// what consumers get (its exports, types and `styles.css`).
const useLibrarySource = process.argv.includes('dev');
const lib = (path) =>
  fileURLToPath(
    new URL(`../../packages/bootstrap-headless-table/${path}`, import.meta.url),
  );

export default defineConfig({
  // Set SITE_URL when deploying; it enables the sitemap and canonical URLs.
  // Cloudflare Pages provides CF_PAGES_URL (the URL of the current deployment).
  site: process.env.SITE_URL ?? process.env.CF_PAGES_URL,
  // Set BASE_PATH to serve the site from a sub path (GitHub Pages: /svelte-tables/<site>).
  base: process.env.BASE_PATH,
  markdown: {
    rehypePlugins: [[rehypeBase, { base: process.env.BASE_PATH }]],
  },
  integrations: [
    svelte(),
    starlight({
      title: 'Bootstrap Headless Table',
      description:
        'A Bootstrap 5 data table for Svelte 5, built on Svelte Headless Table and Svelte Virtual List.',
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl:
          'https://github.com/adhiravishankar/svelte-tables/edit/main/apps/bootstrap-headless-table-docs/',
      },
      social: [
        {
          href: 'https://github.com/adhiravishankar/svelte-tables',
          icon: 'github',
          label: 'GitHub',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { slug: 'getting-started/install' },
            { slug: 'getting-started/usage' },
          ],
        },
        { items: [{ autogenerate: { directory: 'guides' } }], label: 'Guides' },
        {
          items: [{ autogenerate: { directory: 'examples' } }],
          label: 'Examples',
        },
        { items: [{ slug: 'api/options' }], label: 'API Reference' },
      ],
    }),
  ],
  vite: {
    // The library ships .svelte files and @humanspeak/svelte-headless-table,
    // which Node cannot import as is, so Vite has to bundle them for the
    // prerender.
    environments: {
      prerender: {
        resolve: {
          noExternal: [/^@humanspeak\//, 'bootstrap-svelte-headless-table'],
        },
      },
    },
    resolve: useLibrarySource
      ? {
          alias: [
            {
              find: /^bootstrap-svelte-headless-table\/styles\.css$/,
              replacement: lib('src/lib/styles.css'),
            },
            {
              find: /^bootstrap-svelte-headless-table$/,
              replacement: lib('src/lib/index.ts'),
            },
          ],
        }
      : {},
  },
});
