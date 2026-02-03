# Row Selection

Complete guide for implementing row selection in TanStack Table.

## Basic Row Selection

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
  enableRowSelection: true,  // Enable for all rows
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

### Indeterminate Checkbox Component

```typescript
function IndeterminateCheckbox({
  indeterminate,
  checked,
  onChange,
  disabled,
}: {
  indeterminate?: boolean
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false
    }
  }, [indeterminate])
  
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="cursor-pointer"
    />
  )
}

// Usage in column
{
  id: 'select',
  header: ({ table }) => (
    <IndeterminateCheckbox
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  ),
  cell: ({ row }) => (
    <IndeterminateCheckbox
      checked={row.getIsSelected()}
      onChange={row.getToggleSelectedHandler()}
      disabled={!row.getCanSelect()}
    />
  ),
}
```

## Conditional Row Selection

### Enable Selection Per Row

```typescript
const table = useReactTable({
  data,
  columns,
  state: { rowSelection },
  onRowSelectionChange: setRowSelection,
  getCoreRowModel: getCoreRowModel(),
  enableRowSelection: (row) => {
    // Only allow selection for active users
    return row.original.status === 'active'
  },
})
```

### Disable Specific Rows

```typescript
{
  id: 'select',
  cell: ({ row }) => {
    const canSelect = row.original.status !== 'archived'
    
    return (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        disabled={!canSelect}
        onChange={row.getToggleSelectedHandler()}
        title={canSelect ? '' : 'Archived items cannot be selected'}
      />
    )
  },
}
```

## Select All Variants

### Select All Rows

```typescript
// Select all rows (including filtered out)
<input
  type="checkbox"
  checked={table.getIsAllRowsSelected()}
  indeterminate={table.getIsSomeRowsSelected()}
  onChange={table.getToggleAllRowsSelectedHandler()}
/>
```

### Select All Page Rows

```typescript
// Select only rows on current page
<input
  type="checkbox"
  checked={table.getIsAllPageRowsSelected()}
  indeterminate={table.getIsSomePageRowsSelected()}
  onChange={table.getToggleAllPageRowsSelectedHandler()}
/>
```

### Custom Select All

```typescript
function SelectAllButton({ table }: { table: Table<any> }) {
  const selectedCount = table.getSelectedRowModel().rows.length
  const totalCount = table.getPreFilteredRowModel().rows.length
  
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => table.toggleAllRowsSelected()}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        {selectedCount === totalCount ? 'Deselect All' : 'Select All'}
      </button>
      <span className="text-sm text-gray-600">
        {selectedCount} of {totalCount} selected
      </span>
    </div>
  )
}
```

## Accessing Selected Rows

### Get Selected Data

```typescript
// Get selected row models
const selectedRows = table.getSelectedRowModel().rows

// Get original data from selected rows
const selectedData = selectedRows.map(row => row.original)

// Get selected IDs (assuming id field exists)
const selectedIds = selectedRows.map(row => row.original.id)

console.log('Selected users:', selectedData)
```

### Get Selection State

```typescript
// Raw selection state (object with row IDs as keys)
const selectionState = table.getState().rowSelection
// Example: { '0': true, '2': true, '5': true }

// Check if any rows are selected
const hasSelection = Object.keys(rowSelection).length > 0

// Get count
const selectedCount = table.getSelectedRowModel().rows.length
```

### Filtered Selection

```typescript
// Get selected rows from filtered results
const filteredSelectedRows = table.getFilteredSelectedRowModel().rows

// Get selected rows from current page
const pageSelectedRows = table
  .getRowModel()
  .rows.filter(row => row.getIsSelected())
```

## Bulk Actions

### Bulk Action Toolbar

```typescript
function BulkActionToolbar({ table }: { table: Table<User> }) {
  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length
  
  if (selectedCount === 0) return null
  
  const handleDelete = () => {
    const ids = selectedRows.map(row => row.original.id)
    // Call delete API
    deleteUsers(ids)
  }
  
  const handleExport = () => {
    const data = selectedRows.map(row => row.original)
    // Export logic
    exportToCSV(data)
  }
  
  const handleBulkEdit = () => {
    const ids = selectedRows.map(row => row.original.id)
    // Open bulk edit modal
    openBulkEditModal(ids)
  }
  
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-blue-50 border-b">
      <span className="font-medium">{selectedCount} items selected</span>
      
      <div className="flex gap-2">
        <button
          onClick={handleBulkEdit}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={handleExport}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Export
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
      
      <button
        onClick={() => table.resetRowSelection()}
        className="ml-auto text-sm text-gray-600 hover:text-gray-900"
      >
        Clear selection
      </button>
    </div>
  )
}
```

### Bulk Update Example

```typescript
function BulkUpdateButton({ table }: { table: Table<User> }) {
  const selectedRows = table.getSelectedRowModel().rows
  const updateMutation = useMutation({
    mutationFn: (updates: Array<{ id: string; data: Partial<User> }>) =>
      bulkUpdateUsers(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      table.resetRowSelection()
    },
  })
  
  const handleBulkStatusChange = (status: string) => {
    const updates = selectedRows.map(row => ({
      id: row.original.id,
      data: { status },
    }))
    updateMutation.mutate(updates)
  }
  
  return (
    <div className="flex gap-2">
      <button onClick={() => handleBulkStatusChange('active')}>
        Activate Selected
      </button>
      <button onClick={() => handleBulkStatusChange('inactive')}>
        Deactivate Selected
      </button>
    </div>
  )
}
```

## Selection Persistence

### Preserve Selection on Data Update

```typescript
const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

const table = useReactTable({
  data,
  columns,
  state: { rowSelection },
  onRowSelectionChange: setRowSelection,
  getCoreRowModel: getCoreRowModel(),
  enableRowSelection: true,
  getRowId: (row) => row.id,  // Use stable ID
})
```

### Clear Selection on Page Change

```typescript
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

useEffect(() => {
  // Clear selection when page changes
  setRowSelection({})
}, [pagination.pageIndex])
```

### Save Selection to Local Storage

```typescript
const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => {
  const saved = localStorage.getItem('tableSelection')
  return saved ? JSON.parse(saved) : {}
})

useEffect(() => {
  localStorage.setItem('tableSelection', JSON.stringify(rowSelection))
}, [rowSelection])
```

## Custom Selection UI

### Row Click Selection

```typescript
function SelectableRow({ row }: { row: Row<User> }) {
  return (
    <tr
      onClick={() => row.toggleSelected()}
      className={`
        cursor-pointer hover:bg-gray-50
        ${row.getIsSelected() ? 'bg-blue-50' : ''}
      `}
    >
      {row.getVisibleCells().map(cell => (
        <td key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}
```

### Shift+Click Range Selection

```typescript
function useRangeSelection<T>(table: Table<T>) {
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)
  
  const handleRowClick = (index: number, event: React.MouseEvent) => {
    if (event.shiftKey && lastSelectedIndex !== null) {
      // Select range
      const start = Math.min(lastSelectedIndex, index)
      const end = Math.max(lastSelectedIndex, index)
      
      const rowsToSelect = table
        .getRowModel()
        .rows.slice(start, end + 1)
        .reduce((acc, row) => ({ ...acc, [row.id]: true }), {})
      
      table.setRowSelection(rowsToSelect)
    } else {
      // Single selection
      table.getRow(String(index)).toggleSelected()
    }
    
    setLastSelectedIndex(index)
  }
  
  return { handleRowClick }
}
```

### Selection Badge

```typescript
function SelectionBadge({ table }: { table: Table<any> }) {
  const count = table.getSelectedRowModel().rows.length
  
  if (count === 0) return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
      <span>{count} items selected</span>
      <button
        onClick={() => table.resetRowSelection()}
        className="text-white hover:text-gray-200"
      >
        ✕
      </button>
    </div>
  )
}
```

## Best Practices

1. **Use stable row IDs** - Define `getRowId` for consistent selection
2. **Show selection count** - Display number of selected items
3. **Provide bulk actions** - Make selection useful
4. **Clear selection** - Provide easy way to deselect all
5. **Visual feedback** - Highlight selected rows
6. **Keyboard support** - Enable shift/ctrl+click selection
7. **Preserve selection** - Maintain selection across operations when appropriate
8. **Disable appropriately** - Clearly indicate why rows can't be selected
