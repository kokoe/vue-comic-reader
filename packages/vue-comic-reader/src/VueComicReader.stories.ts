import type { Meta, StoryObj } from '@storybook/vue3';
import VueComicReader from './VueComicReader.vue';
type Story = StoryObj<typeof VueComicReader>;

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof VueComicReader> = {
  title: 'Components/VueComicReader',
  component: VueComicReader,
  tags: ['autodocs'],
};

// More on writing stories with args: https://storybook.js.org/docs/vue/writing-stories/args
export const Primary: Story = {
  args: {
    pages: [
      'http://placekitten.com/200/300',
      'http://placekitten.com/500/100',
      'http://placekitten.com/250/500',
      'http://placekitten.com/200/300',
      'http://placekitten.com/500/100',
      'http://placekitten.com/250/500',
      'http://placekitten.com/200/300',
      'http://placekitten.com/500/100',
      'http://placekitten.com/250/500',
    ],
    classes: {
      header: ['bg-gray-800', 'text-white'],
      footer: ['bg-gray-800', 'text-white'],
    },
    style: 'height: 95vh;',
  },
};

export default meta;
