# Advanced Query Patterns

Detailed patterns for using `useQuery` in TanStack Query.

## Query Options Reference

### Essential Options

```typescript
useQuery({
  queryKey: ['todos', { status, page }],
  queryFn: fetchTodos,
  staleTime: 60 * 1000,        // Fresh for 1 minute
  gcTime: 5 * 60 * 1000,       // Garbage collect after 5 minutes
  enabled: true,               // Enable/disable query
  refetchOnWindowFocus: true,  // Refetch on window focus
  refetchOnReconnect: true,    // Refetch on reconnect
  refetchOnMount: true,        // Refetch on mount
  retry: 3,                    // Retry 3 times on failure
  retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
})
```

## Dependent Queries

### Sequential Data Fetching

```typescript
function UserPosts({ userId }: { userId: string }) {
  // First, fetch user
  const { data: user } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  })

  // Then, fetch posts (only if user exists)
  const { data: posts } = useQuery({
    queryKey: ['users', userId, 'posts'],
    queryFn: () => fetchUserPosts(userId),
    enabled: !!user,  // Only run if user is loaded
  })

  return (
    <div>
      <h1>{user?.name}</h1>
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

## Parallel Queries

### Multiple Queries

```typescript
function Dashboard() {
  const users = useQuery({ queryKey: ['users'], queryFn: fetchUsers })
  const posts = useQuery({ queryKey: ['posts'], queryFn: fetchPosts })
  const comments = useQuery({ queryKey: ['comments'], queryFn: fetchComments })

  if (users.isLoading || posts.isLoading || comments.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Users data={users.data} />
      <Posts data={posts.data} />
      <Comments data={comments.data} />
    </div>
  )
}
```

### Using useQueries

```typescript
function UserDetails({ userIds }: { userIds: string[] }) {
  const userQueries = useQueries({
    queries: userIds.map(id => ({
      queryKey: ['users', id],
      queryFn: () => fetchUser(id),
    })),
  })

  const isLoading = userQueries.some(q => q.isLoading)
  const users = userQueries.map(q => q.data).filter(Boolean)

  return (
    <div>
      {isLoading ? 'Loading...' : users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

## Paginated Queries

### Page-Based Pagination

```typescript
function Posts() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['posts', { page }],
    queryFn: () => fetchPosts(page),
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div>
      {data?.posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
      
      <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
        Previous
      </button>
      <span>Page {page}</span>
      <button onClick={() => setPage(p => p + 1)}>
        Next
      </button>
    </div>
  )
}
```

### Keep Previous Data

```typescript
const { data, isPlaceholderData } = useQuery({
  queryKey: ['posts', { page }],
  queryFn: () => fetchPosts(page),
  placeholderData: keepPreviousData,  // Keep previous data while fetching
})
```

## Infinite Queries

### useInfiniteQuery

```typescript
import { useInfiniteQuery } from '@tanstack/react-query'

function Posts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 0 }) => fetchPosts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  })

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map(post => (
            <div key={post.id}>{post.title}</div>
          ))}
        </div>
      ))}
      
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'No more'}
      </button>
    </div>
  )
}
```

## Data Transformation

### Select Option

```typescript
const { data: todoTitles } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  select: (todos) => todos.map(todo => todo.title),  // Transform data
})
```

## Polling

### Interval Refetching

```typescript
const { data } = useQuery({
  queryKey: ['realtime-data'],
  queryFn: fetchRealtimeData,
  refetchInterval: 5000,  // Poll every 5 seconds
})
```

### Conditional Polling

```typescript
const [isPolling, setIsPolling] = useState(false)

const { data } = useQuery({
  queryKey: ['status'],
  queryFn: fetchStatus,
  refetchInterval: isPolling ? 1000 : false,
})
```

## Background Refetching

```typescript
const { data } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  refetchInterval: 30000,
  refetchIntervalInBackground: true,  // Keep polling even when tab is in background
})
```

## Query Status Patterns

### Loading States

```typescript
const { data, isLoading, isFetching, isRefetching } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})

// isLoading: true when no data and fetching (first load)
// isFetching: true whenever fetching (including refetch)
// isRefetching: true when refetching with existing data
```

## Initial Data

### Provide Initial Data

```typescript
const { data } = useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetchTodo(todoId),
  initialData: () => {
    // Use cached list data if available
    return queryClient
      .getQueryData(['todos'])
      ?.find(todo => todo.id === todoId)
  },
})
```

## Placeholder Data

### While Loading

```typescript
const { data } = useQuery({
  queryKey: ['todo', todoId],
  queryFn: () => fetchTodo(todoId),
  placeholderData: {
    id: todoId,
    title: 'Loading...',
  },
})
```

## Best Practices

1. **Structure query keys** from general to specific
2. **Include all variables** that affect the query in the key
3. **Use enabled** for conditional queries
4. **Set appropriate staleTime** to reduce network requests
5. **Use select** for data transformation
6. **Keep previous data** for better pagination UX
7. **Use placeholderData** for instant loading states
