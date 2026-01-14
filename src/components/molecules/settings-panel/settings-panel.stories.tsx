import { useState } from 'react'

import { Button } from '@/components/atoms/button'

import { SettingsPanel } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof SettingsPanel> = {
  title: 'Molecules/SettingsPanel',
  component: SettingsPanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SettingsPanel>

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false)

    return (
      <div className="p-4">
        <Button onClick={() => setOpen(true)}>Open Settings</Button>
        <SettingsPanel open={open} onOpenChange={setOpen} />
      </div>
    )
  },
}

export const AlwaysOpen: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
  },
}
