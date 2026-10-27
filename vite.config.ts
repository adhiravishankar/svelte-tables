import { defineConfig } from 'vite-plus';

export default defineConfig({
  // replaces .prettierrc and .prettierignore
  fmt: {
    ignorePatterns: [
      '**/dist/**',
      '**/storybook-static/**',
      '**/.astro/**',
      '**/node_modules/**',
      '**/*.json',
      '**/*.md',
      '**/*.mdx',
      '**/*.svelte',
      'package-lock.json',
    ],
    printWidth: 80,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
  },
});
