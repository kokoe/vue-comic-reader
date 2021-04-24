<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    preserveAspectRatio="xMidYMin"
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title :id="iconName">{{ title || iconName }} icon</title>
    <g :fill="iconColor">
      <component :is="`icon-${iconName}`" />
    </g>
  </svg>
</template>

<script lang="ts">
/**
 * Material Design Icons
 * https://materialdesignicons.com/
 */
import Vue from 'vue';
import IconArrowLeftRight from './svg/icon-arrow-left-right.vue';
import IconArrowUpDown from './svg/icon-arrow-up-down.vue';
import IconClose from './svg/icon-close.vue';

export default Vue.extend({
  name: 'Icon',
  components: {
    IconArrowLeftRight,
    IconArrowUpDown,
    IconClose
  },
  props: {
    iconName: {
      type: String,
      default: '',
      required: true
    },
    width: {
      type: Number,
      default: 24
    },
    height: {
      type: Number,
      default: 24
    },
    iconColor: {
      type: String,
      default: 'currentColor'
    },
    title: {
      type: String,
      default: ''
    }
  }
});
</script>
