import { Select } from './index'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Molecules/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
]

export const Default: Story = {
  args: {
    options: fruits,
    placeholder: 'Select a fruit',
  },
}

export const WithDefaultValue: Story = {
  args: {
    options: fruits,
    value: 'banana',
    placeholder: 'Select a fruit',
  },
}

export const CustomWidth: Story = {
  args: {
    options: fruits,
    placeholder: 'Select a fruit',
    className: 'w-[200px]',
  },
}

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'cn', label: 'China' },
]

export const ManyOptions: Story = {
  args: {
    options: countries,
    placeholder: 'Select a country',
    className: 'w-[250px]',
  },
}
