<template>
  <section>
    <h2 class="title is-2">Use Slot</h2>
    <VueComicReader
      title="Use Slot"
      :pages="pages"
      height="50vh"
    >
      <template #header-brand>
        <h3>vue-comic-reader - Use slot</h3>
      </template>
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
import VueComicReader from './vue-comic-reader/manager.vue';

export default Vue.extend({
  name: 'ExampleSlot',
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
