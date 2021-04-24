<template>
  <VueComicReader
    :key="key_"
    v-bind="$attrs"
    v-on="$listeners"
    :initial-direction="initialDirection"
    :initial-page="initialPage"
    :initial-notice-direction="noticeDirection"
    @changeDirection="onChangeDirection"
  >
    <template #header><slot name="header" /></template>
    <template #header-brand><slot name="header-brand" /></template>
    <template #footer><slot name="footer" /></template>
    <template #page><slot name="page" /></template>
    <template #first-page><slot name="first-page" /></template>
    <template #last-page><slot name="last-page" /></template>
  </VueComicReader>
</template>

<script lang="ts">
import Vue from 'vue';
import { genUniqKey } from '@/utility';
import VueComicReader, { EmitChangeDirection } from './index.vue';

export default Vue.extend({
  name: 'VueComicReaderManager',
  components: {
    VueComicReader
  },
  props: {
    initialNoticeDirection: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      key_: genUniqKey(),
      initialDirection: this.$attrs['initial-direction'],
      initialPage: Number.isNaN(Number(this.$attrs['initial-page'])) ? 1 : Number(this.$attrs['initial-page']),
      noticeDirection: this.initialNoticeDirection
    };
  },
  methods: {
    onChangeDirection (payload: EmitChangeDirection): void {
      this.initialDirection = payload.direction;
      this.initialPage = payload.activePage;
      this.key_ = genUniqKey();
      this.noticeDirection = true;
    }
  }
});
</script>
