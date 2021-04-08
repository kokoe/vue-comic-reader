<template>
  <section>
    <h2 class="title is-2">Standard</h2>
    <VueComicReader :pages="pages">
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
        'https://placekitten.com/128/182',
        'https://placekitten.com/128/182',
        'https://placekitten.com/128/182',
        'https://placekitten.com/128/182',
        'https://placekitten.com/128/182'
      ]
    };
  }
});
</script>

<style lang="scss">
</style>
