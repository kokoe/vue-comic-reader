<template>
  <section>
    <h2 class="title is-2">Disabled Spread</h2>
    <VueComicReader :pages="pages" height="50vh" :spread="false" />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import VueComicReader from './vue-comic-reader/index.vue';

export default Vue.extend({
  name: 'ExampleDisabledSpread',
  components: {
    VueComicReader
  },
  data () {
    return {
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
