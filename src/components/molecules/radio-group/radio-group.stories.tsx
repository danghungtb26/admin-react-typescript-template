import { useState } from 'react'

import { RadioGroupField } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof RadioGroupField> = {
  title: 'Molecules/RadioGroupField',
  component: RadioGroupField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: 'Layout orientation',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state for all options',
    },
  },
  decorators: [
    Story => {
      const [value, setValue] = useState('')
      return <Story args={{ value, onValueChange: setValue }} />
    },
  ],
}

export default meta
type Story = StoryObj<typeof RadioGroupField>

export const Default: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    orientation: 'vertical',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default radio group with vertical layout',
      },
    },
  },
}

export const Horizontal: Story = {
  args: {
    options: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
    ],
    orientation: 'horizontal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Radio group with horizontal layout',
      },
    },
  },
}

export const Gender: Story = {
  args: {
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
    ],
    orientation: 'vertical',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gender selection radio group',
      },
    },
  },
}

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'enabled1', label: 'Enabled Option 1' },
      { value: 'disabled', label: 'Disabled Option', disabled: true },
      { value: 'enabled2', label: 'Enabled Option 2' },
    ],
    orientation: 'vertical',
  },
  parameters: {
    docs: {
      description: {
        story: 'Radio group with one disabled option',
      },
    },
  },
}

export const AllDisabled: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    disabled: true,
    value: 'option2',
    orientation: 'vertical',
  },
  parameters: {
    docs: {
      description: {
        story: 'Radio group with all options disabled',
      },
    },
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('medium')

    return (
      <div className="flex flex-col gap-4">
        <RadioGroupField
          options={[
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' },
            { value: 'xlarge', label: 'Extra Large' },
          ]}
          value={value}
          onValueChange={setValue}
          orientation="vertical"
        />
        <div className="text-sm text-muted-foreground">
          Selected: <span className="font-mono">{value || '(none)'}</span>
        </div>
        <button
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
          onClick={() => setValue('')}
        >
          Clear Selection
        </button>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled radio group example with clear button',
      },
    },
  },
}
