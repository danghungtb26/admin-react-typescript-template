# Column Definitions

Advanced patterns for defining and configuring columns in TanStack Table.

## Column Definition Types

### AccessorKey

```typescript
{
  accessorKey: 'name',
  header: 'Name',
  cell: (info) => info.getValue(),
}
```

### AccessorFn

```typescript
{
  accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  id: 'fullName',
  header: 'Full Name',
}
```

### Display Columns

```typescript
{
  id: 'actions',
  header: 'Actions',
  cell: ({ row }) => (
    <div className="flex gap-2">
      <button onClick={() => handleEdit(row.original)}>Edit</button>
      <button onClick={() => handleDelete(row.original)}>Delete</button>
    </div>
  ),
}
```

## Cell Rendering

### Basic Cell

```typescript
{
  accessorKey: 'email',
  header: 'Email',
  cell: ({ getValue }) => {
    const email = getValue<string>()
    return <a href={`mailto:${email}`}>{email}</a>
  },
}
```

### Complex Cell with Context

```typescript
{
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row, getValue }) => {
    const status = getValue<string>()
    const user = row.original
    
    return (
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        {user.isPremium && <PremiumIcon />}
      </div>
    )
  },
}
```

### Editable Cell

```typescript
{
  accessorKey: 'name',
  header: 'Name',
  cell: ({ row, column, getValue }) => {
    const [value, setValue] = useState(getValue())
    
    const onBlur = () => {
      updateData(row.index, column.id, value)
    }
    
    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    )
  },
}
```

## Header Components

### Simple Header

```typescript
{
  accessorKey: 'name',
  header: 'User Name',
}
```

### Functional Header

```typescript
{
  accessorKey: 'name',
  header: ({ column }) => (
    <div className="flex items-center gap-2">
      <span>Name</span>
      <button onClick={() => column.toggleSorting()}>
        {column.getIsSorted() === 'asc' && '🔼'}
        {column.getIsSorted() === 'desc' && '🔽'}
      </button>
    </div>
  ),
}
```

### Header with Filter

```typescript
{
  accessorKey: 'email',
  header: ({ column }) => (
    <div>
      <div>Email</div>
      <input
        type="text"
        value={(column.getFilterValue() ?? '') as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder="Filter emails..."
      />
    </div>
  ),
}
```

## Footer Components

```typescript
{
  accessorKey: 'amount',
  header: 'Amount',
  footer: ({ table }) => {
    const total = table
      .getFilteredRowModel()
      .rows.reduce((sum, row) => sum + row.getValue('amount'), 0)
    
    return <div>Total: ${total.toFixed(2)}</div>
  },
}
```

## Column Grouping

```typescript
const columns: ColumnDef<User>[] = [
  {
    id: 'personal',
    header: 'Personal Info',
    columns: [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
    ],
  },
  {
    id: 'contact',
    header: 'Contact',
    columns: [
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'phone',
        header: 'Phone',
      },
    ],
  },
]
```

## Column Sizing

### Fixed Width

```typescript
{
  accessorKey: 'id',
  header: 'ID',
  size: 50,
  minSize: 50,
  maxSize: 50,
}
```

### Flexible Width

```typescript
{
  accessorKey: 'description',
  header: 'Description',
  size: 300,
  minSize: 200,
  maxSize: 500,
}
```

### Resizable Columns

```typescript
import { useReactTable, getColumnResizingRowModel } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  columnResizeMode: 'onChange',
  getCoreRowModel: getCoreRowModel(),
  getColumnResizingRowModel: getColumnResizingRowModel(),
})

// In header
<th
  key={header.id}
  style={{ width: header.getSize() }}
>
  {/* Header content */}
  <div
    onMouseDown={header.getResizeHandler()}
    onTouchStart={header.getResizeHandler()}
    className="resizer"
  />
</th>
```

## Column Meta

### Custom Column Properties

```typescript
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    align?: 'left' | 'center' | 'right'
    className?: string
    tooltip?: string
  }
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'amount',
    header: 'Amount',
    meta: {
      align: 'right',
      className: 'font-mono',
      tooltip: 'Total amount in USD',
    },
    cell: ({ getValue, column }) => (
      <div
        className={column.columnDef.meta?.className}
        style={{ textAlign: column.columnDef.meta?.align }}
        title={column.columnDef.meta?.tooltip}
      >
        ${getValue<number>().toFixed(2)}
      </div>
    ),
  },
]
```

## Column Ordering

```typescript
const [columnOrder, setColumnOrder] = useState<string[]>([])

const table = useReactTable({
  data,
  columns,
  state: {
    columnOrder,
  },
  onColumnOrderChange: setColumnOrder,
  getCoreRowModel: getCoreRowModel(),
})

// Reorder columns
const moveColumn = (from: number, to: number) => {
  setColumnOrder((old) => {
    const newOrder = [...old]
    const [removed] = newOrder.splice(from, 1)
    newOrder.splice(to, 0, removed)
    return newOrder
  })
}
```

## Column Pinning

```typescript
const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
  left: ['select', 'name'],
  right: ['actions'],
})

const table = useReactTable({
  data,
  columns,
  state: {
    columnPinning,
  },
  onColumnPinningChange: setColumnPinning,
  getCoreRowModel: getCoreRowModel(),
})
```

## Conditional Columns

```typescript
const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  // Show admin column only for admins
  ...(isAdmin ? [{
    accessorKey: 'internalId',
    header: 'Internal ID',
  }] : []),
  {
    accessorKey: 'email',
    header: 'Email',
  },
]
```

## Column Visibility Control

```typescript
{
  accessorKey: 'email',
  header: 'Email',
  enableHiding: true,  // Allow hiding this column
}

{
  accessorKey: 'id',
  header: 'ID',
  enableHiding: false,  // Always show this column
}
```

## Best Practices

1. **Memoize columns** - Use `useMemo` to prevent re-creation
2. **Type safety** - Define proper TypeScript types
3. **Keep cells simple** - Extract complex logic to separate components
4. **Use meta** for column-specific config
5. **Consistent sizing** - Define size constraints
6. **Accessibility** - Add proper ARIA labels
7. **Performance** - Avoid heavy computations in cell renderers
