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
      <SwiperSlide v-for="(page, i) in formattedPages" :key="i" class="vcr__swiper-slide">
        <div v-for="pageContent in page" :key="pageContent.pageNumber" class="vcr__swiper-slide-inner">
          <slot
            v-if="$slots['first-page'] && pageContent.slot === 'first-page'"
            name="first-page"
            :page-content="pageContent"
          />
          <slot
            v-else
            name="page"
            :page-content="pageContent"
          >
            {{pageContent.horizontalClickTo}}
            <img :src="pageContent.src" alt="">
          </slot>
        </div>
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
import Vue, { PropType } from 'vue';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

interface IPageContent {
  pageNumber: number;
  pagesIndex: number | null;
  src: string | null;
  slot?: 'first-page';
  horizontalClickTo: 'prev' | 'next';
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
    direction: {
      type: String,
      default: 'horizontal' // horizontal | vertical
    },
    spread: {
      type: Boolean,
      default: true
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
      isActiveLast: false, // TODO 実際判定が必要
      isShowLast: false,
      isShowLastMoveX: 150,
      clientX_: 0
    };
  },

  computed: {
    formattedPages (): Pages {
      return this.spread ? this.sreadPages : this.pageByPages;
    },
    sreadPages (): Pages {
      const pages: Pages = [[]];
      let startIndex = 0;

      if (this.$slots['first-page']) {
        ++startIndex;
        pages[0].push(this.getFirstPageFormat(startIndex));
        pages.push([]);
      }

      this.pages.forEach((page, i) => {
        pages[pages.length - 1].push({
          pageNumber: i + startIndex + 1,
          pagesIndex: i,
          src: page,
          horizontalClickTo: this.getHorizontalClickTo(i)
        });
        if (i % 2) pages.push([]);
      });
      return pages;
    },
    pageByPages (): Pages {
      const pages: Pages = [[]];
      let startIndex = 0;

      if (this.$slots['first-page']) {
        ++startIndex;
        pages[0].push(this.getFirstPageFormat(startIndex));
      }

      this.pages.forEach((page, i) => {
        pages.push([{
          pageNumber: i + startIndex + 1,
          pagesIndex: i,
          src: page,
          horizontalClickTo: 'next'
        }]);
      });
      return pages;
    },

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
        centeredSlides: false
        // slidesPerView: 2,
        // slidesPerGroup: 2,
        // slidesPerGroupSkip: 1
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
    getHorizontalClickTo (pageIndex: number): 'prev' | 'next' {
      if (!this.spread) {
        return 'next';
      } else if (this.isHorizontal) {
        return (pageIndex % 2) ? 'next' : 'prev';
      // } else {
      //   return (pageIndex % 2) ? 'prev' : 'next';
      }
    },
    getInitialPage (): number {
      if (this.initialPage > this.totalPage) {
        return this.totalPage;
      } else if (this.initialPage < 1) {
        return 1;
      } else {
        return this.initialPage;
      }
    },
    getFirstPageFormat (pageNumber: number): IPageContent {
      return {
        pageNumber,
        pagesIndex: null,
        src: null,
        slot: 'first-page',
        horizontalClickTo: 'next'
      };
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
  display: inline-flex;
  justify-content: center;
  align-items: flex-start;
  // &:first-child {
  //   transition: transform 100ms;
  //   text-align: center;
  // }
  // &:nth-child(2) {
  //   transition: transform 10ms, opacity 10ms;
  // }
  // &:nth-child(2n) {
  //   text-align: left;
  // }
  // &.swiper-slide-active:first-child {
  //   transform: translateX(-50%);
  //   // z-index: 2;
  // }
  // &.swiper-slide-next:nth-child(2) {
  //   opacity: 0;
  //   // transform: translateX(-55%);
  //   // z-index: 1;
  // }
}

.vcr__swiper-slide-inner {
  line-height: 1;
  > img {
    vertical-align: top;
    width: auto;
    height: 50vh;
  }
}
</style>
