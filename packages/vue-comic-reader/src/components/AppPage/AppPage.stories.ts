import type { Meta, StoryObj } from '@storybook/vue3';
import AppPage from './AppPage.vue';
type Story = StoryObj<typeof AppPage>;

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta: Meta<typeof AppPage> = {
  title: 'Components/AppPage',
  component: AppPage,
  tags: ['autodocs'],
};

// More on writing stories with args: https://storybook.js.org/docs/vue/writing-stories/args
export const Primary: Story = {
  args: {
    page: 'http://placekitten.com/200/300',
  },
};

export default meta;
