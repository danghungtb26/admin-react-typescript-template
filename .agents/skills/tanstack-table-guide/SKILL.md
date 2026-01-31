---
name: tanstack-table-guide
description: Guide for using TanStack Table for building powerful data tables with sorting, filtering, pagination, and row selection. Use when implementing data tables, grids, or any tabular data display. Apply when the user asks about TanStack Table, data tables, table sorting, filtering, pagination, or row selection.
keywords: tanstack-table, data-table, table, sorting, filtering, pagination, row-selection, useReactTable, columns
---

# TanStack Table Guide

## Overview

TanStack Table is a headless UI library for building powerful, flexible, and performant data tables and datagrids. It provides the table logic without enforcing any UI, making it perfect for custom designs.

## Key Features

- 🎨 **Headless** - No UI, full control over markup and styling
- ⚡ **High Performance** - Handles large datasets efficiently
- 🔧 **Highly Flexible** - Extensive plugin system
- 📦 **Type-Safe** - Full TypeScript support
- 🎯 **Framework Agnostic** - Works with React, Vue, Solid, etc.

## Basic Setup

### Installation

```bash
pnpm add @tanstack/react-table
```

### Basic Table

```typescript
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// Define your data type
interface User {
  id: string
  name: string
  email: string
  age: number
}

// Define columns
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
    accessorKey: 'age',
    header: 'Age',
  },
]

function UsersTable() {
  const [data, setData] = useState<User[]>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext()
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## Column Definitions

### Accessor Types

```typescript
const columns: ColumnDef<User>[] = [
  // Simple accessor key
  {
    accessorKey: 'name',
    header: 'Name',
  },
  
  // Accessor function for computed values
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: 'Full Name',
  },
  
  // Custom cell rendering
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<string>()
      return (
        <span className={status === 'active' ? 'text-green-500' : 'text-red-500'}>
          {status}
        </span>
      )
    },
  },
]
```

### Header Components

```typescript
{
  accessorKey: 'name',
  header: ({ column }) => (
    <div className="flex items-center gap-2">
      Name
      {column.getIsSorted() && (
        <span>{column.getIsSorted() === 'asc' ? '🔼' : '🔽'}</span>
      )}
    </div>
  ),
}
```

## Sorting

### Enable Sorting

```typescript
import { getSortedRowModel } from '@tanstack/react-table'

const [sorting, setSorting] = useState<SortingState>([])

const table = useReactTable({
  data,
  columns,
  state: {
    sorting,
  },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### Sortable Column Header

```typescript
{
  accessorKey: 'name',
  header: ({ column }) => (
    <button
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className="flex items-center gap-2"
    >
      Name
      {column.getIsSorted() === 'asc' && '🔼'}
      {column.getIsSorted() === 'desc' && '🔽'}
    </button>
  ),
}
```

### Custom Sort Function

```typescript
{
  accessorKey: 'status',
  header: 'Status',
  sortingFn: (rowA, rowB, columnId) => {
    const statusOrder = ['pending', 'active', 'completed']
    const statusA = rowA.getValue(columnId)
    const statusB = rowB.getValue(columnId)
    return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
  },
}
```

## Filtering

### Column Filters

```typescript
import { getFilteredRowModel } from '@tanstack/react-table'

const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

const table = useReactTable({
  data,
  columns,
  state: {
    columnFilters,
  },
  onColumnFiltersChange: setColumnFilters,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
```

### Filter Input

```typescript
function Filter({ column }: { column: Column<any> }) {
  const columnFilterValue = column.getFilterValue()

  return (
    <input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-full border rounded px-2 py-1"
    />
  )
}
```

### Global Filter

```typescript
const [globalFilter, setGlobalFilter] = useState('')

const table = useReactTable({
  data,
  columns,
  state: {
    globalFilter,
  },
  onGlobalFilterChange: setGlobalFilter,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  globalFilterFn: 'includesString',
})
```

### Custom Filter Function

```typescript
{
  accessorKey: 'age',
  header: 'Age',
  filterFn: (row, columnId, filterValue) => {
    const age = row.getValue(columnId) as number
    const [min, max] = filterValue as [number, number]
    return age >= min && age <= max
  },
}
```

## Pagination

### Enable Pagination

```typescript
import { getPaginationRowModel } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
      pageSize: 10,
    },
  },
})
```

### Pagination Controls

```typescript
function PaginationControls({ table }: { table: Table<any> }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => table.firstPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<<'}
      </button>
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      
      <span>
        Page {table.getState().pagination.pageIndex + 1} of{' '}
        {table.getPageCount()}
      </span>
      
      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <button
        onClick={() => table.lastPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>>'}
      </button>
      
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  )
}
```

### Server-Side Pagination

```typescript
const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 10,
})

const { data, isLoading } = useQuery({
  queryKey: ['users', pagination],
  queryFn: () => fetchUsers(pagination),
})

const table = useReactTable({
  data: data?.users ?? [],
  columns,
  pageCount: data?.pageCount ?? -1,
  state: {
    pagination,
  },
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
})
```

## Row Selection

### Enable Row Selection

```typescript
const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

const table = useReactTable({
  data,
  columns,
  state: {
    rowSelection,
  },
  onRowSelectionChange: setRowSelection,
  getCoreRowModel: getCoreRowModel(),
  enableRowSelection: true,
})
```

### Selection Column

```typescript
const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  // ... other columns
]
```

### Get Selected Rows

```typescript
const selectedRows = table.getSelectedRowModel().rows
const selectedData = selectedRows.map(row => row.original)

console.log('Selected:', selectedData)
```

## Column Visibility

### Manage Visibility

```typescript
const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

const table = useReactTable({
  data,
  columns,
  state: {
    columnVisibility,
  },
  onColumnVisibilityChange: setColumnVisibility,
  getCoreRowModel: getCoreRowModel(),
})
```

### Toggle Visibility UI

```typescript
function ColumnVisibilityMenu({ table }: { table: Table<any> }) {
  return (
    <div>
      {table.getAllColumns().map(column => (
        <label key={column.id} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={column.getIsVisible()}
            disabled={!column.getCanHide()}
            onChange={column.getToggleVisibilityHandler()}
          />
          {column.columnDef.header}
        </label>
      ))}
    </div>
  )
}
```

## Best Practices

1. **Use TypeScript** - Define clear types for data and columns
2. **Memoize columns** - Use `useMemo` to prevent unnecessary re-renders
3. **Server-side operations** - For large datasets, handle sorting/filtering/pagination on the server
4. **Controlled state** - Hoist state for easy access and integration with other features
5. **Custom components** - Create reusable cell/header components
6. **Performance** - Use virtualization for very large tables (see TanStack Virtual)

For detailed patterns and advanced features, see:
- [Column Definitions](references/columns.md) - Advanced column configuration
- [Sorting & Filtering](references/sorting-filtering.md) - Advanced sorting and filtering patterns
- [Pagination](references/pagination.md) - Server-side and client-side pagination
- [Row Selection](references/row-selection.md) - Selection patterns and bulk actions
