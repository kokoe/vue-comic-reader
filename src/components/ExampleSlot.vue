<template>
  <section>
    <h2 class="title is-2">Use Slot</h2>
    <VueComicReader
      ref="vcr"
      title="Use Slot"
      :pages="pages"
      height="50vh"
    >
      <template #header-brand>
        <h3>vue-comic-reader - Use slot</h3>
      </template>
      <template #first-page="slotScope">
        <div data-show-menu="true" class="columns is-flex-direction-column is-justify-content-center is-align-items-center" style="height: 100%;">
          <img data-show-menu="true" src="https://placekitten.com/g/200/200" alt="" style="border-radius: 50%">
          <p data-show-menu="true" class="my-4 is-size-5">Cat stories. Page: {{ slotScope.totalPage }}</p>
          <button class="button is-primary" @click="onClickStart">Start</button>
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
import VueComicReader from './vue-comic-reader/index.vue';

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
  },
  methods: {
    onClickStart (): void {
      (this.$refs.vcr as any).toNext();
    }
  }
});
</script>
