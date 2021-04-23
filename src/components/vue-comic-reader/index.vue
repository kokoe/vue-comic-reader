<template>
  <div
    class="vcr"
    :style="wrapStyle"
    @contextmenu="onContextmenu"
  >
    <transition
      enter-active-class="animate__animated animate__slideInDown"
      leave-active-class="animate__animated animate__slideOutUp"
    >
      <header v-if="isShowMenu" class="vcr__header">
        <slot name="header">
          <slot name="header-brand"><div class="vcr__header-brand">{{ title }}</div></slot>
          <button type="button" class="vcr__header-close" @click="isShowMenu = false">×</button>
        </slot>
      </header>
    </transition>

    <div
      ref="swiperContainer"
      :dir="horizontalDirection"
      class="swiper-container vcr__swiper-container"
    >
      <div class="swiper-wrapper">
        <div
          v-for="(page, i) in formattedPages"
          :key="i"
          class="swiper-slide vcr__swiper-slide"
          :class="slideClass"
          data-show-menu="true"
        >
          <div
            v-for="(pageContent, j) in page"
            :key="pageContent.pageNumber"
            class="vcr__swiper-slide-inner"
            :class="getSlideInnerClass(j, page.length)"
          >
            <slot
              v-if="hasFirstSlot && pageContent.slot === 'first-page'"
              name="first-page"
              :page-content="pageContent"
            />
            <slot
              v-else-if="hasLastSlot && pageContent.slot === 'last-page'"
              name="last-page"
              :page-content="pageContent"
            />
            <slot
              v-else
              name="page"
              :page-content="pageContent"
            >
              <div
                role="img"
                :style="!lazy ? `background-image: url(${pageContent.src})`: false"
                :data-background="lazy ? pageContent.src : false"
                class="vcr__swiper-slide-image"
                :class="lazy ? 'swiper-lazy' : false"
                data-show-menu="true"
              >
                <div v-if="lazy" class="swiper-lazy-preloader"></div>
              </div>
              <a v-if="i !== 0" @click.prevent="toPrev" href="#" class="vcr__swiper-slide-nav is-prev" aria-label="Previous">Prev</a>
              <a v-if="i < (formattedPages.length - 1)" @click.prevent="toNext" href="#" class="vcr__swiper-slide-nav is-next" aria-label="Next">Next</a>
            </slot>
          </div>
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>

    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div v-if="isShowMenu" class="vcr__overlay" @click="isShowMenu = false"></div>
    </transition>

    <transition
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <footer v-if="isShowMenu" class="vcr__footer">
        <slot name="footer">
          <VueSlider class="vcr__footer-slider" :value="activePage" :max="totalPage" :min="1" :direction="reverseHorizontal ? 'ltr' : 'rtl'" @change="onChangeSlider" />
          <button type="button" @click="changeDirection">⇔</button>
        </slot>
      </footer>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Swiper, { Navigation, Lazy } from 'swiper';
import VueSlider from 'vue-slider-component';
import { Value as VueSliderValue } from 'vue-slider-component/typings';

Swiper.use([Navigation, Lazy]);

const isDev = Vue.config.devtools;

export type Direction = 'horizontal' | 'vertical';

export type PageContent = {
  pageNumber: number;
  pagesIndex: number | null;
  src: string | null;
  slot?: 'first-page' | 'last-page';
}

export type Page = PageContent[];

export type Pages = Page[];

export type EmitChangeDirection = {
  direction: Direction;
  activePage: number
}

type DataType = {
  swiper: Swiper | null;
  direction: Direction;
  activeSlideIndex: number;
  isShowMenu: boolean;
  transitioning: boolean;
}

export default Vue.extend({
  name: 'VueComicReader',

  components: {
    VueSlider
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    height: {
      type: [String, Number],
      default: '100vh'
    },
    initialDirection: {
      type: String as PropType<Direction>,
      default: 'horizontal',
      validator (value): boolean {
        return value === 'horizontal' || value === 'vertical';
      }
    },
    spread: {
      type: Boolean,
      default: true
    },
    firstUnspread: {
      type: Boolean,
      default: false
    },
    // default vertical => rtl
    // reverse => ltr
    reverseHorizontal: {
      type: Boolean,
      default: false
    },
    pages: {
      type: Array as PropType<string[]>,
      required: true
    },
    // Not index
    initialPage: {
      type: Number,
      default: 1
    },
    lazy: {
      type: Boolean,
      default: false
    }
  },

  data (): DataType {
    return {
      swiper: null,
      direction: this.initialDirection as Direction,
      activeSlideIndex: this.initialPage - 1,
      isShowMenu: false,
      transitioning: false
    };
  },

  mounted () {
    this.$nextTick(function () {
      this.initSwiper();
    });
  },

  computed: {
    formattedPages (): Pages {
      return this.spread ? this.sreadPages : this.pageByPages;
    },

    sreadPages (): Pages {
      const pages: Pages = [[]];

      let pageNumber = 0;

      const isCreateNextPage: (n: number) => boolean = (pageIndex: number) => {
        if (pageIndex === (this.pages.length - 1)) {
          // last page
          return !!this.hasLastSlot;
        } else if (this.hasFirstSlot && !this.firstUnspread) {
          // spread first slot
          return !!(pageIndex % 2);
        } else if (!this.hasFirstSlot && this.firstUnspread) {
          // unspread without first slot
          return !!(pageIndex % 2);
        } else {
          // others
          return !(pageIndex % 2);
        }
      };

      if (this.hasFirstSlot) {
        pages[0].push(this.getSlotPageFormat('first-page', ++pageNumber));
        if (!this.firstUnspread) {
          pages.push([]);
        }
      }

      this.pages.forEach((page, i) => {
        pages[pages.length - 1].push({
          pageNumber: ++pageNumber,
          pagesIndex: i,
          src: page
        });
        if (isCreateNextPage(i)) {
          pages.push([]);
        }
      });

      if (this.hasLastSlot) {
        pages[pages.length - 1].push(this.getSlotPageFormat('last-page', ++pageNumber));
      }

      return pages;
    },

    pageByPages (): Pages {
      const pages: Pages = [];

      let pageNumber = 0;

      if (this.hasFirstSlot) {
        pages.push([this.getSlotPageFormat('first-page', ++pageNumber)]);
      }

      this.pages.forEach((page, i) => {
        pages.push([{
          pageNumber: ++pageNumber,
          pagesIndex: i,
          src: page
        }]);
      });

      if (this.hasLastSlot) {
        pages.push([this.getSlotPageFormat('last-page', ++pageNumber)]);
      }

      return pages;
    },

    hasFirstSlot (): boolean {
      return !!this.$slots['first-page'];
    },

    hasLastSlot (): boolean {
      return !!this.$slots['last-page'];
    },

    isHorizontal (): boolean {
      return this.direction === 'horizontal';
    },

    horizontalDirection (): 'rtl' | 'ltr' {
      return !this.isHorizontal || this.reverseHorizontal ? 'ltr' : 'rtl';
    },

    swiperOptions (): { [key: string]: unknown } {
      return this.isHorizontal ? this.swiperHorizontalOptions : this.swiperVerticalOptions;
    },

    swiperHorizontalOptions (): { [key: string]: unknown } {
      return {
        preloadImages: !this.lazy,
        watchSlidesVisibility: true,
        direction: this.direction,
        lazy: this.lazy ? { checkInView: true, loadOnTransitionStart: true, loadPrevNext: true } : false,
        centeredSlides: false
      };
    },

    swiperVerticalOptions (): { [key: string]: unknown } {
      return {
        preloadImages: !this.lazy,
        watchSlidesVisibility: true,
        direction: this.direction,
        lazy: this.lazy ? { checkInView: true, loadOnTransitionStart: true, loadPrevNext: true } : false,
        freeMode: true
      };
    },

    totalPage (): number {
      let total = this.pages.length;

      total = this.hasFirstSlot ? ++total : total;
      total = this.hasLastSlot ? ++total : total;

      return total;
    },

    activePage (): number {
      if (!this.spread) {
        return this.activeSlideIndex + 1;
      } else {
        const page = this.formattedPages[this.activeSlideIndex];
        return page && page.length ? page[page.length - 1].pageNumber : 1;
      }
    },

    wrapStyle (): { [key: string]: string | number } {
      return {
        height: this.height
      };
    },

    slideClass (): { [key: string]: boolean } {
      return {
        'is-horizontal': this.isHorizontal,
        'is-vertical': !this.isHorizontal,
        'is-reverse-horizontal': this.reverseHorizontal
      };
    }
  },

  methods: {
    toPrev (): void {
      if (this.swiper) {
        this.swiper.slidePrev();
      }
    },

    toNext (): void {
      if (this.swiper) {
        this.swiper.slideNext();
      }
    },

    pageTo (pageNumber: number, speed?: number): void {
      this.slideTo(this.findSlideIndex(pageNumber), speed);
    },

    slideTo (slideIndex: number, speed?: number): void {
      if (this.swiper) {
        this.swiper.slideTo(slideIndex, speed, false);
      }
    },

    getSlideInnerClass (pageContentIndex: number, pageContentLength: number): { [key: string]: boolean } {
      const isSpreadSlide = pageContentLength > 1;
      return {
        'is-spread-odd': this.spread ? isSpreadSlide && !pageContentIndex : false,
        'is-spread-even': this.spread ? isSpreadSlide && !!pageContentIndex : false,
        'is-spread': isSpreadSlide
      };
    },

    findSlideIndex (pageNumber: number): number {
      pageNumber = pageNumber < 1 ? 1 : pageNumber; // min validate
      pageNumber = pageNumber > this.totalPage ? this.totalPage : pageNumber; // max validate

      if (!this.spread) {
        return pageNumber - 1;
      } else {
        const index = this.formattedPages.findIndex((pageContent) => {
          return pageContent.find((page) => page.pageNumber === pageNumber);
        });
        return (index > -1) ? index : 0;
      }
    },

    getSlotPageFormat (slot: 'first-page' | 'last-page', pageNumber: number): PageContent {
      return {
        pageNumber,
        pagesIndex: null,
        src: null,
        slot
      };
    },

    initSwiper () {
      const container = this.$refs.swiperContainer as HTMLElement;
      this.swiper = new Swiper(container, this.swiperOptions);
      this.onReady();
    },

    onReady () {
      if (!this.swiper) return;

      this.activeSlideIndex = this.findSlideIndex(this.initialPage);
      this.slideTo(this.activeSlideIndex, 0);

      this.swiper.on('click', this.onClickSwiperContainer);
      this.swiper.on('slideChange', this.onSlideChange);
      this.swiper.on('slideChangeTransitionStart', () => this.onChangeTransition('start'));
      this.swiper.on('slideChangeTransitionEnd', () => this.onChangeTransition('end'));
    },

    onSlideChange (swiper: any): void {
      this.activeSlideIndex = swiper.activeIndex;
    },

    onChangeTransition (type: string): void {
      this.transitioning = type === 'start';
    },

    onClickSwiperContainer (swiper: any, e: Event): void {
      const target = e.target as Element || null;
      if (target && target.getAttribute('data-show-menu')) {
        this.isShowMenu = true;
      }
    },

    onChangeSlider (pageNumber: VueSliderValue): void {
      this.pageTo(pageNumber as number, 0);
    },

    changeDirection (): void {
      const direction = this.direction === 'horizontal' ? 'vertical' : 'horizontal';
      this.direction = direction;

      const payload: EmitChangeDirection = {
        direction,
        activePage: this.activePage
      };

      this.$emit('changeDirection', payload);
      this.destroy();
    },

    onContextmenu (e: Event): void {
      if (!isDev) {
        e.preventDefault();
        this.isShowMenu = true;
      }
    },

    destroy (): void {
      if (this.swiper) {
        this.swiper.destroy(true, true);
      }
    }

  }
});
</script>

<style lang="scss">
$themeColor: #35495E;
@import '~vue-slider-component/lib/theme/default.scss';
</style>

<style lang="scss" scoped>
@import '~swiper/swiper-bundle.css';

$vcrMenuColor: #41B883;

@import '@/assets/sass/animate';

.vcr {
  position: relative;
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.vcr__header {
  position: absolute;
  z-index: 12;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: $vcrMenuColor;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  color: #fff;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vcr__header-brand {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vcr__header-close {
  cursor: pointer;
}

.vcr__footer {
  position: absolute;
  z-index: 12;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: $vcrMenuColor;
  box-shadow: 0 -4px 6px rgba(0,0,0,0.2);
  color: #fff;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vcr__footer-slider {
  flex: 1;
  margin: 0 24px 0 8px;
}

.vcr__overlay {
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
}

.vcr__swiper-container {
  width: 100%;
  height: 100%;
}

.vcr__swiper-slide {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: stretch;
  &.is-vertical:not(.is-reverse-horizontal) {
    flex-direction: row-reverse;
  }
}

.vcr__swiper-slide-inner {
  direction: ltr;
  position: relative;
  line-height: 1;
  height: 100%;
  width: 100%;
  flex: 0 1 auto;
}

.vcr__swiper-slide-image {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-position: center top;
  background-repeat: no-repeat;
  background-size: contain;
  .is-spread-odd & {
    background-position: left top;
  }
  .is-spread-even & {
    background-position: right top;
  }
  .is-reverse-horizontal .is-spread-odd & {
    background-position: right top;
  }
  .is-reverse-horizontal .is-spread-even & {
    background-position: left top;
  }
}

.vcr__swiper-slide-nav {
  display: block;
  position: absolute;
  z-index: 3;
  color: transparent !important;
  font-size: 1px;
  // background: rgba(0,0,0,0.3); // debug

  .is-horizontal & {
    top: 0;
    bottom: 0;
    &.is-prev {
      right: 0;
      left: 70%;
    }
    &.is-next {
      left: 0;
      right: 70%;
    }
  }

  .is-horizontal .is-spread-odd & {
    &.is-prev {
      right: 0;
      left: 50%;
    }
    &.is-next {
      display: none;
    }
  }

  .is-horizontal .is-spread-even & {
    &.is-prev {
      display: none;
    }
    &.is-next {
      left: 0;
      right: 50%;
    }
  }

  .is-reverse-horizontal:not(.is-vertical) & {
    &.is-prev {
      left: 0;
      right: 70%;
    }
    &.is-next {
      right: 0;
      left: 70%;
    }
  }

  .is-reverse-horizontal:not(.is-vertical) .is-spread-odd & {
    &.is-prev {
      left: 0;
      right: 50%;
    }
    &.is-next {
      display: none;
    }
  }

  .is-reverse-horizontal:not(.is-vertical) .is-spread-even & {
    &.is-prev {
      display: none;
    }
    &.is-next {
      right: 0;
      left: 50%;
    }
  }

  .is-vertical & {
    left: 0;
    right: 0;
    &.is-prev {
      top: 0;
      bottom: 70%;
    }
    &.is-next {
      bottom: 0;
      top: 70%;
    }
  }

}
</style>
