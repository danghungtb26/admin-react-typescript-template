# Table Patterns

Guide for implementing advanced data tables with TanStack Table.

## Overview

Tables display collections of data with features like:
- Various column types (text, badge, actions, etc.)
- Server-side sorting and pagination
- Row selection for bulk operations
- Loading and empty states

**➡️ For complete implementation, see [List Screen Example](examples/list-screen.md)**

## Column Types Quick Reference

| Column Type | Use Case | Implementation |
|------------|----------|----------------|
| Text | Simple data display | `accessorKey` only |
| Badge | Status/category | Custom `cell` with Badge component |
| Avatar | User profile images | Avatar + name/email in cell |
| Date | Timestamps | Format date in `cell` renderer |
| Number | Formatted values | Format with currency/units |
| Actions | Row operations | Button group with onClick handlers |
| Dropdown Actions | Multiple actions | Dropdown menu in cell |

## Column Type Patterns

### Text Column

```typescript
{
  accessorKey: 'name',
  header: 'Name',
}
```

### Badge Column

```typescript
{
  accessorKey: 'status',
  header: 'Status',
  cell: ({ getValue }) => {
    const status = getValue<string>()
    const colorMap = {
      active: 'green',
      inactive: 'gray',
      pending: 'yellow',
    }
    return <Badge color={colorMap[status]}>{status}</Badge>
  },
}
```

### Avatar + Name Column

```typescript
{
  accessorKey: 'user',
  header: 'User',
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <Avatar src={row.original.avatar} size="sm" />
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-sm text-gray-500">{row.original.email}</div>
      </div>
    </div>
  ),
}
```

### Date Column

```typescript
{
  accessorKey: 'createdAt',
  header: 'Created',
  cell: ({ getValue }) => format(new Date(getValue<string>()), 'MMM dd, yyyy'),
}
```

### Number Column (Formatted)

```typescript
{
  accessorKey: 'amount',
  header: 'Amount',
  cell: ({ getValue }) => `$${getValue<number>().toFixed(2)}`,
  meta: { align: 'right' },
}
```

### Actions Column

```typescript
{
  id: 'actions',
  header: 'Actions',
  cell: ({ row }) => (
    <div className="flex gap-2">
      <button onClick={() => handleView(row.original)}>
        <EyeIcon />
      </button>
      <button onClick={() => handleEdit(row.original)}>
        <EditIcon />
      </button>
      <button onClick={() => handleDelete(row.original.id)}>
        <DeleteIcon />
      </button>
    </div>
  ),
}
```

### Dropdown Actions

```typescript
{
  id: 'actions',
  cell: ({ row }) => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreVerticalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleEdit(row.original)}>
          <EditIcon /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDuplicate(row.original)}>
          <CopyIcon /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDelete(row.original.id)} className="text-red-500">
          <TrashIcon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
```

## Sorting Patterns

### Server-Side Sorting

```typescript
const [sorting, setSorting] = useState<SortingState>([])

const { data } = useQuery({
  queryKey: ['users', sorting],
  queryFn: () => fetchUsers({
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  }),
})

const table = useReactTable({
  data: data?.users ?? [],
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  manualSorting: true,
})
```

### Sortable Header

```typescript
{
  accessorKey: 'name',
  header: ({ column }) => (
    <button
      onClick={() => column.toggleSorting()}
      className="flex items-center gap-2"
    >
      Name
      {{
        asc: <ArrowUpIcon />,
        desc: <ArrowDownIcon />,
      }[column.getIsSorted() as string] ?? <ArrowUpDownIcon />}
    </button>
  ),
}
```

## Pagination Patterns

### Server-Side Pagination

```typescript
const [pagination, setPagination] = useState({
  pageIndex: 0,
  pageSize: 10,
})

const { data, isLoading } = useQuery({
  queryKey: ['users', pagination],
  queryFn: () => fetchUsers({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  }),
})

const table = useReactTable({
  data: data?.users ?? [],
  columns,
  pageCount: data?.pageCount ?? -1,
  state: { pagination },
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
})
```

### Pagination Controls

```typescript
<div className="flex items-center justify-between">
  <div className="text-sm text-gray-700">
    Showing {pagination.pageIndex * pagination.pageSize + 1} to{' '}
    {Math.min((pagination.pageIndex + 1) * pagination.pageSize, data?.total ?? 0)} of{' '}
    {data?.total ?? 0} results
  </div>
  
  <div className="flex gap-2">
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
      Page {pagination.pageIndex + 1} of {table.getPageCount()}
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
  </div>
  
  <select
    value={pagination.pageSize}
    onChange={(e) => table.setPageSize(Number(e.target.value))}
  >
    {[10, 20, 30, 50].map(size => (
      <option key={size} value={size}>Show {size}</option>
    ))}
  </select>
</div>
```

## Row Selection Patterns

### Basic Selection

```typescript
const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

const table = useReactTable({
  data,
  columns: [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    ...columns,
  ],
  state: { rowSelection },
  onRowSelectionChange: setRowSelection,
  enableRowSelection: true,
})
```

### Bulk Actions

```typescript
const selectedRows = table.getSelectedRowModel().rows

{selectedRows.length > 0 && (
  <div className="flex items-center gap-4 bg-blue-50 p-4">
    <span>{selectedRows.length} items selected</span>
    <button onClick={handleBulkDelete}>Delete</button>
    <button onClick={handleBulkExport}>Export</button>
    <button onClick={handleBulkUpdate}>Update Status</button>
  </div>
)}
```

## Loading States

### Skeleton Loader

```typescript
if (isLoading) {
  return (
    <table>
      <thead>{/* Headers */}</thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, i) => (
          <tr key={i}>
            {columns.map((col, j) => (
              <td key={j}>
                <div className="h-4 bg-gray-200 animate-pulse rounded" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

### Empty State

```typescript
if (!data?.users.length) {
  return (
    <div className="text-center py-12">
      <EmptyIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium">No users found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your filters or create a new user.
      </p>
      <button onClick={handleCreate} className="mt-4">
        Create User
      </button>
    </div>
  )
}
```

## Best Practices

1. **Always show loading states**
2. **Provide empty states with actions**
3. **Use server-side for large datasets**
4. **Make actions clearly visible**
5. **Support keyboard navigation**
6. **Show total count**
7. **Persist sorting/pagination in URL**
