<template>
  <div
    class="vcr"
    :style="wrapStyle"
    @contextmenu="onContextmenu"
  >
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
      @click="onClickSwiperContainer"
      @ready="onReady"
      @slideChange="onSlideChange"
      @slideChangeTransitionStart="onChangeTransition('start')"
      @slideChangeTransitionEnd="onChangeTransition('end')"
    >
      <SwiperSlide
        v-for="(page, i) in formattedPages"
        :key="i"
        class="vcr__swiper-slide"
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
            <img :src="pageContent.src" alt="">
            <a v-if="i !== 0" @click.prevent="toPrev" href="#" class="vcr__swiper-slide-nav is-prev" aria-label="Previous">Prev</a>
            <a v-if="i < (formattedPages.length - 1)" @click.prevent="toNext" href="#" class="vcr__swiper-slide-nav is-next" aria-label="Next">Next</a>
            <div class="vcr__swiper-slide-gurad-image" data-show-menu="true"></div>
          </slot>
        </div>
      </SwiperSlide>
    </Swiper>

    <div v-if="isShowMenu" class="vcr__overlay" @click="isShowMenu = false"></div>

    <footer v-if="isShowMenu" class="vcr__footer">
      <slot name="footer">
        footer
      </slot>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

interface IPageContent {
  pageNumber: number;
  pagesIndex: number | null;
  src: string | null;
  slot?: 'first-page' | 'last-page';
}

type Page = IPageContent[];

type Pages = Page[];

export default Vue.extend({
  name: 'VueComicReader',

  components: {
    Swiper,
    SwiperSlide
  },

  props: {
    height: {
      type: [String, Number],
      default: '100vh',
      required: true
    },
    direction: {
      type: String,
      default: 'horizontal' // horizontal | vertical
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
    }
  },

  data () {
    return {
      activeIndex: this.initialPage - 1,
      isShowMenu: false,
      transitioning: false
    };
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
        direction: this.direction,
        centeredSlides: false
      };
    },

    swiperVerticalOptions (): { [key: string]: unknown } {
      return {
        direction: this.direction,
        freeMode: true
      };
    },

    swiper (): any {
      return (this.$refs as any).swiper.$swiper;
    },

    totalPage (): number {
      let total = this.pages.length;

      total = this.hasFirstSlot ? ++total : total;
      total = this.hasLastSlot ? ++total : total;

      return total;
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
      this.swiper.slidePrev();
    },

    toNext (): void {
      this.swiper.slideNext();
    },

    getSlideInnerClass (pageContentIndex: number, pageContentLength: number): { [key: string]: boolean } {
      const isSpreadSlide = pageContentLength > 1;
      return {
        'is-spread-odd': this.spread ? isSpreadSlide && !pageContentIndex : false,
        'is-spread-even': this.spread ? isSpreadSlide && !!pageContentIndex : false,
        'is-spread': isSpreadSlide
      };
    },

    getActiveIndex (pageNumber: number): number {
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

    getSlotPageFormat (slot: 'first-page' | 'last-page', pageNumber: number): IPageContent {
      return {
        pageNumber,
        pagesIndex: null,
        src: null,
        slot
      };
    },

    onReady () {
      this.activeIndex = this.getActiveIndex(this.initialPage);
      this.swiper.slideTo(this.activeIndex, 0, false);
    },

    onSlideChange (swiper: any): void {
      this.activeIndex = swiper.activeIndex;
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

    onContextmenu (e: Event): void {
      if (!Vue.config.devtools) {
        e.preventDefault();
        this.isShowMenu = true;
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@import '~swiper/swiper-bundle.css';

.vcr {
  position: relative;
  overflow: hidden;
  user-select: none;
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

.vcr__overlay {
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
}

.vcr__swiper-container {
  width: 100%;
  height: 100%;
}

.vcr__swiper-slide {
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.vcr__swiper-slide-inner {
  direction: ltr;
  position: relative;
  line-height: 1;
  height: 100%;
  width: auto;
  flex: 0 0 auto;
  max-width: 100%;
  > img {
    vertical-align: top;
    width: auto;
    height: 100%;
  }
}

.vcr__swiper-slide-gurad-image {
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.vcr__swiper-slide-nav {
  display: block;
  background: rgba(0,0,0,0.3);
  position: absolute;
  z-index: 3;
  color: transparent !important;
  font-size: 1px;

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
