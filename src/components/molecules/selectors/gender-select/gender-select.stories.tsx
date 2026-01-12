import { useState } from 'react'

import { Gender, GenderSelect } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof GenderSelect> = {
  title: 'Molecules/Selectors/GenderSelect',
  component: GenderSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  decorators: [
    Story => {
      const [value, setValue] = useState<Gender | undefined>()
      return <Story args={{ value, onChange: setValue }} />
    },
  ],
}

export default meta
type Story = StoryObj<typeof GenderSelect>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default gender select with placeholder',
      },
    },
  },
}

export const WithValue: Story = {
  args: {
    value: 'male',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gender select with pre-selected value',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    value: 'female',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled gender select',
      },
    },
  },
}

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Choose your gender',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gender select with custom placeholder',
      },
    },
  },
}

export const FullWidth: Story = {
  args: {
    className: 'w-full min-w-[300px]',
  },
  parameters: {
    docs: {
      description: {
        story: 'Gender select with full width',
      },
    },
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<Gender | undefined>('male')

    return (
      <div className="flex flex-col gap-4">
        <GenderSelect value={value} onChange={setValue} className="w-75" />
        <div className="text-sm text-muted-foreground">
          Selected: <span className="font-mono">{value || '(none)'}</span>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            onClick={() => setValue('male')}
          >
            Set Male
          </button>
          <button
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            onClick={() => setValue('female')}
          >
            Set Female
          </button>
          <button
            className="rounded-md bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
            onClick={() => setValue(undefined)}
          >
            Clear
          </button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled gender select with buttons',
      },
    },
  },
}
