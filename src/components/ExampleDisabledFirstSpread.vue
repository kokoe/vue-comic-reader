<template>
  <section>
    <h2 class="title is-2">
      Disabled Spread only First
      <a class="pl-2" href="https://github.com/kokoe/vue-comic-reader/blob/main/src/components/ExampleDisabledFirstSpread.vue" target="_blank"><Icon icon-name="code-tags" /></a>
    </h2>
    <VueComicReader
      title="Disabled Spread only First"
      :pages="pages"
      height="50vh"
      first-unspread
    />
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import VueComicReader from './vue-comic-reader/index.vue';
import Icon from '@/components/icon/icon.vue';

export default Vue.extend({
  name: 'ExampleDisabledFirstSpread',
  components: {
    VueComicReader,
    Icon
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
