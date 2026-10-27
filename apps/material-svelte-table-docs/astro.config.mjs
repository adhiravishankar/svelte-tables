import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// While running `astro dev`, use the library's source so edits show up without
// rebuilding the package. `astro build` uses the real, built package, which is
// what consumers get (its exports, types and `styles.css`).
const useLibrarySource = process.argv.includes('dev');
const lib = (path) =>
  fileURLToPath(new URL(`../../packages/material-svelte-table/${path}`, import.meta.url));

export default defineConfig({
  integrations: [
    svelte(),
    starlight({
      title: 'Material Svelte Table',
      description:
        'A fully featured Material Design data table for Svelte 5, built on TanStack Table v9 and Svelte Material UI.',
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl:
          'https://github.com/KevinVandy/material-react-table/edit/v3/apps/material-svelte-table-docs/',
      },
      social: [
        {
          href: 'https://github.com/KevinVandy/material-react-table',
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
        { autogenerate: { directory: 'guides' }, label: 'Guides' },
        { autogenerate: { directory: 'examples' }, label: 'Examples' },
        { autogenerate: { directory: 'api' }, label: 'API Reference' },
      ],
    }),
  ],
  vite: {
    resolve: useLibrarySource
      ? {
          alias: [
            {
              find: /^material-svelte-table\/styles\.css$/,
              replacement: lib('src/lib/styles.css'),
            },
            { find: /^material-svelte-table$/, replacement: lib('src/lib/index.ts') },
          ],
        }
      : {},
  },
});
