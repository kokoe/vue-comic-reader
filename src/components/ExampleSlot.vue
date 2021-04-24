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
        <div class="columns is-flex-direction-column is-justify-content-center is-align-items-center" style="height: 100%;">
          <img src="https://placekitten.com/g/200/200" alt="" style="border-radius: 50%">
          <p class="mt-4 is-size-5">First page!!!</p>
        </div>
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
