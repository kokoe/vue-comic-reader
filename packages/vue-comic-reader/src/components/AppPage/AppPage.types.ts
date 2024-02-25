import type { Props as VCRProps } from '@/types';

export type Props = {
  page: VCRProps['pages'][number] | undefined;
  tag?: string;
};
