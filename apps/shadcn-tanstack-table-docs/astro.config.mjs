import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// While running `astro dev`, use the library's source so edits show up without
// rebuilding the package. `astro build` uses the real, built package, which is
// what consumers get (its exports, types and `styles.css`).
const useLibrarySource = process.argv.includes('dev');
const lib = (path) =>
  fileURLToPath(
    new URL(`../../packages/shadcn-tanstack-table/${path}`, import.meta.url),
  );

export default defineConfig({
  // Set SITE_URL when deploying; it enables the sitemap and canonical URLs.
  site: process.env.SITE_URL,
  integrations: [
    svelte(),
    starlight({
      title: 'Shadcn Svelte Table',
      description:
        'A fully featured shadcn-svelte data table for Svelte 5, built on TanStack Table v9, bits-ui and Tailwind CSS.',
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl:
          'https://github.com/adhiravishankar/svelte-tables/edit/main/apps/shadcn-tanstack-table-docs/',
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
    plugins: [tailwindcss()],
    // The library ships .svelte files and bits-ui, which Node cannot import
    // as is, so Vite has to bundle them for the prerender.
    environments: {
      prerender: {
        resolve: { noExternal: [/^bits-ui/, 'shadcn-svelte-tanstack-table'] },
      },
    },
    resolve: useLibrarySource
      ? {
          alias: [
            {
              find: /^shadcn-svelte-tanstack-table\/styles\.css$/,
              replacement: lib('src/lib/styles.css'),
            },
            {
              find: /^shadcn-svelte-tanstack-table$/,
              replacement: lib('src/lib/index.ts'),
            },
          ],
        }
      : {},
  },
});
