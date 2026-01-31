---
name: tanstack-query-guide
description: Guide for using TanStack Query (React Query) for server state management in React applications. Use when implementing data fetching, caching, mutations, optimistic updates, or managing server state. Apply when the user asks about TanStack Query, React Query, useQuery, useMutation, cache management, or data synchronization.
keywords: tanstack-query, react-query, useQuery, useMutation, data-fetching, cache, optimistic-update, query-client
---

# TanStack Query Guide

## Overview

TanStack Query (formerly React Query) is a powerful data synchronization library for managing server state, providing automatic caching, background updates, and optimistic UI updates.

## Setup

### QueryClient Configuration

```typescript
// src/lib/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,        // 1 minute
      gcTime: 5 * 60 * 1000,       // 5 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
    },
  },
})
```

### Provider Setup

```typescript
// src/main.tsx or src/app.tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app */}
    </QueryClientProvider>
  )
}
```

## useQuery Hook

### Basic Usage

```typescript
import { useQuery } from '@tanstack/react-query'

function TodoList() {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch('/api/todos')
      if (!response.ok) throw new Error('Failed to fetch')
      return response.json()
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

### Query with Parameters

```typescript
function TodoList({ filter }: { filter: string }) {
  const { data, status } = useQuery({
    queryKey: ['todos', { filter }],  // Include params in query key
    queryFn: async () => {
      const response = await fetch(`/api/todos?filter=${filter}`)
      return response.json()
    },
  })

  // ...
}
```

### Conditional Query

```typescript
function UserProfile({ userId }: { userId?: string }) {
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,  // Only run if userId exists
  })

  // ...
}
```

### Stale Time Configuration

```typescript
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  staleTime: 5 * 60 * 1000,  // Fresh for 5 minutes
  gcTime: 10 * 60 * 1000,    // Keep in cache for 10 minutes
})
```

## useMutation Hook

### Basic Mutation

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

function AddTodoForm() {
  const queryClient = useQueryClient()

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (newTodo: { title: string }) => {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      })
      if (!response.ok) throw new Error('Failed to add todo')
      return response.json()
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    mutate({ title })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="New todo" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Adding...' : 'Add'}
      </button>
      {isError && <p>Error: {error.message}</p>}
    </form>
  )
}
```

### Update Mutation

```typescript
const updateTodoMutation = useMutation({
  mutationFn: async ({ id, data }: { id: string; data: Partial<Todo> }) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  },
  onSuccess: (data, variables) => {
    // Invalidate specific todo and todos list
    queryClient.invalidateQueries({ queryKey: ['todos', variables.id] })
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})

// Usage
updateTodoMutation.mutate({ id: '123', data: { completed: true } })
```

### Delete Mutation

```typescript
const deleteTodoMutation = useMutation({
  mutationFn: async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Optimistic Updates

### Basic Optimistic Update

```typescript
const updateTodoMutation = useMutation({
  mutationFn: updateTodo,
  
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    
    // Snapshot previous value
    const previousTodos = queryClient.getQueryData(['todos'])
    
    // Optimistically update
    queryClient.setQueryData(['todos'], (old: Todo[]) =>
      old.map(todo =>
        todo.id === newTodo.id ? { ...todo, ...newTodo } : todo
      )
    )
    
    // Return rollback data
    return { previousTodos }
  },
  
  onError: (err, newTodo, context) => {
    // Rollback on error
    queryClient.setQueryData(['todos'], context?.previousTodos)
  },
  
  onSettled: () => {
    // Refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})
```

## Cache Management

### Invalidate Queries

```typescript
// Invalidate all todos queries
queryClient.invalidateQueries({ queryKey: ['todos'] })

// Invalidate specific todo
queryClient.invalidateQueries({ queryKey: ['todos', todoId] })

// Invalidate exact match only
queryClient.invalidateQueries({
  queryKey: ['todos', { filter: 'active' }],
  exact: true
})
```

### Prefetch Queries

```typescript
// Prefetch before navigation
const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ['todos', todoId],
    queryFn: () => fetchTodo(todoId),
  })
}

return (
  <Link to={`/todos/${todoId}`} onMouseEnter={handleMouseEnter}>
    View Todo
  </Link>
)
```

### Manual Cache Update

```typescript
// Set query data manually
queryClient.setQueryData(['todos', todoId], newTodo)

// Get query data
const todos = queryClient.getQueryData(['todos'])

// Remove query from cache
queryClient.removeQueries({ queryKey: ['todos', todoId] })
```

## Query Keys

### Structure

```typescript
// ✅ Good - Hierarchical structure
['users']                              // All users
['users', userId]                      // Specific user
['users', userId, 'posts']             // User's posts
['users', userId, 'posts', { page: 1 }] // With filters

// ❌ Bad - Flat structure
['user-123']
['user-123-posts']
```

### Best Practices

```typescript
// Use objects for complex params
['todos', { status: 'active', page: 1 }]

// Keep consistent order
['users', userId, 'posts', postId]  // ✅
['users', postId, 'posts', userId]  // ❌
```

## Status Management

### Query Status

```typescript
const { status, fetchStatus, data, error } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

// status: 'pending' | 'error' | 'success'
// fetchStatus: 'fetching' | 'paused' | 'idle'

if (status === 'pending') return <div>Loading...</div>
if (status === 'error') return <div>Error: {error.message}</div>
if (status === 'success') return <div>{data}</div>
```

### Helpful Booleans

```typescript
const {
  isLoading,        // pending + fetching
  isError,          // has error
  isSuccess,        // has data
  isFetching,       // currently fetching
  isRefetching,     // fetching while has data
  isPending,        // no data yet
} = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})
```

## Refetch Behavior

### Auto Refetch Options

```typescript
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  refetchOnWindowFocus: true,   // Refetch on window focus
  refetchOnReconnect: true,     // Refetch on reconnect
  refetchOnMount: true,         // Refetch on component mount
  refetchInterval: 30000,       // Poll every 30s
})
```

### Manual Refetch

```typescript
const { data, refetch } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

// Manual refetch
<button onClick={() => refetch()}>Refresh</button>
```

## Error Handling

### Query Error Handling

```typescript
const { data, error, isError } = useQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    const response = await fetch('/api/todos')
    if (!response.ok) {
      throw new Error('Failed to fetch todos')
    }
    return response.json()
  },
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
})

if (isError) {
  return <div>Error: {error.message}</div>
}
```

### Mutation Error Handling

```typescript
const mutation = useMutation({
  mutationFn: addTodo,
  onError: (error, variables, context) => {
    console.error('Failed to add todo:', error)
    // Show toast notification
  },
  retry: 2,
})
```

## Best Practices

1. **Use query keys hierarchically** - Structure from general to specific
2. **Include all dependencies in query key** - Ensure proper cache invalidation
3. **Set appropriate staleTime** - Balance freshness vs network requests
4. **Use optimistic updates** for better UX
5. **Invalidate related queries** after mutations
6. **Prefetch data** on user intent (hover, etc.)
7. **Handle loading and error states** properly
8. **Use enabled option** for conditional queries

For detailed patterns, see:
- [Queries](references/queries.md) - Advanced query patterns
- [Mutations](references/mutations.md) - Mutation patterns
- [Cache Management](references/cache-management.md) - Cache strategies
- [Optimistic Updates](references/optimistic-updates.md) - Optimistic UI patterns
