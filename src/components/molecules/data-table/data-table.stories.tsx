import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/atoms/badge'
import { Checkbox } from '@/components/atoms/checkbox'
import Avatar from '@/components/molecules/avatar'

import { DataTable } from './index'

import type { Meta, StoryObj } from '@storybook/react'

type User = {
  id: string
  name: string
  email: string
  status: 'Active' | 'Inactive'
  role: string
}

const meta = {
  title: 'Molecules/DataTable',
  component: DataTable<User, unknown>,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTable<User, unknown>>

export default meta
type Story = StoryObj<typeof meta>

const sampleData: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Active', role: 'User' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', role: 'User' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', status: 'Active', role: 'Manager' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', status: 'Active', role: 'User' },
  {
    id: '6',
    name: 'Diana Martinez',
    email: 'diana@example.com',
    status: 'Inactive',
    role: 'User',
  },
  { id: '7', name: 'Eve Davis', email: 'eve@example.com', status: 'Active', role: 'Admin' },
  {
    id: '8',
    name: 'Frank Miller',
    email: 'frank@example.com',
    status: 'Active',
    role: 'Manager',
  },
  { id: '9', name: 'Grace Lee', email: 'grace@example.com', status: 'Inactive', role: 'User' },
  { id: '10', name: 'Henry Taylor', email: 'henry@example.com', status: 'Active', role: 'User' },
]

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'Active' ? 'default' : 'secondary'}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
]

export const Default: Story = {
  args: {
    data: sampleData.slice(0, 5),
    columns,
  },
}

export const WithPagination: Story = {
  args: {
    data: sampleData,
    columns,
    showPagination: true,
  },
}

export const WithSelection: Story = {
  args: {
    data: sampleData,
    columns: [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ],
  },
}

export const WithAvatar: Story = {
  args: {
    data: sampleData,
    columns: [
      {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar fallback={row.original.name} size="sm" />
            <div>
              <div className="font-medium">{row.original.name}</div>
              <div className="text-sm text-muted-foreground">{row.original.email}</div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.original.status === 'Active' ? 'default' : 'secondary'}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'role',
        header: 'Role',
      },
    ],
  },
}

export const Loading: Story = {
  args: {
    data: sampleData,
    columns,
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    data: [],
    columns,
  },
}

export const CustomPageSizes: Story = {
  args: {
    data: sampleData,
    columns,
    pageSizeOptions: [5, 10, 15],
  },
}
