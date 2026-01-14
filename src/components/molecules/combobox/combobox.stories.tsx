import { useState } from 'react'

import { Combobox, ComboboxOption } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Combobox> = {
  title: 'Molecules/Combobox',
  component: Combobox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    clearable: {
      control: 'boolean',
      description: 'Allow clearing selection by clicking selected item',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
  decorators: [
    Story => {
      const [value, setValue] = useState<string>('')
      return (
        <div className="w-100">
          <Story args={{ value, onValueChange: setValue }} />
        </div>
      )
    },
  ],
}

export default meta
type Story = StoryObj<typeof Combobox>

const simpleOptions: ComboboxOption[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
  { value: '4', label: 'Option 4' },
  { value: '5', label: 'Option 5' },
]

const optionsWithDescription: ComboboxOption[] = [
  {
    value: 'react',
    label: 'React',
    description: 'A JavaScript library for building user interfaces',
  },
  { value: 'vue', label: 'Vue', description: 'The Progressive JavaScript Framework' },
  {
    value: 'angular',
    label: 'Angular',
    description: 'Platform for building mobile and desktop web applications',
  },
  { value: 'svelte', label: 'Svelte', description: 'Cybernetically enhanced web apps' },
  {
    value: 'solid',
    label: 'Solid',
    description: 'Simple and performant reactivity for building user interfaces',
  },
]

const manyOptions: ComboboxOption[] = Array.from({ length: 50 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
  description: `Description for option ${i + 1}`,
}))

export const Default: Story = {
  args: {
    options: simpleOptions,
    placeholder: 'Select an option...',
    searchPlaceholder: 'Search options...',
    searchable: true,
  },
}

export const WithDescriptions: Story = {
  args: {
    options: optionsWithDescription,
    placeholder: 'Select a framework...',
    searchPlaceholder: 'Search frameworks...',
    searchable: true,
  },
}

export const WithValue: Story = {
  args: {
    options: optionsWithDescription,
    value: 'react',
    placeholder: 'Select a framework...',
    searchable: true,
  },
}

export const WithoutSearch: Story = {
  args: {
    options: simpleOptions,
    searchable: false,
    placeholder: 'Select an option...',
  },
}

export const NotClearable: Story = {
  args: {
    options: simpleOptions,
    clearable: false,
    placeholder: 'Select an option...',
    searchable: true,
  },
}

export const ManyOptions: Story = {
  args: {
    options: manyOptions,
    placeholder: 'Select from many options...',
    searchPlaceholder: 'Search options...',
    searchable: true,
  },
}

export const Disabled: Story = {
  args: {
    options: simpleOptions,
    value: '2',
    disabled: true,
    placeholder: 'Select an option...',
    searchable: true,
  },
}

export const Loading: Story = {
  args: {
    options: simpleOptions,
    loading: true,
    placeholder: 'Loading...',
    searchable: true,
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('react')

    return (
      <div className="flex flex-col gap-4 w-100">
        <Combobox
          options={optionsWithDescription}
          value={value}
          onValueChange={setValue}
          placeholder="Select a framework..."
          searchPlaceholder="Search frameworks..."
          searchable
        />
        <div className="text-sm text-muted-foreground">
          Selected: <span className="font-mono">{value || '(none)'}</span>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            onClick={() => setValue('vue')}
          >
            Set Vue
          </button>
          <button
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
            onClick={() => setValue('angular')}
          >
            Set Angular
          </button>
          <button
            className="rounded-md bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
            onClick={() => setValue('')}
          >
            Clear
          </button>
        </div>
      </div>
    )
  },
}
