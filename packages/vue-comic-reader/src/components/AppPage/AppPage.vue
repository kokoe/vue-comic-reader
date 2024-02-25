<script setup lang="ts">
import { computed } from 'vue';
import type { Props } from './AppPage.types';
import { useImage } from '@vueuse/core';
import type { UseImageOptions } from '@vueuse/core';

const props = defineProps<Props>();
const options = computed<UseImageOptions>(() => {
  return {
    src: props.page || '',
  };
});

const { isLoading } = useImage(options);
</script>

<template>
  <component :is="tag" class="flex">
    <span v-if="isLoading">Loading...</span>
    <img
      :src="page"
      alt=""
      class="object-contain w-full h-full select-none pointer-events-none"
    />
  </component>
</template>
