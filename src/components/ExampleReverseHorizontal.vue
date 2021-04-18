<template>
  <section>
    <h2 class="title is-2">Reverse horizontal</h2>
    <VueComicReader :pages="pages" height="50vh" reverse-horizontal />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import VueComicReader from './vue-comic-reader/index.vue';

export default Vue.extend({
  name: 'ExampleReverseHorizontal',
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
