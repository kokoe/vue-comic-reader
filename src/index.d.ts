export type Direction = 'horizontal' | 'vertical';

export type PageContent = {
  key: number;
  pageNumber: number;
  pagesIndex: number | null;
  src: string | null;
  slot: 'first-page' | 'last-page' | 'page';
}

export type Page = PageContent[];

export type Pages = Page[];

export type PageSlotScope = {
  slideIndex: number;
  pageContent: PageContent;
  type: 'odd' | 'even';
  spread: boolean;
  totalPage: number;
}

export type MenuSlotScope = {
  direction: Direction;
  activePage: number;
  totalPage: number;
}

export type EmitChangeActivePage = {
  activePage: number;
  isLastPage: boolean;
}

export type DataType = {
  swiper: Swiper | null;
  direction: Direction;
  activeSlideIndex: number;
  isShowMenu: boolean;
  transitioning: boolean;
  hasFirstSlot: boolean;
  hasLastSlot: boolean;
  noticeDirection: {
    isShow: boolean;
    displayTime: number;
    timerId_: number;
  },
  mq: MediaQueryList | null;
  spread_: boolean;
  domRefresh_: boolean;
  initializedActiveSlideIndex_: boolean;
}
