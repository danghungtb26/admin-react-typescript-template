import { Calendar } from 'lucide-react'

import { Button } from '@/components/atoms/button'

import { Popover } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Molecules/Popover',
  component: Popover,
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
    triggerMode: {
      control: 'select',
      options: ['click', 'hover'],
    },
  },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Open Popover</Button>,
    content: (
      <div className="p-4">
        <h3 className="font-semibold mb-2">Popover Title</h3>
        <p className="text-sm text-muted-foreground">This is the popover content</p>
      </div>
    ),
  },
}

export const WithHoverTrigger: Story = {
  args: {
    trigger: <Button variant="outline">Hover me</Button>,
    triggerMode: 'hover',
    content: (
      <div className="p-4">
        <p className="text-sm">This appears on hover</p>
      </div>
    ),
  },
}

export const BottomSide: Story = {
  args: {
    trigger: <Button>Click me</Button>,
    side: 'bottom',
    content: (
      <div className="p-4 w-64">
        <h4 className="font-semibold mb-2">Information</h4>
        <p className="text-sm text-muted-foreground">
          This popover appears at the bottom of the trigger element.
        </p>
      </div>
    ),
  },
}

export const WithForm: Story = {
  args: {
    trigger: <Button variant="secondary">Settings</Button>,
    content: (
      <div className="p-4 w-80">
        <h3 className="font-semibold mb-4">Quick Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              className="w-full mt-1 px-3 py-2 border rounded-md"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-3 py-2 border rounded-md"
              placeholder="Enter email"
            />
          </div>
          <Button className="w-full">Save</Button>
        </div>
      </div>
    ),
  },
}

export const WithCloseButton: Story = {
  args: {
    trigger: <Button>Open</Button>,
    content: (closePopover: () => void) => (
      <div className="p-4 w-64">
        <h3 className="font-semibold mb-2">Confirmation</h3>
        <p className="text-sm text-muted-foreground mb-4">Are you sure you want to continue?</p>
        <div className="flex gap-2">
          <Button size="sm" onClick={closePopover}>
            Confirm
          </Button>
          <Button size="sm" variant="outline" onClick={closePopover}>
            Cancel
          </Button>
        </div>
      </div>
    ),
  },
}

export const WithIcon: Story = {
  args: {
    trigger: (
      <Button variant="outline" size="icon">
        <Calendar className="h-4 w-4" />
      </Button>
    ),
    content: (
      <div className="p-4">
        <p className="text-sm">Select a date from the calendar</p>
      </div>
    ),
  },
}
