import Progressbar from '@/components/components/progressbar'

export default {
  title: 'Example/Progressbar',
  component: Progressbar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value:  {
      control: { type: 'range', min: 0, max: 100, step: 0.1 },
    },
  },
};

export const Primary = {
  args: {
    value: 98.3
  },
};
