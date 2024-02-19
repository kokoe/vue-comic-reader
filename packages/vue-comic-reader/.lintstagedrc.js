export default {
  '*.{vue,ts}': [
    'prettier -w',
    'eslint --fix',
    // 'vue-tsc --noEmit', // TODO うまくいかないので後で
    // () => 'vitest run',
  ],
};
