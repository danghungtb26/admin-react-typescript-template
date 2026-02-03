# Data Loading with TanStack Router

Advanced patterns for loading and caching data.

## Loader Basics

### Simple Loader

```typescript
export const Route = createFileRoute('/users/$userId')({
  loader: async ({ params }) => {
    const response = await fetch(`/api/users/${params.userId}`)
    return response.json()
  },
  component: () => {
    const user = Route.useLoaderData()
    return <div>{user.name}</div>
  },
})
```

### Loader with Dependencies

```typescript
export const Route = createFileRoute('/posts')({
  validateSearch: z.object({
    page: z.number().default(1),
    filter: z.string().optional(),
  }),
  
  // Define which search params affect the loader
  loaderDeps: ({ search }) => ({
    page: search.page,
    filter: search.filter,
  }),
  
  loader: async ({ deps }) => {
    return await fetchPosts(deps.page, deps.filter)
  },
})
```

## Caching Strategies

### Stale-While-Revalidate

```typescript
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    return await fetchDashboardData()
  },
  
  staleTime: 5000,      // Fresh for 5 seconds
  gcTime: 30000,        // Keep in cache for 30 seconds after unused
})
```

### Infinite Stale Time (Never Refetch)

```typescript
export const Route = createFileRoute('/static-content')({
  loader: async () => {
    return await fetchStaticContent()
  },
  staleTime: Infinity,  // Never refetch automatically
})
```

### No Caching

```typescript
export const Route = createFileRoute('/realtime-data')({
  loader: async () => {
    return await fetchRealtimeData()
  },
  staleTime: 0,         // Always refetch
})
```

## Parallel Data Loading

### Multiple API Calls

```typescript
export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const [stats, users, orders] = await Promise.all([
      fetchStats(),
      fetchUsers(),
      fetchOrders(),
    ])
    
    return { stats, users, orders }
  },
  
  component: () => {
    const { stats, users, orders } = Route.useLoaderData()
    return (
      <div>
        <Stats data={stats} />
        <Users data={users} />
        <Orders data={orders} />
      </div>
    )
  },
})
```

## Dependent Data Loading

### Sequential Loading

```typescript
export const Route = createFileRoute('/projects/$projectId/tasks')({
  loader: async ({ params }) => {
    // First fetch project
    const project = await fetchProject(params.projectId)
    
    // Then fetch tasks using project data
    const tasks = await fetchTasks({
      projectId: project.id,
      status: project.defaultTaskStatus,
    })
    
    return { project, tasks }
  },
})
```

## Error Handling

### Try-Catch in Loader

```typescript
export const Route = createFileRoute('/users/$userId')({
  loader: async ({ params }) => {
    try {
      return await fetchUser(params.userId)
    } catch (error) {
      if (error.status === 404) {
        throw new Error('User not found')
      }
      throw error
    }
  },
  
  errorComponent: ({ error }) => {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <Link to="/users">Back to Users</Link>
      </div>
    )
  },
})
```

## Abort Controller

### Cancel Requests

```typescript
export const Route = createFileRoute('/search')({
  validateSearch: z.object({
    q: z.string().default(''),
  }),
  
  loaderDeps: ({ search }) => ({ q: search.q }),
  
  loader: async ({ deps, abortController }) => {
    // Automatically cancelled if user navigates away
    return await fetchSearchResults(deps.q, {
      signal: abortController.signal,
    })
  },
})
```

## Optimistic Updates

### Update with Navigation

```typescript
function EditUserForm({ userId }: Props) {
  const navigate = useNavigate()
  
  const handleSubmit = async (data) => {
    // Update user
    await updateUser(userId, data)
    
    // Navigate and invalidate cache
    await navigate({
      to: '/users/$userId',
      params: { userId },
    })
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

## Prefetching

### Prefetch on Hover

```typescript
<Link
  to="/users/$userId"
  params={{ userId: user.id }}
  preload="intent"        // Prefetch on hover/focus
  preloadDelay={100}      // Delay before prefetch
>
  {user.name}
</Link>
```

### Manual Prefetch

```typescript
function UserList() {
  const router = useRouter()
  
  const prefetchUser = (userId: string) => {
    router.preloadRoute({
      to: '/users/$userId',
      params: { userId },
    })
  }
  
  return (
    <ul>
      {users.map(user => (
        <li
          key={user.id}
          onMouseEnter={() => prefetchUser(user.id)}
        >
          <Link to="/users/$userId" params={{ userId: user.id }}>
            {user.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
```

## Revalidation

### Manual Revalidate

```typescript
function UserDetail() {
  const user = Route.useLoaderData()
  const router = useRouter()
  
  const handleRefresh = () => {
    router.invalidate()  // Revalidate current route
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={handleRefresh}>Refresh</button>
    </div>
  )
}
```

## Context from Parent Routes

### Pass Data from Layout

```typescript
// Parent layout
export const Route = createFileRoute('/_authenticated')({
  loader: async () => {
    const user = await getCurrentUser()
    return { user }
  },
})

// Child route
export const Route = createFileRoute('/_authenticated/dashboard')({
  loader: async ({ context }) => {
    // Use parent's loaded data
    const stats = await fetchUserStats(context.user.id)
    return { stats }
  },
  
  component: () => {
    const { stats } = Route.useLoaderData()
    const { user } = Route.useRouteContext() // From parent
    
    return (
      <div>
        <h1>Dashboard for {user.name}</h1>
        <Stats data={stats} />
      </div>
    )
  },
})
```

## Pagination

### Page-Based Pagination

```typescript
export const Route = createFileRoute('/posts')({
  validateSearch: z.object({
    page: z.number().default(1),
    limit: z.number().default(20),
  }),
  
  loaderDeps: ({ search }) => ({
    page: search.page,
    limit: search.limit,
  }),
  
  loader: async ({ deps }) => {
    return await fetchPosts({
      page: deps.page,
      limit: deps.limit,
    })
  },
  
  component: () => {
    const { data, total, page, limit } = Route.useLoaderData()
    const navigate = useNavigate()
    
    const totalPages = Math.ceil(total / limit)
    
    return (
      <div>
        <PostList posts={data} />
        
        <Pagination
          current={page}
          total={totalPages}
          onChange={(newPage) =>
            navigate({
              search: (prev) => ({ ...prev, page: newPage })
            })
          }
        />
      </div>
    )
  },
})
```

## Best Practices

1. **Use loaderDeps** for intelligent caching based on search params
2. **Set appropriate staleTime** based on data freshness needs
3. **Use abortController** for cancellable requests
4. **Handle errors** with errorComponent
5. **Prefetch** data on user intent for better UX
6. **Cache strategically** - balance freshness vs performance
7. **Use parallel loading** when data is independent
8. **Pass context** from parent loaders to avoid duplicate requests
