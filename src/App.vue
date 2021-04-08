<template>
  <div id="app" class="l-wrapper">
    <div class="hero mb-4">
      <div class="hero-body has-text-centered">
        <h1 class="title is-1">vue-comic-reader</h1>
        <p class="subtitle">Comic Reader Component For Vue.js</p>
      </div>
    </div>
    <ExampleStandard class="container" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ExampleStandard from './components/ExampleStandard.vue';

export default Vue.extend({
  name: 'App',
  components: {
    ExampleStandard
  }
});
</script>

<style lang="scss">
@import '~bulma';

.l-wrapper {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
