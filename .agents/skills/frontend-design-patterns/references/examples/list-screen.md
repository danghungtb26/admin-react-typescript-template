# List/Table Screen Example

Complete implementation of a user management screen with filters, table, and pagination.

## Structure

```
┌────────────────────────────────┐
│ Header + Actions               │
├────────────────────────────────┤
│ Filters                        │
├────────────────────────────────┤
│ Table                          │
├────────────────────────────────┤
│ Pagination                     │
└────────────────────────────────┘
```

## Component Breakdown

```typescript
function UsersPage() {
  const [filters, setFilters] = useState({})
  const { data } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters)
  })
  
  return (
    <>
      <PageHeader title="Users" actions={<Button>+ Add</Button>} />
      <UserFilters filters={filters} onChange={setFilters} />
      <UserTable data={data} />
    </>
  )
}
```

## Complete Example

```typescript
// pages/UsersPage.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { PageHeader } from '@/components/atoms/page-header'
import { Button } from '@/components/atoms/button'
import { UserFilters } from './components/user-filters'
import { UserTable } from './components/user-table'
import { fetchUsers } from '@/apis/user/cores/get-users'

interface UserFilters {
  search?: string
  role?: string
  status?: string
  page?: number
  pageSize?: number
}

export function UsersPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/users' })
  
  // Initialize filters from URL
  const [filters, setFilters] = useState<UserFilters>({
    search: search.search || '',
    role: search.role || '',
    status: search.status || '',
    page: search.page || 1,
    pageSize: search.pageSize || 10,
  })
  
  // Fetch users based on filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => fetchUsers(filters),
  })
  
  // Update filters and URL
  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 } // Reset to page 1
    setFilters(updatedFilters)
    navigate({
      search: updatedFilters,
      replace: true,
    })
  }
  
  // Handle pagination
  const handlePageChange = (page: number, pageSize: number) => {
    const updatedFilters = { ...filters, page, pageSize }
    setFilters(updatedFilters)
    navigate({
      search: updatedFilters,
      replace: true,
    })
  }
  
  return (
    <div className="p-6">
      <PageHeader
        title="User Management"
        breadcrumb={['Admin', 'Users']}
        actions={
          <Button onClick={() => navigate({ to: '/users/create' })}>
            + Add User
          </Button>
        }
      />
      
      <div className="mt-6 space-y-4">
        <UserFilters
          filters={filters}
          onChange={handleFilterChange}
        />
        
        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <ErrorState error={error} />
        ) : (
          <>
            <UserTable
              data={data?.items || []}
              onEdit={(user) => navigate({ to: `/users/${user.id}/edit` })}
              onDelete={(user) => handleDelete(user.id)}
            />
            
            <Pagination
              current={filters.page}
              pageSize={filters.pageSize}
              total={data?.total || 0}
              onChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  )
}

// components/user-filters.tsx
interface UserFiltersProps {
  filters: UserFilters
  onChange: (filters: Partial<UserFilters>) => void
}

export function UserFilters({ filters, onChange }: UserFiltersProps) {
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  })
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search by name or email..."
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={filters.role}
            onChange={(e) => onChange({ role: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">All Roles</option>
            {roles?.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ status: e.target.value })}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => onChange({ search: '', role: '', status: '' })}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

// components/user-table.tsx
interface UserTableProps {
  data: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UserTable({ data, onEdit, onDelete }: UserTableProps) {
  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.original.avatar} />
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ getValue }) => <Badge>{getValue()}</Badge>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }) => <StatusBadge status={getValue()} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ getValue }) => formatDate(getValue()),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onEdit(row.original)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No users found
        </div>
      )}
    </div>
  )
}
```

## Key Features

1. **URL Synchronization**
   - Filters stored in URL for shareability
   - Deep linking support

2. **Server-side Operations**
   - Filtering handled by API
   - Pagination handled by API
   - Optimizes performance for large datasets

3. **Loading States**
   - Skeleton during initial load
   - Error state for failures

4. **User Actions**
   - Create new user
   - Edit existing user
   - Delete user
   - Reset filters

5. **Responsive Design**
   - Mobile-friendly filter layout
   - Table scrolls horizontally on small screens

## Related Patterns

- [Filter Patterns](../filter-patterns.md) - More filter input types
- [Table Patterns](../table-patterns.md) - Advanced table features
- [Data Flow](../data-flow.md) - State management strategies
