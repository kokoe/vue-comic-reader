import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{vue,ts}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
