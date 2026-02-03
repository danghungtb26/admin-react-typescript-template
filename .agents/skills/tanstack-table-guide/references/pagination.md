# Pagination

Complete guide for implementing pagination in TanStack Table.

## Client-Side Pagination

### Basic Setup

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
      pageIndex: 0,
    },
  },
})
```

### Pagination State

```typescript
interface PaginationState {
  pageIndex: number  // Current page (0-indexed)
  pageSize: number   // Rows per page
}

const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const table = useReactTable({
  data,
  columns,
  state: {
    pagination,
  },
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})
```

## Pagination Controls

### Full Controls Component

```typescript
function PaginationControls({ table }: { table: Table<any> }) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Page info */}
      <div className="text-sm text-gray-700">
        Showing{' '}
        <span className="font-medium">
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
        </span>
        {' '}-{' '}
        <span className="font-medium">
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getPrePaginationRowModel().rows.length
          )}
        </span>
        {' '}of{' '}
        <span className="font-medium">
          {table.getPrePaginationRowModel().rows.length}
        </span>
        {' '}results
      </div>
      
      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          {'<<'}
        </button>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          {'<'}
        </button>
        
        <span className="flex items-center gap-2">
          Page
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          {'>'}
        </button>
        <button
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          {'>>'}
        </button>
      </div>
      
      {/* Page size selector */}
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
        className="px-2 py-1 border rounded"
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

### Go To Page Input

```typescript
function GoToPageInput({ table }: { table: Table<any> }) {
  const [pageInput, setPageInput] = useState(
    table.getState().pagination.pageIndex + 1
  )
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const page = pageInput ? Number(pageInput) - 1 : 0
    table.setPageIndex(page)
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label htmlFor="page-input">Go to page:</label>
      <input
        id="page-input"
        type="number"
        min="1"
        max={table.getPageCount()}
        value={pageInput}
        onChange={(e) => setPageInput(Number(e.target.value))}
        className="w-16 px-2 py-1 border rounded"
      />
      <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded">
        Go
      </button>
    </form>
  )
}
```

### Page Numbers

```typescript
function PageNumbers({ table }: { table: Table<any> }) {
  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex
  
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7
    
    if (pageCount <= maxVisible) {
      // Show all pages
      for (let i = 0; i < pageCount; i++) {
        pages.push(i)
      }
    } else {
      // Show with ellipsis
      if (currentPage < 4) {
        for (let i = 0; i < 5; i++) pages.push(i)
        pages.push('...')
        pages.push(pageCount - 1)
      } else if (currentPage > pageCount - 5) {
        pages.push(0)
        pages.push('...')
        for (let i = pageCount - 5; i < pageCount; i++) pages.push(i)
      } else {
        pages.push(0)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i)
        pages.push('...')
        pages.push(pageCount - 1)
      }
    }
    
    return pages
  }
  
  return (
    <div className="flex items-center gap-1">
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2">...</span>
        ) : (
          <button
            key={page}
            onClick={() => table.setPageIndex(page as number)}
            className={`
              px-3 py-1 rounded
              ${currentPage === page 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
              }
            `}
          >
            {(page as number) + 1}
          </button>
        )
      ))}
    </div>
  )
}
```

## Server-Side Pagination

### Basic Setup

```typescript
const [pagination, setPagination] = useState<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

const { data, isLoading } = useQuery({
  queryKey: ['users', pagination],
  queryFn: () => fetchUsers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  }),
})

const table = useReactTable({
  data: data?.users ?? [],
  columns,
  pageCount: data?.pageCount ?? -1,  // Total pages from server
  state: {
    pagination,
  },
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,  // Disable client-side pagination
})
```

### With Total Row Count

```typescript
const { data } = useQuery({
  queryKey: ['users', pagination],
  queryFn: () => fetchUsers(pagination),
})

const table = useReactTable({
  data: data?.users ?? [],
  columns,
  rowCount: data?.totalRows,  // Total rows from server
  state: { pagination },
  onPaginationChange: setPagination,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
})

// Display total
<div>
  Total: {table.getRowCount()} items
</div>
```

### With Loading State

```typescript
function PaginatedTable() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['users', pagination],
    queryFn: () => fetchUsers(pagination),
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
  
  if (isLoading) return <div>Loading...</div>
  
  return (
    <div>
      <div className="relative">
        {isFetching && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <table>{/* Table content */}</table>
      </div>
      <PaginationControls table={table} />
    </div>
  )
}
```

## Combined with Filtering & Sorting

### Client-Side

```typescript
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
const [sorting, setSorting] = useState<SortingState>([])
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

const table = useReactTable({
  data,
  columns,
  state: {
    pagination,
    sorting,
    columnFilters,
  },
  onPaginationChange: setPagination,
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  autoResetPageIndex: true,  // Reset to first page on filter/sort
})
```

### Server-Side

```typescript
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
const [sorting, setSorting] = useState<SortingState>([])
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

const queryParams = useMemo(() => ({
  page: pagination.pageIndex + 1,
  limit: pagination.pageSize,
  sortBy: sorting[0]?.id,
  sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  filters: columnFilters.reduce((acc, filter) => ({
    ...acc,
    [filter.id]: filter.value,
  }), {}),
}), [pagination, sorting, columnFilters])

const { data } = useQuery({
  queryKey: ['users', queryParams],
  queryFn: () => fetchUsers(queryParams),
})

const table = useReactTable({
  data: data?.users ?? [],
  columns,
  pageCount: data?.pageCount ?? -1,
  state: {
    pagination,
    sorting,
    columnFilters,
  },
  onPaginationChange: setPagination,
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true,
  manualSorting: true,
  manualFiltering: true,
})
```

## URL Sync

### Sync Pagination to URL

```typescript
import { useSearchParams } from 'react-router-dom'

function PaginatedTable() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  const pagination = useMemo(() => ({
    pageIndex: Number(searchParams.get('page') ?? 0),
    pageSize: Number(searchParams.get('limit') ?? 10),
  }), [searchParams])
  
  const setPagination = useCallback((updater: Updater<PaginationState>) => {
    const newState = typeof updater === 'function' 
      ? updater(pagination) 
      : updater
    
    setSearchParams({
      page: String(newState.pageIndex),
      limit: String(newState.pageSize),
    })
  }, [pagination, setSearchParams])
  
  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  
  return <div>{/* Table */}</div>
}
```

## Infinite Scroll Alternative

```typescript
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

function InfiniteTable() {
  const { ref, inView } = useInView()
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 0 }) => fetchUsers({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length : undefined,
  })
  
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])
  
  const flatData = useMemo(
    () => data?.pages.flatMap(page => page.users) ?? [],
    [data]
  )
  
  const table = useReactTable({
    data: flatData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  
  return (
    <div>
      <table>{/* Table rows */}</table>
      <div ref={ref} className="h-10">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  )
}
```

## Best Practices

1. **Reset page on filter** - Use `autoResetPageIndex: true`
2. **Show total count** - Display total items/pages
3. **Disable buttons** - Disable prev/next when not available
4. **Loading states** - Show spinners during pagination
5. **URL sync** - Persist pagination in URL for sharing
6. **Mobile friendly** - Simplify controls on small screens
7. **Keyboard navigation** - Support arrow keys for page navigation
8. **Preserve state** - Remember page size preference
