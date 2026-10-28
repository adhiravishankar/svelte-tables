# Material Svelte Table docs

The documentation site for `material-svelte-tanstack-table`, built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build). Every table on the site is a Svelte 5 island, rendered on the server and
hydrated in the browser (`client:load`).

## Commands

Run from this folder (or with `npm run <script> -w material-svelte-tanstack-table-docs`):

| Command          | What it does                                                                 |
| ---------------- | ---------------------------------------------------------------------------- |
| `npm run dev`       | Dev server on :3000. Uses the library's **source**, so edits show immediately |
| `npm run build`     | Production build into `dist/`. Uses the **built** package, like a consumer   |
| `npm run preview`   | Serves `dist/` on :4000                                                      |
| `npm run check`     | Type-checks the `.astro` pages and the Svelte examples                       |

`npm run build` needs the library built first (`npm run build -w material-svelte-tanstack-table`); Vite+ does this for you
when you run `npm run build` from the repository root.

Set `SITE_URL` when deploying to enable the sitemap and canonical URLs.

## Where things live

```
src/
  content/docs/        the pages (MDX): getting-started, guides, examples, api
  examples/            the Svelte examples. Each is shown live AND as source on its page
  components/          Example.astro (frames a live example), ExampleSource.astro (shows its code)
  data/                seeded fake data and a fake server for the examples
  styles/custom.css    maps Starlight's colors onto the Material theme variables
scripts/generate-api.mjs   builds the API reference from the library's types
```

### Adding an example

1. Create `src/examples/MyExample.svelte`. Import from `'material-svelte-tanstack-table'`, as a consumer would.
2. Create a page under `src/content/docs/examples/`:

   ```mdx
   ---
   title: "My Example"
   description: "What it shows."
   ---

   import Example from '../../../components/Example.astro';
   import ExampleSource from '../../../components/ExampleSource.astro';
   import MyExample from '../../../examples/MyExample.svelte';

   <Example>
     <MyExample client:load />
   </Example>

   <ExampleSource name="MyExample" />
   ```

The code on the page is read from the example file, so it can never drift from what runs above it.

### The API reference

`api/table-options.mdx`, `api/column-options.mdx` and `api/state.mdx` are **generated** (and git-ignored) from
`packages/material-tanstack-table/src/lib/types.ts` and its JSDoc, plus the defaults in `tableOptions.ts`. They run
automatically before `dev` and `build`. To improve a description, edit the JSDoc comment in `types.ts`.

## Notes

- `client:load` islands are server-rendered first. A virtualized table has no rows in the server HTML (there is no
  scroll container to measure) and fills in when it hydrates.
