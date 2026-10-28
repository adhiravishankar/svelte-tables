import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview } from '@storybook/svelte-vite';
import './tailwind.css';
import './theme.css';

const preview: Preview = {
  decorators: [
    withThemeByDataAttribute({
      attributeName: 'data-theme',
      defaultTheme: 'light',
      themes: { dark: 'dark', light: 'light' },
    }),
  ],
  parameters: {
    layout: 'padded',
  },
};

export default preview;
