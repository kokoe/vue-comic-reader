<template>
  <section>
    <h2 class="title is-2">Lazy</h2>
    <VueComicReader
      title="Lazy"
      :pages="pages"
      height="50vh"
      :lazy="lazyOptions"
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import VueComicReader from './vue-comic-reader/index.vue';

export default Vue.extend({
  name: 'ExampleLazy',
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
