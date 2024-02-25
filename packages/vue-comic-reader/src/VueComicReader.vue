<script setup lang="ts">
import type { Props } from '@/types';
import { ref } from 'vue';
import AppHeader from '@/components/AppHeader/AppHeader.vue';
import AppFooter from '@/components/AppFooter/AppFooter.vue';
import AppPagesContent from '@/components/AppPagesContent/AppPagesContent.vue';

defineProps<Props>();

const isShowHeader = ref<boolean>(false);
const isShowFooter = ref<boolean>(false);

function clickContentHandler(): void {
  isShowHeader.value = !isShowHeader.value;
  isShowFooter.value = !isShowFooter.value;
}

function hideHeaderFooter(): void {
  isShowHeader.value = false;
  isShowFooter.value = false;
}
</script>

<template>
  <div class="vue-comic-reader relative overflow-hidden">
    <Transition name="slide-in-down">
      <AppHeader
        v-if="isShowHeader"
        :wrapper-classes="classes?.header"
        @click:close="hideHeaderFooter"
        ><slot name="header"
      /></AppHeader>
    </Transition>

    <AppPagesContent :pages="pages" @click:content="clickContentHandler()" />

    <Transition name="slide-in-up">
      <AppFooter v-if="isShowFooter" :class="classes?.footer"
        ><slot name="footer"
      /></AppFooter>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.vue-comic-reader {
  :deep(*),
  :deep(::before),
  :deep(::after) {
    box-sizing: border-box;
  }
}

.slide-in-down-enter-active,
.slide-in-down-leave-active {
  transition: transform var(--transition-duration-default, 0.15s)
    var(--transition-timing-function-default, ease);
}

.slide-in-down-leave-from,
.slide-in-down-enter-to {
  transform: translateY(0);
}

.slide-in-down-enter-from,
.slide-in-down-leave-to {
  transform: translateY(-100%);
}

.slide-in-up-enter-active,
.slide-in-up-leave-active {
  transition: transform var(--transition-duration-default, 0.15s)
    var(--transition-timing-function-default, ease);
}

.slide-in-up-leave-from,
.slide-in-up-enter-to {
  transform: translateY(0);
}

.slide-in-up-enter-from,
.slide-in-up-leave-to {
  transform: translateY(100%);
}
</style>
