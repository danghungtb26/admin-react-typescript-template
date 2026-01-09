import { Copy, Download, Edit, Trash2 } from 'lucide-react'

import { ContextMenu } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Molecules/ContextMenu',
  component: ContextMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="flex h-50 w-75 items-center justify-center rounded-md border border-dashed text-sm">
        Right click here
      </div>
    ),
    items: [
      {
        type: 'item',
        label: 'Copy',
        onClick: () => alert('Copy clicked'),
      },
      {
        type: 'item',
        label: 'Cut',
        onClick: () => alert('Cut clicked'),
      },
      {
        type: 'item',
        label: 'Paste',
        onClick: () => alert('Paste clicked'),
      },
      {
        type: 'separator',
      },
      {
        type: 'item',
        label: 'Delete',
        onClick: () => alert('Delete clicked'),
      },
    ],
  },
}

export const WithShortcuts: Story = {
  args: {
    children: (
      <div className="flex h-50 w-75 items-center justify-center rounded-md border border-dashed text-sm">
        Right click for options
      </div>
    ),
    items: [
      {
        type: 'item',
        label: 'Copy',
        shortcut: '⌘C',
        onClick: () => alert('Copy'),
      },
      {
        type: 'item',
        label: 'Cut',
        shortcut: '⌘X',
        onClick: () => alert('Cut'),
      },
      {
        type: 'item',
        label: 'Paste',
        shortcut: '⌘V',
        onClick: () => alert('Paste'),
      },
      {
        type: 'separator',
      },
      {
        type: 'item',
        label: 'Select All',
        shortcut: '⌘A',
        onClick: () => alert('Select All'),
      },
    ],
  },
}

export const WithIcons: Story = {
  args: {
    children: (
      <div className="flex h-50 w-75 items-center justify-center rounded-md border border-dashed text-sm">
        Right click on this card
      </div>
    ),
    items: [
      {
        type: 'item',
        label: 'Edit',
        icon: <Edit className="h-4 w-4" />,
        shortcut: '⌘E',
        onClick: () => alert('Edit'),
      },
      {
        type: 'item',
        label: 'Copy',
        icon: <Copy className="h-4 w-4" />,
        shortcut: '⌘C',
        onClick: () => alert('Copy'),
      },
      {
        type: 'item',
        label: 'Download',
        icon: <Download className="h-4 w-4" />,
        shortcut: '⌘D',
        onClick: () => alert('Download'),
      },
      {
        type: 'separator',
      },
      {
        type: 'item',
        label: 'Delete',
        icon: <Trash2 className="h-4 w-4" />,
        shortcut: '⌘⌫',
        onClick: () => alert('Delete'),
      },
    ],
  },
}

export const WithCheckboxItems: Story = {
  args: {
    children: (
      <div className="flex h-50 w-75 items-center justify-center rounded-md border border-dashed text-sm">
        Right click for view options
      </div>
    ),
    items: [
      {
        type: 'label',
        label: 'View Options',
      },
      {
        type: 'checkbox',
        label: 'Show Toolbar',
        checked: true,
        onCheckedChange: checked => console.log('Toolbar:', checked),
      },
      {
        type: 'checkbox',
        label: 'Show Sidebar',
        checked: false,
        onCheckedChange: checked => console.log('Sidebar:', checked),
      },
      {
        type: 'checkbox',
        label: 'Show Status Bar',
        checked: true,
        onCheckedChange: checked => console.log('Status Bar:', checked),
      },
    ],
  },
}

export const WithRadioGroup: Story = {
  args: {
    children: (
      <div className="flex h-50 w-75 items-center justify-center rounded-md border border-dashed text-sm">
        Right click to change theme
      </div>
    ),
    items: [
      {
        type: 'label',
        label: 'Theme',
      },
      {
        type: 'radio',
        label: 'Light',
        value: 'light',
      },
      {
        type: 'radio',
        label: 'Dark',
        value: 'dark',
      },
      {
        type: 'radio',
        label: 'System',
        value: 'system',
      },
    ],
    radioValue: 'light',
    onRadioValueChange: (value: string) => console.log('Theme:', value),
  },
}

export const WithSubMenu: Story = {
  args: {
    children: (
      <div className="flex h-50 w-75 items-center justify-center rounded-md border border-dashed text-sm">
        Right click for more options
      </div>
    ),
    items: [
      {
        type: 'item',
        label: 'New File',
        shortcut: '⌘N',
      },
      {
        type: 'sub',
        label: 'Share',
        items: [
          {
            type: 'item',
            label: 'Email Link',
          },
          {
            type: 'item',
            label: 'Copy Link',
          },
          {
            type: 'separator',
          },
          {
            type: 'item',
            label: 'More...',
          },
        ],
      },
      {
        type: 'separator',
      },
      {
        type: 'item',
        label: 'Delete',
        shortcut: '⌘⌫',
      },
    ],
  },
}

export const Complex: Story = {
  args: {
    children: (
      <div className="flex h-50 w-75 items-center justify-center rounded-md border border-dashed text-sm">
        Right click for full menu
      </div>
    ),
    items: [
      {
        type: 'label',
        label: 'Actions',
        inset: true,
      },
      {
        type: 'item',
        label: 'Edit',
        icon: <Edit className="h-4 w-4" />,
        shortcut: '⌘E',
        inset: true,
      },
      {
        type: 'item',
        label: 'Copy',
        icon: <Copy className="h-4 w-4" />,
        shortcut: '⌘C',
        inset: true,
      },
      {
        type: 'separator',
      },
      {
        type: 'label',
        label: 'View',
      },
      {
        type: 'checkbox',
        label: 'Show Grid',
        checked: true,
        shortcut: '⌘G',
      },
      {
        type: 'checkbox',
        label: 'Show Rulers',
        checked: false,
        shortcut: '⌘R',
      },
      {
        type: 'separator',
      },
      {
        type: 'item',
        label: 'Delete',
        icon: <Trash2 className="h-4 w-4" />,
        shortcut: '⌘⌫',
        inset: true,
      },
    ],
  },
}
