import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// While running `astro dev`, use the library's source so edits show up without
// rebuilding the package. `astro build` uses the real, built package, which is
// what consumers get (its exports, types and `styles.css`).
const useLibrarySource = process.argv.includes('dev');
const lib = (path) =>
  fileURLToPath(new URL(`../../packages/material-headless-table/${path}`, import.meta.url));

export default defineConfig({
  // Set SITE_URL when deploying; it enables the sitemap and canonical URLs.
  site: process.env.SITE_URL,
  integrations: [
    svelte(),
    starlight({
      title: 'Material Headless Table',
      description:
        'A Material Design data table for Svelte 5, built on Svelte Headless Table, Svelte Virtual List and Svelte Material UI.',
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl:
          'https://github.com/adhiravishankar/svelte-tables/edit/main/apps/material-headless-table-docs/',
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
    // SMUI ships ESM with extensionless relative imports, which Node cannot
    // resolve, so Vite has to bundle it (and the library that imports it)
    // for the prerender.
    environments: {
      prerender: {
        resolve: { noExternal: [/^@smui\//, /^@humanspeak\//, 'material-svelte-headless-table'] },
      },
    },
    resolve: useLibrarySource
      ? {
          alias: [
            {
              find: /^material-svelte-headless-table\/styles\.css$/,
              replacement: lib('src/lib/styles.css'),
            },
            {
              find: /^material-svelte-headless-table$/,
              replacement: lib('src/lib/index.ts'),
            },
          ],
        }
      : {},
  },
});
