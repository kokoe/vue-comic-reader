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
      <template #first-page>
        <div data-show-menu="true" class="columns is-flex-direction-column is-justify-content-center is-align-items-center" style="height: 100%;">
          <figure class="image">
            <img data-show-menu="true" src="https://placekitten.com/g/200/200" alt="" class="is-rounded">
          </figure>
          <p data-show-menu="true" class="my-4 is-size-5">Kitten photos.</p>
          <button class="button is-primary" @click="onClickStart">Start</button>
        </div>
      </template>
      <template #last-page>
        <div class="columns is-flex-direction-column is-justify-content-center is-align-items-center" style="height: 100%;">
          <div class="card" style="width: 30%">
            <div class="card-image">
              <figure class="image is-4by3">
                <img src="http://placekitten.com/g/128/96" alt="Placeholder image">
              </figure>
            </div>
            <div class="card-content">
              <div class="content">
                <p class="mb-2">See More?</p>
                <p class="is-size-5"><a href="https://placekitten.com/" target="_blank">placekitten</a></p>
              </div>
            </div>
          </div>
        </div>
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
