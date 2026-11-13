import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
  addons: [
    '@storybook/addon-svelte-csf',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
  stories: ['../stories/**/*.stories.svelte', '../stories/**/*.mdx'],
};

export default config;
