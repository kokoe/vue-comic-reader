<template>
  <section>
    <h2 class="title is-2">Standard</h2>
    <VueComicReader />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import VueComicReader from './vue-comic-reader/index.vue';

export default Vue.extend({
  name: 'ExampleStandard',
  components: {
    VueComicReader
  }
});
</script>

<style lang="scss">
</style>
