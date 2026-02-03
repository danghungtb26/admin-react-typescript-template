# Cache Management

Strategies for managing query cache in TanStack Query.

## Query Invalidation

### Invalidate All Matching Queries

```typescript
// Invalidate all todos queries
queryClient.invalidateQueries({ queryKey: ['todos'] })

// Also invalidates:
// ['todos']
// ['todos', 1]
// ['todos', 1, 'comments']
// ['todos', { status: 'active' }]
```

### Exact Match Invalidation

```typescript
// Only invalidate exact key
queryClient.invalidateQueries({
  queryKey: ['todos', { status: 'active' }],
  exact: true  // Only this exact query
})
```

### Refetch Options

```typescript
// Invalidate without refetching
queryClient.invalidateQueries({
  queryKey: ['todos'],
  refetchType: 'none'
})

// Only refetch active queries
queryClient.invalidateQueries({
  queryKey: ['todos'],
  refetchType: 'active'  // 'active' | 'inactive' | 'all' | 'none'
})
```

## Manual Cache Updates

### Set Query Data

```typescript
// Set data for a query
queryClient.setQueryData(['todo', 1], newTodo)

// Update function
queryClient.setQueryData(['todos'], (old: Todo[]) => {
  return old.map(todo =>
    todo.id === 1 ? { ...todo, completed: true } : todo
  )
})
```

### Get Query Data

```typescript
const todos = queryClient.getQueryData<Todo[]>(['todos'])

if (todos) {
  console.log('Cached todos:', todos)
}
```

### Remove Queries

```typescript
// Remove specific query
queryClient.removeQueries({ queryKey: ['todo', 1] })

// Remove all todos queries
queryClient.removeQueries({ queryKey: ['todos'] })
```

## Prefetching

### Basic Prefetch

```typescript
// Prefetch before navigation
const handleMouseEnter = async () => {
  await queryClient.prefetchQuery({
    queryKey: ['todo', todoId],
    queryFn: () => fetchTodo(todoId),
  })
}

return (
  <Link to={`/todos/${todoId}`} onMouseEnter={handleMouseEnter}>
    View Todo
  </Link>
)
```

### Prefetch with Stale Time

```typescript
await queryClient.prefetchQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 60 * 1000,  // Fresh for 1 minute
})
```

### Conditional Prefetch

```typescript
const prefetchTodo = async (todoId: string) => {
  // Only prefetch if not already in cache
  const cached = queryClient.getQueryData(['todo', todoId])
  
  if (!cached) {
    await queryClient.prefetchQuery({
      queryKey: ['todo', todoId],
      queryFn: () => fetchTodo(todoId),
    })
  }
}
```

## Cache Time (gcTime)

### Default Cache Time

```typescript
// Queries stay in cache for 5 minutes after becoming unused
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1000,  // 5 minutes (default)
    },
  },
})
```

### Per-Query Cache Time

```typescript
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  gcTime: 10 * 60 * 1000,  // Keep for 10 minutes
})
```

### Infinite Cache

```typescript
useQuery({
  queryKey: ['config'],
  queryFn: fetchConfig,
  gcTime: Infinity,  // Never garbage collect
})
```

## Stale Time

### Prevent Refetching

```typescript
useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 5 * 60 * 1000,  // Fresh for 5 minutes
})
```

### Always Fresh

```typescript
useQuery({
  queryKey: ['realtime'],
  queryFn: fetchRealtime,
  staleTime: 0,  // Always stale (default)
})
```

### Always Fresh Until Manual Invalidation

```typescript
useQuery({
  queryKey: ['settings'],
  queryFn: fetchSettings,
  staleTime: Infinity,  // Never becomes stale automatically
})
```

## Query Cancellation

### Cancel Outgoing Requests

```typescript
// Cancel all todos queries
await queryClient.cancelQueries({ queryKey: ['todos'] })

// Cancel specific query
await queryClient.cancelQueries({ queryKey: ['todo', 1] })
```

### In Optimistic Updates

```typescript
onMutate: async (newTodo) => {
  // Cancel any outgoing refetches
  await queryClient.cancelQueries({ queryKey: ['todos'] })
  
  // Optimistically update...
}
```

## Reset Queries

### Reset to Initial State

```typescript
// Reset specific query
queryClient.resetQueries({ queryKey: ['todo', 1] })

// Reset all queries
queryClient.resetQueries()
```

## Query Defaults

### Global Defaults

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})
```

### Query-Specific Defaults

```typescript
queryClient.setQueryDefaults(['todos'], {
  staleTime: 5 * 60 * 1000,
  gcTime: 10 * 60 * 1000,
})

// All todos queries will use these defaults
useQuery({ queryKey: ['todos'], queryFn: fetchTodos })
```

## Cache Persistence

### With localStorage

```typescript
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,  // 24 hours
    },
  },
})

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persister={persister}
    >
      {/* App */}
    </PersistQueryClientProvider>
  )
}
```

## Cache Inspection

### Get All Queries

```typescript
const queries = queryClient.getQueryCache().getAll()

queries.forEach(query => {
  console.log(query.queryKey, query.state)
})
```

### Query State

```typescript
const query = queryClient.getQueryState(['todo', 1])

if (query) {
  console.log('Status:', query.status)
  console.log('Data:', query.data)
  console.log('Error:', query.error)
  console.log('Updated at:', query.dataUpdatedAt)
}
```

## Cache Events

### Subscribe to Cache

```typescript
const unsubscribe = queryClient.getQueryCache().subscribe(event => {
  if (event.type === 'added') {
    console.log('Query added:', event.query.queryKey)
  }
  if (event.type === 'updated') {
    console.log('Query updated:', event.query.queryKey)
  }
  if (event.type === 'removed') {
    console.log('Query removed:', event.query.queryKey)
  }
})

// Cleanup
unsubscribe()
```

## Clear Cache

### Clear All

```typescript
queryClient.clear()
```

### Clear Specific

```typescript
queryClient.removeQueries({ queryKey: ['todos'] })
```

## Best Practices

1. **Set appropriate gcTime** - Balance memory vs refetch frequency
2. **Use staleTime wisely** - Reduce unnecessary refetches
3. **Invalidate related queries** after mutations
4. **Prefetch on user intent** (hover, route preload)
5. **Cancel queries** during optimistic updates
6. **Use query defaults** for consistency
7. **Persist cache** for offline support
8. **Monitor cache size** in production
9. **Clear cache** on logout/auth changes
10. **Use exact matches** when invalidating to avoid over-fetching
