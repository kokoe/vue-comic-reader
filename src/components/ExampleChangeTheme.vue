<template>
  <section>
    <h2 class="title is-2">Change Theme</h2>
    <VueComicReader class="vcr-custom-theme"
      title="Change Theme"
      :pages="pages"
      height="50vh"
      lazy
      navigation
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import VueComicReader from './vue-comic-reader/manager.vue';

export default Vue.extend({
  name: 'ExampleChangeTheme',
  components: {
    VueComicReader
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
  --vcr-menu-slider-color: var(--vcr-theme-secondary-color);
  --vcr-menu-slider-bg-color: #ccc;
  --swiper-theme-color: var(--vcr-theme-primary-color);
  --swiper-navigation-color: var(--vcr-theme-primary-color);
  --swiper-preloader-color: var(--vcr-theme-primary-color);
}
</style>
