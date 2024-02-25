<script setup lang="ts">
import type { Props, Emits } from './AppHeader.types';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

withDefaults(defineProps<Props>(), {
  minHeightClass: 'min-h-[3rem]', // TODO JIT
  wrapperClasses: () => [
    'bg-gray-800',
    'bg-opacity-90',
    'text-white',
    'drop-shadow',
  ],
});

const emits = defineEmits<Emits>();
</script>

<template>
  <header
    class="absolute z-50 top-0 inset-x-0 px-10"
    :class="[minHeightClass, wrapperClasses]"
  >
    <slot />
    <button
      type="button"
      class="bg-transparent border-none w-10 h-10 p-0 text-current hover:opacity-70 cursor-pointer transition-opacity absolute top-1 right-0"
      @click="emits('click:close')"
    >
      <FontAwesomeIcon :icon="faXmark" class="w-6 h-6" />
    </button>
  </header>
</template>
