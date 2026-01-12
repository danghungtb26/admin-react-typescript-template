import dayjs from 'dayjs'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

import { DateRangePicker } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof DateRangePicker> = {
  title: 'Molecules/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const [dateRange, setDateRange] = useState<DateRange | undefined>(context.args.value)

      return (
        <div className="w-full space-y-4">
          <Story args={{ ...context.args, value: dateRange, onChange: setDateRange }} />
          {dateRange?.from && (
            <p className="text-sm text-muted-foreground text-center">
              From: {dateRange.from.toLocaleDateString()}
              {dateRange.to && ` - To: ${dateRange.to.toLocaleDateString()}`}
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
    placeholder: 'Pick a date range',
    numberOfMonths: 2,
  },
}

export const WithDefaultValue: Story = {
  args: {
    value: {
      from: new Date(),
      to: dayjs().add(7, 'day').toDate(),
    },
    numberOfMonths: 2,
  },
}

export const SingleMonth: Story = {
  args: {
    placeholder: 'Pick a date range',
    numberOfMonths: 1,
  },
  parameters: {
    docs: {
      description: {
        story: 'Display only one month at a time',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Pick a date range',
    disabled: true,
    numberOfMonths: 2,
  },
}

export const WithInputMode: Story = {
  args: {
    placeholder: 'Jan 1 - Jan 7 or next week',
    mode: 'input',
    numberOfMonths: 2,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Input mode allows natural language date range input like "Jan 1 - Jan 7", "next week", "tomorrow - in 5 days"',
      },
    },
  },
}
