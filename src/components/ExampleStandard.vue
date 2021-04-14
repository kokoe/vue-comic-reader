<template>
  <section>
    <h2 class="title is-2">Standard</h2>
    <VueComicReader :pages="pages">
      <template #first-page>
        first page!!!
      </template>
      <template #last-page>
        last page!!!
      </template>
    </VueComicReader>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import VueComicReader from './vue-comic-reader/index.vue';

export default Vue.extend({
  name: 'ExampleStandard',
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

<style lang="scss">
</style>
