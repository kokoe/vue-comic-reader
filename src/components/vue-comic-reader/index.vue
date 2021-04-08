<template>
  <div class="vcr">
    <header v-if="isShowMenu" class="vcr__header">
      <slot name="header">
        header
      </slot>
    </header>

    <Swiper
      :dir="horizontalDirection"
      class="vcr__swiper-container"
      ref="swiper"
      :options="swiperOptions"
      @click="isShowMenu = true"
      @ready="onReady"
      @slideChange="onSlideChange"
      @sliderMove="onSlideMove"
      @fromEdge="onFromEdge"
      @reachEnd="onReachEnd"
    >
      <SwiperSlide v-if="$slots['first-page']" class="vcr__swiper-slide">
        <slot name="first-page" />
      </SwiperSlide>

      <SwiperSlide v-for="(page, i) in pages" :key="i" class="vcr__swiper-slide">
        <slot name="page" v-if="$slots.page" :page="page" :index="i" />
        <img v-else :src="page" alt="">
      </SwiperSlide>
    </Swiper>

    <div v-if="isShowLast && $slots['last-page']" class="vcr__conversion">
      <slot name="last-page" />
    </div>

    <div v-if="isShowMenu" class="vcr__overlay" @click="isShowMenu = false"></div>

    <footer v-if="isShowMenu" class="vcr__footer">
      <slot name="footer">
        footer
      </slot>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default Vue.extend({
  name: 'VueComicReader',

  components: {
    Swiper,
    SwiperSlide
  },

  props: {
    direction: {
      type: String,
      default: 'horizontal' // horizontal | vertical
    },
    mode: {
      type: String,
      default: 'facing-pages' // facing-pages
    },
    // default vertical => rtl
    // reverse => ltr
    reverseHorizontal: {
      type: Boolean,
      default: false
    },
    pages: {
      type: Array,
      required: true
    },
    // Not index
    initialPage: {
      type: Number,
      default: 1
    }
  },

  data () {
    return {
      activeIndex: this.initialPage - 1,
      isShowMenu: false,
      isActiveLast: false, // TODO 実際判定が必要
      isShowLast: false,
      isShowLastMoveX: 150,
      clientX_: 0
    };
  },

  computed: {
    isHorizontal (): boolean {
      return this.direction === 'horizontal';
    },
    horizontalDirection (): 'rtl' | 'ltr' {
      return !this.isHorizontal || this.reverseHorizontal ? 'ltr' : 'rtl';
    },
    isFirstActiveIndex (): boolean {
      return this.activeIndex === 0;
    },
    swiperHorizontalOptions (): { [key: string]: unknown } {
      return {
        direction: this.direction,
        centeredSlides: false,
        slidesPerView: 2,
        slidesPerGroup: 2,
        slidesPerGroupSkip: 1
      };
    },
    swiperVerticalOptions (): { [key: string]: unknown } {
      return {
        direction: this.direction,
        slidesPerView: 1,
        freeMode: true
      };
    },
    swiperOptions (): { [key: string]: unknown } {
      return this.isHorizontal ? this.swiperHorizontalOptions : this.swiperVerticalOptions;
    },
    swiper (): any {
      return (this.$refs as any).swiper.$swiper;
    },
    totalPage (): number {
      let total = this.pages.length;
      if ((this.$slots as any)['first-page']) {
        ++total;
      }
      if ((this.$slots as any)['last-page']) {
        ++total;
      }
      return total;
    }
  },

  methods: {
    getInitialPage (): number {
      if (this.initialPage > this.totalPage) {
        return this.totalPage;
      } else if (this.initialPage < 1) {
        return 1;
      } else {
        return this.initialPage;
      }
    },
    onReady () {
      this.activeIndex = this.getInitialPage() - 1;
      this.swiper.slideTo(this.activeIndex, 0, false);
    },
    onSlideChange (swiper: any): void {
      this.activeIndex = swiper.activeIndex;
    },
    onSlideMove (swiper: any, event: PointerEvent): void {
      if (!this.isActiveLast) return;

      if (!this.clientX_) {
        this.clientX_ = event.clientX;
      } else if ((event.clientX - this.clientX_) > this.isShowLastMoveX) {
        this.isShowLast = true;
      }
    },
    onFromEdge (): void {
      this.isActiveLast = false;
    },
    onReachEnd (): void {
      this.isActiveLast = true;
    }
  }
});
</script>

<style lang="scss" scoped>
@import '~swiper/swiper-bundle.css';

.vcr {
  position: relative;
  overflow: hidden;
}

.vcr__header {
  position: absolute;
  z-index: 12;
  top: 0;
  left: 0;
  right: 0;
  background-color: #957A5D;
}
.vcr__footer {
  position: absolute;
  z-index: 12;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #957A5D;
}

.vcr__conversion {
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.8);
}

.vcr__overlay {
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
}
.vcr__swiper-slide {
  width: 128px;
  text-align: right;
  > img {
    width: auto;
    height: 50vh;
  }
  &:first-child {
    transition: transform 100ms;
    text-align: center;
  }
  &:nth-child(2) {
    transition: transform 10ms, opacity 10ms;
  }
  &:nth-child(2n) {
    text-align: left;
  }
  &.swiper-slide-active:first-child {
    transform: translateX(-50%);
    // z-index: 2;
  }
  &.swiper-slide-next:nth-child(2) {
    opacity: 0;
    // transform: translateX(-55%);
    // z-index: 1;
  }
}
</style>
