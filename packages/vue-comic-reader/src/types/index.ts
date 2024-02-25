export type XDirection = 'ltr' | 'rtl';
export type YDirection = 'horizontal' | 'vertical';

// export type PageContent = {
//   key: number;
//   pageNumber: number;
//   pagesIndex: number | null;
//   src: string | null;
//   slot: 'first-page' | 'last-page' | 'page';
// };

// export type Page = PageContent[];

// export type Pages = Page[];

// export type PageSlotScope = {
//   slideIndex: number;
//   pageContent: PageContent;
//   type: 'odd' | 'even';
//   spread: boolean;
//   totalPage: number;
// };

// export type MenuSlotScope = {
//   direction: Direction;
//   activePage: number;
//   totalPage: number;
// };

// export type EmitChangeActivePage = {
//   activePage: number;
//   isLastPage: boolean;
// };

// export type DataType = {
//   swiper: Swiper | null;
//   direction: Direction;
//   activeSlideIndex: number;
//   isShowMenu: boolean;
//   transitioning: boolean;
//   hasFirstSlot: boolean;
//   hasLastSlot: boolean;
//   noticeDirection: {
//     isShow: boolean;
//     displayTime: number;
//     timerId_: number;
//   };
//   mq: MediaQueryList | null;
//   spread_: boolean;
//   domRefresh_: boolean;
//   initializedActiveSlideIndex_: boolean;
// };

// // default vertical => rtl
// // reverse => ltr
// reverseHorizontal: {
//   type: Boolean,
//   default: false
// },
// pages: {
//   type: Array as PropType<string[]>,
//   required: true
// },
// smallViewBreakPoint: {
//   type: Number,
//   default: 768
// },
// // Not index
// initialPage: {
//   type: Number,
//   default: 1
// },
// lazy: {
//   type: [Boolean, Object as ()=> LazyOptions],
//   default: false
// },
// navigation: {
//   type: Boolean,
//   default: false
// },
// prevPageMessage: {
//   type: String,
//   default: 'Previous page'
// },
// nextPageMessage: {
//   type: String,
//   default: 'Next page'
// }
export type Page = {
  path: string;
  extensions: string;
};

export type TailwindClasses = {
  header?: string[];
  footer?: string[];
};

export type Props = {
  pages: string[];
  xDirection?: XDirection;
  // yDirection?: YDirection;
  spread?: boolean;
  firstUnspread?: boolean;
  initialPage?: number;
  // lazy?: boolean | LazyOptions;
  navigation?: boolean;
  classes?: TailwindClasses;
};
