<script setup lang="ts">
import { ref } from 'vue';
import { useElementBounding } from '@vueuse/core';
import { useGesture } from '@vueuse/gesture';
import { useMotionProperties, useSpring } from '@vueuse/motion';
import AppPage from '@/components/AppPage/AppPage.vue';
import type { Props, Emits } from './AppPagesContent.types';
import type { PermissiveMotionProperties } from '@vueuse/motion';

defineProps<Props>();

const emits = defineEmits<Emits>();

const threshold = 50; // TODO props

const wrapperClasses = ['h-full', 'relative', 'overflow-hidden', 'mx-auto'];

const contentClasses = ['h-full', 'relative', 'transform'];

const olClasses = ['h-full', 'list-none', 'm-0', 'p-0', 'flex', 'flex-nowrap'];

const wrapper = ref<HTMLElement | null>(null);
const ol = ref<HTMLOListElement | null>(null);

const currentX = ref(0);
const isDragging = ref(false);

const { width: contentWidth } = useElementBounding(wrapper);

const { motionProperties } = useMotionProperties(ol, {
  cursor: 'grab',
  x: 0,
  y: 0,
});
const { set } = useSpring(
  motionProperties as Partial<PermissiveMotionProperties>,
  {
    type: 'spring',
    stiffness: 900,
    damping: 80,
  }
);

type DragHandlerPayload = {
  movement: [number, number];
  dragging: boolean;
};
function dragHandler({ movement: [mx], dragging }: DragHandlerPayload): void {
  if (dragging) {
    // ドラッグ中
    const x = currentX.value + mx;
    set({
      cursor: 'grabbing',
      x: x,
      y: 0,
    });
  } else if (mx < -threshold) {
    // 次のページへ (left to rightの時)
    const x = currentX.value - contentWidth.value;
    set({ x: x, y: 0, cursor: 'grab' });
    currentX.value = x;
  } else if (mx > threshold) {
    // 前のページへ (left to rightの時)
    const x = currentX.value + contentWidth.value;
    set({ x: x, y: 0, cursor: 'grab' });
    currentX.value = x;
  } else {
    // ドラッグ終了
    set({ x: currentX.value, y: 0, cursor: 'grab' });
  }
}

useGesture(
  {
    onDrag: dragHandler,
  },
  {
    domTarget: ol,
  }
);

function clickContentHandler(e: MouseEvent): void {
  if (isDragging.value) return;

  const role = (e.target as HTMLElement).getAttribute('role');
  if (role !== 'navigation') {
    emits('click:content');
  }
}
</script>

<template>
  <div
    ref="wrapper"
    :class="wrapperClasses"
    @click="clickContentHandler"
    @mousedown="isDragging = false"
    @mousemove="isDragging = true"
  >
    <div :class="contentClasses">
      <ol ref="ol" :class="olClasses">
        <AppPage
          tag="li"
          :page="page"
          v-for="(page, i) in pages"
          :key="i"
          class="shrink-0 w-1/2"
        />
      </ol>
    </div>
    <div
      role="navigation"
      class="absolute inset-y-0 left-0 w-1/5 cursor-pointer"
      aria-label="Previous page"
    ></div>
    <div
      role="navigation"
      class="absolute inset-y-0 right-0 w-1/5 cursor-pointer"
      aria-label="Next page"
    ></div>
  </div>
</template>
