<template>
  <div id="app" class="l-wrapper">
    <div class="hero mb-4">
      <div class="hero-body has-text-centered">
        <h1 class="title is-1">vue-comic-reader</h1>
        <p class="subtitle">Comic Reader Component For Vue.js</p>
      </div>
    </div>
    <ExampleStandard class="container" />
    <ExampleVertical class="container" />
    <ExampleDisabledSpread class="container" />
    <ExampleDisabledFirstSpread class="container" />
    <ExampleReverseHorizontal class="container" />
    <ExampleChangeinitialPage class="container" />
    <ExampleSlot class="container" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ExampleStandard from './components/ExampleStandard.vue';
import ExampleVertical from './components/ExampleVertical.vue';
import ExampleDisabledSpread from './components/ExampleDisabledSpread.vue';
import ExampleDisabledFirstSpread from './components/ExampleDisabledFirstSpread.vue';
import ExampleReverseHorizontal from './components/ExampleReverseHorizontal.vue';
import ExampleChangeinitialPage from './components/ExampleChangeinitialPage.vue';
import ExampleSlot from './components/ExampleSlot.vue';

export default Vue.extend({
  name: 'App',
  components: {
    ExampleStandard,
    ExampleVertical,
    ExampleDisabledFirstSpread,
    ExampleDisabledSpread,
    ExampleReverseHorizontal,
    ExampleChangeinitialPage,
    ExampleSlot
  }
});
</script>

<style lang="scss">
@import '~bulma';

.l-wrapper {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 30px;
}

.container {
  margin-bottom: 60px;
}
</style>
