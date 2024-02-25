export type Props = {
  minHeightClass?: string;
  wrapperClasses?: string[];
};

export type Emits = {
  (e: 'click:close'): void;
};
