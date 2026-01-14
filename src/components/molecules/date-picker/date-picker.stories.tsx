import { useState } from 'react'

import { DatePicker } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof DatePicker> = {
  title: 'Molecules/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const [date, setDate] = useState<Date | undefined>(context.args.value)

      return (
        <div className="w-75 space-y-4">
          <Story args={{ ...context.args, value: date, onChange: setDate }} />
          {date && (
            <p className="text-sm text-muted-foreground text-center">
              Selected: {date.toLocaleDateString()}
            </p>
          )}
        </div>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Pick a date',
  },
}

export const WithDefaultValue: Story = {
  args: {
    value: new Date(),
    placeholder: 'Pick a date',
  },
}

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Select your birthday',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Pick a date',
    disabled: true,
  },
}

export const WithInputMode: Story = {
  args: {
    placeholder: 'Tomorrow or next week',
    mode: 'input',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Input mode allows natural language date input like "tomorrow", "in 2 days", "next Monday"',
      },
    },
  },
}

export const DisabledDates: Story = {
  args: {
    placeholder: 'Pick a weekday',
    disabled: date => {
      const day = date.getDay()
      return day === 0 || day === 6 // Disable weekends
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Weekends are disabled in this example',
      },
    },
  },
}
