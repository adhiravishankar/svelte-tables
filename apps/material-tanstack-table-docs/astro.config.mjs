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
    new URL(`../../packages/material-tanstack-table/${path}`, import.meta.url),
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
      title: 'Material Svelte Table',
      description:
        'A fully featured Material Design data table for Svelte 5, built on TanStack Table v9 and Svelte Material UI.',
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl:
          'https://github.com/adhiravishankar/svelte-tables/edit/main/apps/material-tanstack-table-docs/',
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
            { slug: 'getting-started/migrating-from-react' },
          ],
        },
        { items: [{ autogenerate: { directory: 'guides' } }], label: 'Guides' },
        {
          items: [{ autogenerate: { directory: 'examples' } }],
          label: 'Examples',
        },
        {
          items: [{ autogenerate: { directory: 'api' } }],
          label: 'API Reference',
        },
      ],
    }),
  ],
  vite: {
    // SMUI ships ESM with extensionless relative imports, which Node cannot
    // resolve, so Vite has to bundle it (and the library that imports it)
    // for the prerender.
    environments: {
      prerender: {
        resolve: { noExternal: [/^@smui\//, 'material-svelte-tanstack-table'] },
      },
    },
    resolve: useLibrarySource
      ? {
          alias: [
            {
              find: /^material-svelte-tanstack-table\/styles\.css$/,
              replacement: lib('src/lib/styles.css'),
            },
            {
              find: /^material-svelte-tanstack-table$/,
              replacement: lib('src/lib/index.ts'),
            },
          ],
        }
      : {},
  },
});
