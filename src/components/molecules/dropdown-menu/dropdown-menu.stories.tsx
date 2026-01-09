import { Button } from '@/components/atoms/button'

import { DropdownMenu } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Molecules/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Open Menu</Button>,
    items: [
      {
        type: 'item',
        key: 'profile',
        label: 'Profile',
        onClick: () => alert('Profile clicked'),
      },
      {
        type: 'item',
        key: 'settings',
        label: 'Settings',
        onClick: () => alert('Settings clicked'),
      },
      {
        type: 'separator',
        key: 'sep1',
      },
      {
        type: 'item',
        key: 'logout',
        label: 'Log out',
        variant: 'destructive',
        onClick: () => alert('Logout clicked'),
      },
    ],
  },
}

export const WithLabel: Story = {
  args: {
    trigger: <Button variant="outline">User Menu</Button>,
    items: [
      {
        type: 'label',
        key: 'label1',
        label: 'My Account',
      },
      {
        type: 'item',
        key: 'profile',
        label: 'Profile',
        shortcut: '⇧⌘P',
      },
      {
        type: 'item',
        key: 'settings',
        label: 'Settings',
        shortcut: '⌘S',
      },
      {
        type: 'separator',
        key: 'sep1',
      },
      {
        type: 'item',
        key: 'logout',
        label: 'Log out',
        shortcut: '⇧⌘Q',
        variant: 'destructive',
      },
    ],
  },
}

export const WithGroups: Story = {
  args: {
    trigger: <Button variant="secondary">Actions</Button>,
    items: [
      {
        type: 'group',
        key: 'group1',
        items: [
          {
            type: 'item',
            key: 'new',
            label: 'New File',
            shortcut: '⌘N',
          },
          {
            type: 'item',
            key: 'open',
            label: 'Open',
            shortcut: '⌘O',
          },
        ],
      },
      {
        type: 'separator',
        key: 'sep1',
      },
      {
        type: 'group',
        key: 'group2',
        items: [
          {
            type: 'item',
            key: 'save',
            label: 'Save',
            shortcut: '⌘S',
          },
          {
            type: 'item',
            key: 'saveas',
            label: 'Save As',
            shortcut: '⇧⌘S',
          },
        ],
      },
    ],
  },
}

export const WithSubMenu: Story = {
  args: {
    trigger: <Button>More Options</Button>,
    items: [
      {
        type: 'item',
        key: 'new',
        label: 'New',
      },
      {
        type: 'sub',
        key: 'share',
        label: 'Share',
        items: [
          {
            type: 'item',
            key: 'email',
            label: 'Email',
          },
          {
            type: 'item',
            key: 'message',
            label: 'Message',
          },
          {
            type: 'separator',
            key: 'sep-share',
          },
          {
            type: 'item',
            key: 'more',
            label: 'More...',
          },
        ],
      },
      {
        type: 'separator',
        key: 'sep1',
      },
      {
        type: 'item',
        key: 'delete',
        label: 'Delete',
        variant: 'destructive',
      },
    ],
  },
}

export const WithDisabledItems: Story = {
  args: {
    trigger: <Button variant="outline">Edit</Button>,
    items: [
      {
        type: 'item',
        key: 'undo',
        label: 'Undo',
        shortcut: '⌘Z',
      },
      {
        type: 'item',
        key: 'redo',
        label: 'Redo',
        shortcut: '⇧⌘Z',
        disabled: true,
      },
      {
        type: 'separator',
        key: 'sep1',
      },
      {
        type: 'item',
        key: 'cut',
        label: 'Cut',
        shortcut: '⌘X',
        disabled: true,
      },
      {
        type: 'item',
        key: 'copy',
        label: 'Copy',
        shortcut: '⌘C',
      },
      {
        type: 'item',
        key: 'paste',
        label: 'Paste',
        shortcut: '⌘V',
      },
    ],
  },
}
