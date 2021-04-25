<template>
  <section>
    <h2 class="title is-2">
      Change Theme
      <a class="pl-2" href="https://github.com/kokoe/vue-comic-reader/blob/main/src/components/ExampleChangeTheme.vue" target="_blank"><Icon icon-name="code-tags" /></a>
    </h2>
    <VueComicReader class="vcr-custom-theme"
      title="Change Theme"
      :pages="pages"
      height="80vh"
      lazy
      navigation
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import VueComicReader from './vue-comic-reader/index.vue';
import Icon from '@/components/icon/icon.vue';

export default Vue.extend({
  name: 'ExampleChangeTheme',
  components: {
    VueComicReader,
    Icon
  },
  data () {
    return {
      lazyOptions: true,
      pages: [
        'https://placekitten.com/128/181',
        'https://placekitten.com/128/182',
        'https://placekitten.com/128/183',
        'https://placekitten.com/128/184',
        'https://placekitten.com/128/185'
      ]
    };
  }
});
</script>

<style>
.vcr-custom-theme {
  --vcr-theme-primary-color: #ff7096;
  --vcr-theme-secondary-color: #ff0a54;
  --vcr-theme-menu-font-color: #fff;
  --vcr-menu-animation-duration: 0.5s;
  --vcr-menu-padding: 8px;
  --vcr-menu-height: 42px;
  --vcr-menu-icon-width: 18px;
  --vcr-menu-icon-height: 18px;
  --vcr-menu-header-shadow: none;
  --vcr-menu-footer-shadow: none;
  --vcr-menu-slider-color: var(--vcr-theme-secondary-color);
  --vcr-menu-slider-bg-color: rgba(255,255,255,0.6);
  --vcr-overlay-color:rgba(0,0,0,0.5);
  --swiper-theme-color: var(--vcr-theme-primary-color);
  --swiper-navigation-color: var(--vcr-theme-primary-color);
  --swiper-preloader-color: var(--vcr-theme-primary-color);
}
</style>
