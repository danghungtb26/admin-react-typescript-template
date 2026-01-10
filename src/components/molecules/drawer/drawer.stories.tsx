import { useState } from 'react'

import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'

import { Drawer } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Molecules/Drawer',
  component: Drawer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
      description: 'The direction of the drawer',
      table: {
        defaultValue: { summary: 'right' },
      },
    },
    open: {
      control: 'boolean',
      description: 'The controlled open state of the drawer',
    },
    showDefaultFooter: {
      control: 'boolean',
      description: 'Whether to show the default footer with confirm/cancel buttons',
    },
    title: {
      control: 'text',
      description: 'The title of the drawer',
    },
    description: {
      control: 'text',
      description: 'The description of the drawer',
    },
  },
  render: args => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Drawer</Button>
        <Drawer {...args} open={open} onOpenChange={setOpen} />
      </>
    )
  },
} satisfies Meta<typeof Drawer>

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
    direction: 'right',
    children: <div className="py-4">Content with a custom footer</div>,
    footer: closeDrawer => (
      <div className="flex w-full justify-between">
        <Button variant="destructive" onClick={closeDrawer}>
          Delete
        </Button>
        <Button onClick={closeDrawer}>Save Changes</Button>
      </div>
    ),
  },
}

export const RightDirection: Story = {
  args: {
    title: 'Right Direction',
    direction: 'right',
    children: <div className="py-4">This drawer slides in from the right.</div>,
    showDefaultFooter: true,
  },
}

export const LeftDirection: Story = {
  args: {
    title: 'Left Direction',
    direction: 'left',
    children: <div className="py-4">This drawer slides in from the left.</div>,
    showDefaultFooter: true,
  },
}

export const TopDirection: Story = {
  args: {
    title: 'Top Direction',
    direction: 'top',
    children: <div className="py-4">This drawer slides in from the top.</div>,
    showDefaultFooter: true,
  },
}

export const BottomDirection: Story = {
  args: {
    title: 'Bottom Direction',
    direction: 'bottom',
    children: <div className="py-4">This drawer slides in from the bottom.</div>,
    showDefaultFooter: true,
  },
}
