import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { CategorySelect } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const meta: Meta<typeof CategorySelect> = {
  title: 'Molecules/Selectors/CategorySelect',
  component: CategorySelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
  decorators: [
    Story => {
      const [value, setValue] = useState<string | undefined>()
      return (
        <QueryClientProvider client={queryClient}>
          <div className="w-100">
            <Story args={{ value, onChange: setValue }} />
          </div>
        </QueryClientProvider>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof CategorySelect>

export const Default: Story = {
  args: {
    searchable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Default category select with search enabled',
      },
    },
  },
}

export const WithValue: Story = {
  args: {
    value: '2',
    searchable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Category select with pre-selected value',
      },
    },
  },
}

export const WithoutSearch: Story = {
  args: {
    searchable: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Category select without search functionality',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    value: '5',
    disabled: true,
    searchable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled category select',
      },
    },
  },
}

export const CustomPlaceholder: Story = {
  args: {
    placeholder: 'Choose a category',
    searchable: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Category select with custom placeholder',
      },
    },
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>('1')

    return (
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col gap-4 w-100">
          <CategorySelect value={value} onChange={setValue} searchable />
          <div className="text-sm text-muted-foreground">
            Selected ID: <span className="font-mono">{value || '(none)'}</span>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
              onClick={() => setValue('1')}
            >
              Electronics
            </button>
            <button
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
              onClick={() => setValue('5')}
            >
              Sports
            </button>
            <button
              className="rounded-md bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
              onClick={() => setValue(undefined)}
            >
              Clear
            </button>
          </div>
        </div>
      </QueryClientProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Controlled category select with buttons',
      },
    },
  },
}
