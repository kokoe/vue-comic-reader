<template>
  <section>
    <h2 class="title is-2">
      Use Slot
      <a class="pl-2" href="https://github.com/kokoe/vue-comic-reader/blob/main/src/components/ExampleSlot.vue" target="_blank"><Icon icon-name="code-tags" /></a>
    </h2>
    <VueComicReader
      ref="vcr"
      title="Use Slot"
      :pages="pages"
      height="50vh"
    >
      <template #header-brand>
        <h3>vue-comic-reader - Use slot</h3>
      </template>

      <template #page="{slideIndex, pageContent, totalPage, type, spread}">
        <div
          role="img"
          :style="`background-image: url(${pageContent.src})`"
          class="vcr-swiper-slide__image"
          data-show-menu="true"
        >
          <span class="example-page-number" :class="{
            [`is-${type}`]: true,
            'is-spread': spread,
          }">{{ pageContent.pageNumber }}</span>
        </div>
        <a
          v-if="slideIndex !== 0"
          @click.prevent="toPrev"
          href="#"
          class="vcr-swiper-slide__nav is-prev"
          aria-label="前へ"
        >前のページへ</a>
        <a
          v-if="slideIndex < (totalPage - 1)"
          @click.prevent="toNext"
          href="#"
          class="vcr-swiper-slide__nav is-next"
          aria-label="次へ"
        >次のページへ</a>
      </template>

      <template #first-page>
        <div data-show-menu="true" class="columns is-flex-direction-column is-justify-content-center is-align-items-center" style="height: 100%;">
          <figure class="image">
            <img data-show-menu="true" src="https://placekitten.com/g/200/200" alt="" class="is-rounded">
          </figure>
          <p data-show-menu="true" class="my-4 is-size-5">Kitten photos.</p>
          <button class="button is-primary" @click="onClickStart">Start</button>
        </div>
      </template>

      <template #last-page>
        <div class="columns is-flex-direction-column is-justify-content-center is-align-items-center" style="height: 100%;">
          <div class="card" style="width: 30%">
            <div class="card-image">
              <figure class="image is-4by3">
                <img src="http://placekitten.com/g/128/96" alt="Placeholder image">
              </figure>
            </div>
            <div class="card-content">
              <div class="content">
                <p class="mb-2">See More?</p>
                <p class="is-size-5"><a href="https://placekitten.com/" target="_blank">placekitten</a></p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </VueComicReader>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import VueComicReader from './vue-comic-reader/index.vue';
import Icon from '@/components/icon/icon.vue';

export default Vue.extend({
  name: 'ExampleSlot',
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
  },
  methods: {
    onClickStart (): void {
      // eslint-disable-next-line
      (this.$refs.vcr as any).toNext();
    },
    toPrev (): void {
      (this.$refs.vcr as any).toPrev();
    },
    toNext (): void {
      (this.$refs.vcr as any).toNext();
    }
  }
});
</script>

<style lang="scss">
.example-page-number {
  display: inline-block;
  vertical-align: top;
  line-height: 1;
  background: rgba(255,255,255,0.4);
  padding: 4px 16px;
  text-align: center;
  border-radius: 4px;
  position: absolute;
  top: 8px;
  &:not(.is-spread) {
    left: 50%;
    transform: translateX(-50%);
  }
  &.is-spread {
    &.is-even {
      right: 16px;
    }
    &.is-odd {
      left: 16px;
    }
  }
}
</style>
