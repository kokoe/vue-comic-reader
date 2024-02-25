import type { Props as VCRProps } from '@/types';

export type Props = {
  pages: VCRProps['pages'];
};

export type Emits = {
  (e: 'click:content'): void;
};
