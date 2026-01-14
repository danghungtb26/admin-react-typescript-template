import { ThemeSwitcher } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ThemeSwitcher> = {
  title: 'Molecules/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showLabels: {
      control: 'boolean',
      description: 'Show labels for each theme option',
    },
  },
}

export default meta
type Story = StoryObj<typeof ThemeSwitcher>

export const Default: Story = {
  args: {
    showLabels: true,
  },
}

export const WithoutLabels: Story = {
  args: {
    showLabels: false,
  },
}

export const InCard: Story = {
  render: () => (
    <div className="w-[300px] rounded-lg border p-4">
      <h3 className="text-sm font-medium mb-4">Theme Preference</h3>
      <ThemeSwitcher />
    </div>
  ),
}
