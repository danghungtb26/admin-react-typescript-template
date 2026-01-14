import { Info } from 'lucide-react'

import { Button } from '@/components/atoms/button'

import { Tooltip } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Molecules/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
  },
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: <Button>Hover me</Button>,
    content: 'This is a tooltip',
  },
}

export const Top: Story = {
  args: {
    children: <Button>Hover me</Button>,
    content: 'Tooltip on top',
    side: 'top',
  },
}

export const Bottom: Story = {
  args: {
    children: <Button>Hover me</Button>,
    content: 'Tooltip on bottom',
    side: 'bottom',
  },
}

export const Left: Story = {
  args: {
    children: <Button>Hover me</Button>,
    content: 'Tooltip on left',
    side: 'left',
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <Button variant="outline" size="icon">
        <Info className="h-4 w-4" />
      </Button>
    ),
    content: 'Additional information',
  },
}

export const LongContent: Story = {
  args: {
    children: <Button>Hover for details</Button>,
    content:
      'This is a much longer tooltip that contains more detailed information about the button',
  },
}

export const CustomStyling: Story = {
  args: {
    children: <Button variant="secondary">Hover me</Button>,
    content: 'Custom styled tooltip',
    contentClassName: 'bg-blue-500 text-white',
  },
}
