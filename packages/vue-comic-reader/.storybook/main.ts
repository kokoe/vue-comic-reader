import type { StorybookConfig } from '@storybook/vue3-vite';

/**
 * @see
 * - https://storybook.js.org/tutorials/intro-to-storybook/vue/en/get-started/
 * - https://storybook.js.org/docs/configure/typescript
 */

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
