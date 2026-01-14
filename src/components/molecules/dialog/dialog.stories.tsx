import { useState } from 'react'

import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'

import { Dialog } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Molecules/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      decoratorsBeforeExport: true,
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'The controlled open state of the dialog',
    },
    showDefaultFooter: {
      control: 'boolean',
      description: 'Whether to show the default footer with confirm/cancel buttons',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button in the header',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    title: {
      control: 'text',
      description: 'The title of the dialog',
    },
    description: {
      control: 'text',
      description: 'The description of the dialog',
    },
    confirmText: {
      control: 'text',
      description: 'Text for the confirm button',
      table: {
        defaultValue: { summary: 'Confirm' },
      },
    },
    cancelText: {
      control: 'text',
      description: 'Text for the cancel button',
      table: {
        defaultValue: { summary: 'Cancel' },
      },
    },
  },
  render: args => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        <Dialog {...args} open={open} onOpenChange={setOpen} />
      </>
    )
  },
} satisfies Meta<typeof Dialog>

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
          <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input id="username" defaultValue="@peduarte" className="col-span-3" />
        </div>
      </div>
    ),
    showDefaultFooter: true,
  },
}

export const CustomFooter: Story = {
  args: {
    title: 'Custom Footer',
    children: <div className="py-4">Content with a custom footer</div>,
    footer: closeDialog => (
      <div className="flex w-full justify-between">
        <Button variant="destructive" onClick={closeDialog}>
          Delete
        </Button>
        <Button onClick={closeDialog}>Save Changes</Button>
      </div>
    ),
  },
}

export const NoCloseButton: Story = {
  args: {
    title: 'No Close Button',
    description: 'This dialog has no close button in the header',
    showCloseButton: false,
    children: <div className="py-4">You must use the cancel button to close this dialog.</div>,
    showDefaultFooter: true,
  },
}

export const ConfirmationDialog: Story = {
  args: {
    title: 'Are you sure?',
    description: 'This action cannot be undone. This will permanently delete your account.',
    children: (
      <div className="py-4">All of your data will be permanently removed from our servers.</div>
    ),
    showDefaultFooter: true,
    confirmText: 'Delete Account',
    cancelText: 'Cancel',
    confirmButtonProps: {
      variant: 'destructive',
    },
  },
}

export const SimpleContent: Story = {
  args: {
    title: 'Success!',
    description: 'Your changes have been saved successfully.',
    children: null,
    showDefaultFooter: false,
  },
}

export const LongContent: Story = {
  args: {
    title: 'Terms and Conditions',
    description: 'Please read and accept our terms and conditions',
    children: (
      <div className="py-4 max-h-[300px] overflow-y-auto">
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
        <p className="mb-4">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
        <p className="mb-4">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
        <p className="mb-4">
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
          anim id est laborum.
        </p>
        <p className="mb-4">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam.
        </p>
      </div>
    ),
    showDefaultFooter: true,
    confirmText: 'Accept',
    cancelText: 'Decline',
  },
}

export const WithForm: Story = {
  args: {
    title: 'Create New User',
    description: 'Enter the details for the new user account',
    children: (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="firstName" className="text-right">
            First Name
          </Label>
          <Input id="firstName" placeholder="John" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="lastName" className="text-right">
            Last Name
          </Label>
          <Input id="lastName" placeholder="Doe" className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <Input id="email" type="email" placeholder="john@example.com" className="col-span-3" />
        </div>
      </div>
    ),
    showDefaultFooter: true,
    confirmText: 'Create User',
  },
}
