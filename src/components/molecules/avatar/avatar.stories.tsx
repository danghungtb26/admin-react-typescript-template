import Avatar from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Molecules/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    rounded: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    fallback: 'John Doe',
  },
}

export const WithFallback: Story = {
  args: {
    fallback: 'Dang Van Hung',
  },
}

export const UnknownFallback: Story = {
  args: {},
}

export const SingleWordFallback: Story = {
  args: {
    fallback: 'Alice',
  },
}

export const Small: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    fallback: 'John Doe',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    fallback: 'John Doe',
    size: 'lg',
  },
}

export const ExtraLarge: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    fallback: 'John Doe',
    size: '2xl',
  },
}

export const Square: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    fallback: 'John Doe',
    rounded: false,
  },
}

export const SquareWithFallback: Story = {
  args: {
    fallback: 'Dang Van Hung',
    rounded: false,
    size: 'lg',
  },
}
