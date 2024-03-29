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
      <header v-if="isShowMenu" class="vcr-header">
        <slot name="header" v-bind="menuSlotScope">
          <slot name="header-brand"><div class="vcr-header__brand">{{ title }}</div></slot>
          <button type="button" class="vcr-icon-button" @click="onClickClose">
            <icon title="close" icon-name="close" class="vcr-icon-button__icon vcr-icon-button__icon-close" />
          </button>
        </slot>
      </header>
    </transition>

    <div
      v-if="!domRefresh_"
      ref="swiperContainer"
      :dir="horizontalDirection"
      class="swiper-container vc-swiper-container"
    >
      <div class="swiper-wrapper">
        <div
          v-for="(page, i) in formattedPages"
          :key="i"
          class="swiper-slide vcr-swiper-slide"
          :class="slideClass"
          data-show-menu="true"
        >
          <div
            v-for="(pageContent, j) in page"
            :key="pageContent.key"
            class="vcr-swiper-slide__inner"
            :class="getSlideInnerClass(j, page.length)"
          >
            <!-- TODO: first-page and last-page can't pass slot-slope -->
            <slot
              :name="pageContent.slot"
              v-bind="createPageSlotScope({
                slideIndex: i,
                pageContent,
                pageContentIndex: j,
                pageContentLength: page.length
              })"
            >
              <div
                role="img"
                :style="!useLazy ? `background-image: url(${pageContent.src})`: false"
                :data-background="useLazy ? pageContent.src : false"
                class="vcr-swiper-slide__image"
                :class="useLazy ? 'swiper-lazy' : false"
                data-show-menu="true"
              >
                <div v-if="useLazy" class="swiper-lazy-preloader"></div>
              </div>
              <a
                v-if="i !== 0"
                @click.prevent="toPrev"
                href="#"
                class="vcr-swiper-slide__nav is-prev"
                aria-label="Previous"
              >{{ prevPageMessage }}</a>
              <a
                v-if="i < (formattedPages.length - 1)"
                @click.prevent="toNext"
                href="#"
                class="vcr-swiper-slide__nav is-next"
                aria-label="Next"
              >{{ nextPageMessage }}</a>
            </slot>
          </div>
        </div>

      </div>
      <div v-if="navigation" class="swiper-button-prev" :class="slideClass"></div>
      <div v-if="navigation" class="swiper-button-next" :class="slideClass"></div>
    </div>

    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div v-if="isShowMenu" class="vcr-overlay" @click="hideMenu"></div>
    </transition>

    <transition
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <footer v-if="isShowMenu" class="vcr-footer">
        <slot name="footer" v-bind="menuSlotScope">
          <VueSlider class="vcr-footer__slider" :value="activePage" :max="totalPage" :min="1" :direction="reverseHorizontal ? 'ltr' : 'rtl'" @change="onChangeSlider" />
          <button type="button" class="vcr-icon-button" @click="changeDirection">
            <icon title="change direction" :icon-name="iconDirection" class="vcr-icon-button__icon vcr-icon-button__icon-direction" />
          </button>
        </slot>
      </footer>
    </transition>

    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div v-if="noticeDirection.isShow" class="vcr-changed-direction">
        <icon title="changed direction" :icon-name="iconDirection" class="vcr-changed-direction__icon" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Swiper, { Navigation, Lazy, A11y, SwiperOptions } from 'swiper';
import { LazyOptions } from 'swiper/types/components/lazy';
import VueSlider from 'vue-slider-component';
import { genUniqKey } from '@/utility';
import Icon from '@/components/icon/icon.vue';
import { Value as VueSliderValue } from 'vue-slider-component/typings';
import type { Direction, PageContent, Pages, PageSlotScope, MenuSlotScope, EmitChangeActivePage, DataType } from '@/index.d';

Swiper.use([Navigation, Lazy, A11y]);

const isDev = Vue.config.devtools;

export default Vue.extend({
  name: 'VueComicReader',

  components: {
    Icon,
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
    smallViewBreakPoint: {
      type: Number,
      default: 768
    },
    // Not index
    initialPage: {
      type: Number,
      default: 1
    },
    lazy: {
      type: [Boolean, Object as ()=> LazyOptions],
      default: false
    },
    navigation: {
      type: Boolean,
      default: false
    },
    prevPageMessage: {
      type: String,
      default: 'Previous page'
    },
    nextPageMessage: {
      type: String,
      default: 'Next page'
    }
  },

  data (): DataType {
    return {
      swiper: null,
      direction: this.initialDirection as Direction,
      activeSlideIndex: this.initialPage - 1,
      isShowMenu: false,
      transitioning: false,
      hasFirstSlot: false,
      hasLastSlot: false,
      noticeDirection: {
        isShow: false,
        displayTime: 3000,
        timerId_: -1
      },
      mq: null,
      spread_: this.spread,
      domRefresh_: false,
      initializedActiveSlideIndex_: false
    };
  },

  watch: {
    spread (spread: boolean): void {
      this.spread_ = spread;
    },
    'noticeDirection.isShow': {
      handler (isShow: boolean): void {
        window.clearTimeout(this.noticeDirection.timerId_);
        if (isShow) {
          this.noticeDirection.timerId_ = window.setTimeout(() => {
            this.noticeDirection.isShow = false;
          }, this.noticeDirection.displayTime);
        }
      },
      immediate: true
    },
    activePage (activePage: number): void {
      this.$emit('change:page', {
        activePage,
        isLastPage: activePage === this.totalPage
      } as EmitChangeActivePage);
    },
    isShowMenu (isShow: boolean): void {
      this.$emit('change:menu', isShow);
    }
  },

  mounted () {
    this.$nextTick(function () {
      this.hasFirstSlot = !!this.$slots['first-page'];
      this.hasLastSlot = !!this.$slots['last-page'];
      setTimeout(() => this.initSwiper(), 0);

      this.mq = window.matchMedia(`(max-width: ${this.smallViewBreakPoint}px)`);
      this.mq.addListener(this.onChangeMQ);
      this.onChangeMQ(this.mq);
    });
  },

  beforeDestroy () {
    this.$emit('beforeDestroy');
  },

  destroyed () {
    this.$emit('destroyed');
  },

  computed: {
    formattedPages (): Pages {
      return this.spread_ ? this.sreadPages : this.pageByPages;
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
          key: genUniqKey(),
          pageNumber: ++pageNumber,
          pagesIndex: i,
          src: page,
          slot: 'page'
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
          key: genUniqKey(),
          pageNumber: ++pageNumber,
          pagesIndex: i,
          src: page,
          slot: 'page'
        }]);
      });

      if (this.hasLastSlot) {
        pages.push([this.getSlotPageFormat('last-page', ++pageNumber)]);
      }

      return pages;
    },

    isHorizontal (): boolean {
      return this.direction === 'horizontal';
    },

    horizontalDirection (): 'rtl' | 'ltr' {
      return !this.isHorizontal || this.reverseHorizontal ? 'ltr' : 'rtl';
    },

    useLazy (): boolean {
      return !!this.lazy;
    },

    menuSlotScope (): MenuSlotScope {
      return {
        direction: this.direction,
        activePage: this.activePage,
        totalPage: this.totalPage
      };
    },

    swiperOptions (): SwiperOptions {
      return {
        initialSlide: this.activeSlideIndex,
        preloadImages: !this.lazy,
        watchSlidesVisibility: true,
        direction: this.direction,
        lazy: this.lazy,
        navigation: this.navigation ? {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        } : false,
        a11y: {
          prevSlideMessage: this.prevPageMessage,
          nextSlideMessage: this.nextPageMessage
        },
        freeMode: !this.isHorizontal
      };
    },

    totalPage (): number {
      let total = this.pages.length;

      total = this.hasFirstSlot ? ++total : total;
      total = this.hasLastSlot ? ++total : total;

      return total;
    },

    activePage (): number {
      if (!this.spread_) {
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
    },

    iconDirection (): string {
      return this.isHorizontal ? 'arrow-left-right' : 'arrow-up-down';
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

    toggleMenu (): void {
      this.isShowMenu = !this.isShowMenu;
    },

    showMenu (): void {
      this.isShowMenu = true;
    },

    hideMenu (): void {
      this.isShowMenu = false;
    },

    pageContentState (pageContentIndex: number, pageContentLength: number): { type: 'odd'|'even', spread: boolean } {
      const isSpreadSlide = pageContentLength > 1;
      const isOdd = this.spread_ ? isSpreadSlide && !pageContentIndex : false;
      return {
        type: isOdd ? 'odd' : 'even',
        spread: isSpreadSlide
      };
    },

    createPageSlotScope (ctx: {
      slideIndex: number;
      pageContent: PageContent;
      pageContentIndex: number;
      pageContentLength: number
    }): PageSlotScope {
      const { slideIndex, pageContent, pageContentIndex, pageContentLength } = ctx;
      const { type, spread } = this.pageContentState(pageContentIndex, pageContentLength);
      return {
        slideIndex,
        pageContent,
        type,
        spread,
        totalPage: this.totalPage
      };
    },

    getSlideInnerClass (pageContentIndex: number, pageContentLength: number): { [key: string]: boolean } {
      const { type, spread } = this.pageContentState(pageContentIndex, pageContentLength);
      return {
        'is-spread-odd': this.spread_ && spread && (type === 'odd'),
        'is-spread-even': this.spread_ && spread && (type === 'even'),
        'is-spread': spread
      };
    },

    findSlideIndex (pageNumber: number): number {
      pageNumber = pageNumber < 1 ? 1 : pageNumber; // min validate
      pageNumber = pageNumber > this.totalPage ? this.totalPage : pageNumber; // max validate

      if (!this.spread_) {
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
        key: genUniqKey(),
        pageNumber,
        pagesIndex: null,
        src: null,
        slot
      };
    },

    initSwiper (): void {
      const container = this.$refs.swiperContainer as HTMLElement;
      this.swiper = new Swiper(container, this.swiperOptions);
      this.onReady();
    },

    onReady (): void {
      if (!this.swiper) return;

      const activePage = this.initializedActiveSlideIndex_ ? this.activePage : this.initialPage;

      this.activeSlideIndex = this.findSlideIndex(activePage);
      this.initializedActiveSlideIndex_ = true;

      this.swiper.on('click', this.onClickSwiperContainer);
      this.swiper.on('slideChange', this.onSlideChange);
      this.swiper.on('slideChangeTransitionStart', () => this.onChangeTransition('start'));
      this.swiper.on('slideChangeTransitionEnd', () => this.onChangeTransition('end'));
    },

    onChangeMQ (mq: MediaQueryList | MediaQueryListEvent): void {
      if (mq.matches) {
        this.changeSmallView();
      } else {
        this.changeLargeView();
      }
    },

    onClickClose (): void {
      this.hideMenu();
      this.$emit('click:close');
    },

    onSlideChange (swiper: Swiper): void {
      this.activeSlideIndex = swiper.activeIndex;
    },

    onChangeTransition (type: string): void {
      this.transitioning = type === 'start';
    },

    onClickSwiperContainer (swiper: Swiper, e: Event): void {
      const target = e.target as Element || null;
      if (target && target.getAttribute('data-show-menu')) {
        this.showMenu();
      }
    },

    onChangeSlider (pageNumber: VueSliderValue): void {
      this.pageTo(pageNumber as number, 0);
    },

    changeDirection (): void {
      this.direction = this.direction === 'horizontal' ? 'vertical' : 'horizontal';
      this.refresh();
      this.$nextTick(function () {
        this.$emit('change:direction', this.direction);
        this.noticeDirection.isShow = true;
        window.setTimeout(() => this.hideMenu(), 10);
      });
    },

    changeSmallView (): void {
      this.spread_ = false;
      this.refresh();
      this.$emit('change:view', 'small');
    },

    changeLargeView (): void {
      if (this.spread_ === this.spread) return;
      this.spread_ = this.spread;
      this.refresh();
      this.$emit('change:view', 'large');
    },

    onContextmenu (e: Event): void {
      if (!isDev) {
        e.preventDefault();
        this.showMenu();
      }
    },

    destroy (): void {
      if (this.swiper) {
        this.swiper.destroy(true, true);
      }
    },

    refresh (): void {
      this.destroy();
      this.domRefresh_ = true;
      this.$nextTick(function () {
        this.domRefresh_ = false;
        window.setTimeout(() => this.initSwiper(), 1);
      });
    }

  }
});
</script>

<style lang="scss">
.vcr {
  --vcr-theme-primary-color: #41B883;
  --vcr-theme-secondary-color: #35495E;
  --vcr-theme-menu-font-color: #fff;
  --vcr-menu-animation-duration: 0.2s;
  --vcr-menu-padding: 16px;
  --vcr-menu-height: 56px;
  --vcr-menu-icon-width: 24px;
  --vcr-menu-icon-height: 24px;
  --vcr-menu-header-shadow: 0 4px 6px rgba(0,0,0,0.2);
  --vcr-menu-footer-shadow: 0 -4px 6px rgba(0,0,0,0.2);
  --vcr-menu-slider-color: var(--vcr-theme-secondary-color);
  --vcr-menu-slider-bg-color: #ccc;
  --vcr-overlay-color:rgba(0,0,0,0.3);
  --swiper-theme-color: var(--vcr-theme-primary-color);
  --swiper-navigation-color: var(--vcr-theme-primary-color);
  --swiper-preloader-color: var(--vcr-theme-primary-color);
}

$themeColor: var(--vcr-menu-slider-color);
$bgColor: var(--vcr-menu-slider-bg-color);

@import '~vue-slider-component/lib/theme/default.scss';
</style>

<style lang="scss" scoped>
@import '~swiper/swiper-bundle.css';
@import '@/assets/sass/reset';
@import '@/assets/sass/animate';

.swiper-button-prev.swiper-button-disabled,
.swiper-button-next.swiper-button-disabled {
  opacity: 0;
}

.is-vertical {
  &.swiper-button-prev {
    margin-top: 0;
    top: 5px;
    left: 50%;
    right: auto;
    transform: rotateZ(90deg) translateX(-50%);
    transform-origin: center left;
  }
  &.swiper-button-next {
    margin-top: 0;
    top: auto;
    bottom: 5px;
    left: 50%;
    right: auto;
    transform: rotateZ(90deg) translateX(-50%);
    transform-origin: center left;
  }
}

.vcr {
  position: relative;
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.vcr-header,
.vcr-footer {
  box-sizing: border-box;
  position: absolute;
  z-index: 12;
  left: 0;
  right: 0;
  background-color: var(--vcr-theme-primary-color);
  color: var(--vcr-theme-menu-font-color);
  padding: var(--vcr-menu-padding);
  height: var(--vcr-menu-height);
}

.vcr-header {
  top: 0;
  box-shadow: var(--vcr-menu-header-shadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vcr-header__brand {
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vcr-icon-button {
  box-sizing: border-box;
  cursor: pointer;
  color: inherit;
  background: transparent;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  line-height: 1;
}

.vcr-icon-button__icon {
  box-sizing: border-box;
  width: var(--vcr-menu-icon-width);
  height: var(--vcr-menu-icon-height);
}

.vcr-footer {
  bottom: 0;
  box-shadow: var(--vcr-menu-footer-shadow);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vcr-footer__slider {
  flex: 1;
  margin: 0 calc(var(--vcr-menu-padding) * 1.5) 0 calc(var(--vcr-menu-padding) / 2);
}

.vcr-overlay {
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--vcr-overlay-color);
}

.vc-swiper-container {
  width: 100%;
  height: 100%;
}

.vcr-swiper-slide {
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: stretch;
  &.is-vertical:not(.is-reverse-horizontal) {
    flex-direction: row-reverse;
  }
}

.vcr-swiper-slide__inner {
  box-sizing: border-box;
  direction: ltr;
  position: relative;
  line-height: 1;
  height: 100%;
  width: 100%;
  flex: 0 1 auto;
}

.vcr-swiper-slide__image {
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

.vcr-swiper-slide__nav {
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

.vcr-changed-direction {
  box-sizing: border-box;
  pointer-events: none;
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 50%;
  height: 30%;
  transform: translateX(-50%) translateY(-50%);
  background-color: rgba(0,0,0,0.5);
  border-radius: 10px;
  color: #fff;
}

.vcr-changed-direction__icon {
  box-sizing: border-box;
  width: auto;
  height: calc(100% - 16px);
  margin: 8px;
}
</style>
