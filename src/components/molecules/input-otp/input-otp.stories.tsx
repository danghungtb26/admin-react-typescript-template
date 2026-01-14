import { useState } from 'react'

import { OTPInput } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof OTPInput> = {
  title: 'Molecules/OTPInput',
  component: OTPInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    maxLength: {
      control: { type: 'number', min: 4, max: 8 },
      description: 'Number of OTP slots',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    pattern: {
      control: 'text',
      description: 'Pattern to match (e.g., ^[0-9]*$ for numbers only)',
    },
  },
  decorators: [
    Story => {
      const [value, setValue] = useState('')
      return <Story args={{ value, onChange: setValue }} />
    },
  ],
}

export default meta
type Story = StoryObj<typeof OTPInput>

export const Default: Story = {
  args: {
    maxLength: 6,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default OTP input with 6 slots',
      },
    },
  },
}

export const FourDigits: Story = {
  args: {
    maxLength: 4,
  },
  parameters: {
    docs: {
      description: {
        story: 'OTP input with 4 slots',
      },
    },
  },
}

export const EightDigits: Story = {
  args: {
    maxLength: 8,
  },
  parameters: {
    docs: {
      description: {
        story: 'OTP input with 8 slots',
      },
    },
  },
}

export const NumbersOnly: Story = {
  args: {
    maxLength: 6,
    pattern: '^[0-9]*$',
  },
  parameters: {
    docs: {
      description: {
        story: 'OTP input that only accepts numbers (0-9)',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    maxLength: 6,
    disabled: true,
    value: '123456',
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled OTP input with preset value',
      },
    },
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('')

    return (
      <div className="flex flex-col items-center gap-4">
        <OTPInput value={value} onChange={setValue} maxLength={6} />
        <div className="text-sm text-muted-foreground">
          Value: <span className="font-mono">{value || '(empty)'}</span>
        </div>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          onClick={() => setValue('')}
        >
          Clear
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled OTP input example with clear button',
      },
    },
  },
}
