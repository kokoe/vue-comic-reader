<script setup lang="ts">
import type { Props } from './AppFooter.types';

withDefaults(defineProps<Props>(), {
  minHeightClass: 'min-h-[3rem]', // TODO JIT
  wrapperClasses: () => [
    'bg-gray-800',
    'bg-opacity-90',
    'text-white',
    '-drop-shadow',
  ],
});
</script>

<template>
  <footer
    class="absolute z-50 bottom-0 inset-x-0 px-10"
    :class="[minHeightClass, wrapperClasses]"
  >
    <slot />
  </footer>
</template>
