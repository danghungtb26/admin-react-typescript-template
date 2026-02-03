# Sorting & Filtering

Comprehensive guide for sorting and filtering data in TanStack Table.

## Sorting

### Basic Sorting Setup

```typescript
import { getSortedRowModel, SortingState } from '@tanstack/react-table'

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
  header: ({ column }) => {
    return (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded"
      >
        Name
        {column.getIsSorted() === 'asc' && '🔼'}
        {column.getIsSorted() === 'desc' && '🔽'}
        {!column.getIsSorted() && '⬍'}
      </button>
    )
  },
}
```

### Multi-Column Sorting

```typescript
const table = useReactTable({
  data,
  columns,
  state: { sorting },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  enableMultiSort: true,
  maxMultiSortColCount: 3,
})

// Header with multi-sort indicator
{
  header: ({ column }) => (
    <div className="flex items-center gap-2">
      <button onClick={() => column.toggleSorting()}>
        Name
        {column.getIsSorted() === 'asc' && '🔼'}
        {column.getIsSorted() === 'desc' && '🔽'}
      </button>
      {column.getSortIndex() >= 0 && (
        <span className="text-xs">{column.getSortIndex() + 1}</span>
      )}
    </div>
  ),
}
```

### Built-in Sort Functions

```typescript
{
  accessorKey: 'name',
  header: 'Name',
  sortingFn: 'alphanumeric',  // Default for strings
}

{
  accessorKey: 'age',
  header: 'Age',
  sortingFn: 'basic',  // Default for numbers
}

{
  accessorKey: 'createdAt',
  header: 'Created At',
  sortingFn: 'datetime',  // For date strings
}

{
  accessorKey: 'description',
  header: 'Description',
  sortingFn: 'text',  // Case-insensitive text
}
```

### Custom Sort Function

```typescript
{
  accessorKey: 'status',
  header: 'Status',
  sortingFn: (rowA, rowB, columnId) => {
    const statusOrder = ['pending', 'processing', 'completed', 'failed']
    const statusA = rowA.getValue(columnId) as string
    const statusB = rowB.getValue(columnId) as string
    
    return statusOrder.indexOf(statusA) - statusOrder.indexOf(statusB)
  },
}
```

### Global Sort Function

```typescript
const customSortFn: SortingFn<User> = (rowA, rowB, columnId) => {
  const valueA = rowA.getValue(columnId)
  const valueB = rowB.getValue(columnId)
  
  // Handle null/undefined
  if (valueA == null && valueB == null) return 0
  if (valueA == null) return 1
  if (valueB == null) return -1
  
  // Custom comparison
  return valueA > valueB ? 1 : valueA < valueB ? -1 : 0
}

const table = useReactTable({
  data,
  columns,
  sortingFns: {
    customSort: customSortFn,
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})

// Use in column
{
  accessorKey: 'customField',
  sortingFn: 'customSort',
}
```

### Sort Configuration

```typescript
{
  accessorKey: 'score',
  header: 'Score',
  sortDescFirst: true,          // Sort descending first
  sortUndefined: 'last',         // Push undefined to end
  invertSorting: true,           // Invert sort order (like golf scores)
  enableSorting: true,           // Enable/disable sorting
}
```

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

## Column Filtering

### Basic Filter Setup

```typescript
import { getFilteredRowModel, ColumnFiltersState } from '@tanstack/react-table'

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

### Text Filter

```typescript
{
  accessorKey: 'name',
  header: 'Name',
  cell: (info) => info.getValue(),
  filterFn: 'includesString',  // Case-insensitive substring match
}

// Filter input
function Filter({ column }: { column: Column<any> }) {
  return (
    <input
      value={(column.getFilterValue() ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Search..."
      className="w-full px-2 py-1 border rounded"
    />
  )
}
```

### Select Filter

```typescript
{
  accessorKey: 'status',
  header: 'Status',
  filterFn: 'equals',
}

// Filter select
function StatusFilter({ column }: { column: Column<any> }) {
  return (
    <select
      value={(column.getFilterValue() ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
    >
      <option value="">All</option>
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select>
  )
}
```

### Range Filter

```typescript
{
  accessorKey: 'age',
  header: 'Age',
  filterFn: 'inNumberRange',
}

// Range filter
function RangeFilter({ column }: { column: Column<any> }) {
  const [min, max] = (column.getFilterValue() ?? []) as [number, number]
  
  return (
    <div className="flex gap-2">
      <input
        type="number"
        value={min ?? ''}
        onChange={(e) => 
          column.setFilterValue([e.target.value, max])
        }
        placeholder="Min"
      />
      <input
        type="number"
        value={max ?? ''}
        onChange={(e) => 
          column.setFilterValue([min, e.target.value])
        }
        placeholder="Max"
      />
    </div>
  )
}
```

### Built-in Filter Functions

```typescript
// Exact match
filterFn: 'equals'

// Case-insensitive substring
filterFn: 'includesString'

// Case-sensitive substring
filterFn: 'includesStringSensitive'

// Exact string match
filterFn: 'equalsString'

// Array includes value
filterFn: 'arrIncludes'

// Array includes some values
filterFn: 'arrIncludesAll'

// Array includes all values
filterFn: 'arrIncludesSome'

// Between two numbers
filterFn: 'inNumberRange'

// Weak equality
filterFn: 'weakEquals'
```

### Custom Filter Function

```typescript
{
  accessorKey: 'tags',
  header: 'Tags',
  filterFn: (row, columnId, filterValue) => {
    const tags = row.getValue(columnId) as string[]
    const searchTags = filterValue as string[]
    
    return searchTags.every(tag => tags.includes(tag))
  },
}
```

## Global Filtering

### Setup Global Filter

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

### Global Filter Input

```typescript
function GlobalFilter({ table }: { table: Table<any> }) {
  const [value, setValue] = useState(table.getState().globalFilter ?? '')
  
  // Debounce filter
  useEffect(() => {
    const timeout = setTimeout(() => {
      table.setGlobalFilter(value)
    }, 300)
    
    return () => clearTimeout(timeout)
  }, [value, table])
  
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search all columns..."
      className="px-4 py-2 border rounded-lg w-full"
    />
  )
}
```

### Fuzzy Filter (with match-sorter)

```typescript
import { rankItem } from '@tanstack/match-sorter-utils'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  
  addMeta({ itemRank })
  
  return itemRank.passed
}

const table = useReactTable({
  data,
  columns,
  filterFns: {
    fuzzy: fuzzyFilter,
  },
  globalFilterFn: 'fuzzy',
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
})
```

## Faceted Filtering

### Get Unique Values

```typescript
import { getFacetedUniqueValues, getFacetedMinMaxValues } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
})

// Get unique values for a column
const uniqueStatuses = Array.from(
  table.getColumn('status')?.getFacetedUniqueValues()?.keys() ?? []
)

// Get min/max for numeric column
const [min, max] = table.getColumn('age')?.getFacetedMinMaxValues() ?? [0, 100]
```

### Faceted Select Filter

```typescript
function FacetedFilter({ column }: { column: Column<any> }) {
  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column]
  )
  
  return (
    <select
      value={(column.getFilterValue() ?? '') as string}
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
    >
      <option value="">All ({column.getFacetedUniqueValues().size})</option>
      {sortedUniqueValues.map(value => (
        <option key={value} value={value}>
          {value} ({column.getFacetedUniqueValues().get(value)})
        </option>
      ))}
    </select>
  )
}
```

## Server-Side Filtering

```typescript
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

const { data } = useQuery({
  queryKey: ['users', columnFilters],
  queryFn: () => fetchUsers({ 
    filters: columnFilters.reduce((acc, filter) => ({
      ...acc,
      [filter.id]: filter.value,
    }), {}),
  }),
})

const table = useReactTable({
  data: data?.users ?? [],
  columns,
  state: { columnFilters },
  onColumnFiltersChange: setColumnFilters,
  getCoreRowModel: getCoreRowModel(),
  manualFiltering: true,
})
```

## Best Practices

1. **Debounce inputs** - Prevent excessive re-renders
2. **Use appropriate filter functions** - Match data types
3. **Server-side for large datasets** - Better performance
4. **Clear filters** - Provide reset functionality
5. **Visual feedback** - Show active filters
6. **Preserve state** - Persist filters in URL/localStorage
7. **Type safety** - Use proper TypeScript types
