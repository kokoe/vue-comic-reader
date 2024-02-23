import VueComicReader from './VueComicReader.vue';
import type { App } from 'vue';

export { VueComicReader };

const plugin = {
  install(Vue: App) {
    Vue.component('VueComicReader', VueComicReader);
  },
};

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VueComicReader: typeof VueComicReader;
  }
}

export default plugin;
