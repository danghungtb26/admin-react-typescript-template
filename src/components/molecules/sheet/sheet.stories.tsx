import { useState } from 'react'

import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'

import { Sheet } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Molecules/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The side of the screen the sheet will appear from',
      table: {
        defaultValue: { summary: 'right' },
      },
    },
    open: {
      control: 'boolean',
      description: 'The controlled open state of the sheet',
    },
    showDefaultFooter: {
      control: 'boolean',
      description: 'Whether to show the default footer with confirm/cancel buttons',
    },
    title: {
      control: 'text',
      description: 'The title of the sheet',
    },
    description: {
      control: 'text',
      description: 'The description of the sheet',
    },
  },
  render: args => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Sheet</Button>
        <Sheet {...args} open={open} onOpenChange={setOpen} />
      </>
    )
  },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Edit Profile',
    description: "Make changes to your profile here. Click save when you're done.",
    children: (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" value="Pedro Duarte" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input id="username" value="@peduarte" className="col-span-3" />
        </div>
      </div>
    ),
    showDefaultFooter: true,
  },
}

export const CustomFooter: Story = {
  args: {
    title: 'Custom Footer',
    side: 'right',
    children: <div className="py-4">Content with a custom footer</div>,
    footer: closeSheet => (
      <div className="flex w-full justify-between">
        <Button variant="destructive" onClick={closeSheet}>
          Delete
        </Button>
        <Button onClick={closeSheet}>Save Changes</Button>
      </div>
    ),
  },
}

export const LeftSide: Story = {
  args: {
    title: 'Left Side Sheet',
    side: 'left',
    children: <div className="py-4">This sheet slides in from the left.</div>,
    showDefaultFooter: true,
  },
}

export const TopSide: Story = {
  args: {
    title: 'Top Side Sheet',
    side: 'top',
    children: <div className="py-4">This sheet slides in from the top.</div>,
    showDefaultFooter: true,
  },
}

export const BottomSide: Story = {
  args: {
    title: 'Bottom Side Sheet',
    side: 'bottom',
    children: <div className="py-4">This sheet slides in from the bottom.</div>,
    showDefaultFooter: true,
  },
}
