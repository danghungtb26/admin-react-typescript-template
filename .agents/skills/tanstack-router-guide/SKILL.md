---
name: tanstack-router-guide
description: Guide for using TanStack Router in React applications. Use when implementing routing, creating routes, handling navigation, working with route parameters, search params, loaders, or protected routes. Apply when the user asks about TanStack Router, file-based routing, type-safe navigation, or route authentication.
keywords: tanstack-router, routing, routes, navigation, loaders, search-params, file-based-routing, protected-routes, createFileRoute
---

# TanStack Router Guide

## Overview

TanStack Router is a modern, type-safe routing library for React with file-based routing, built-in data loading, and powerful URL state management.

## File-Based Routing

### Route Structure

```
src/routes/
├── __root.tsx              # Root layout
├── index.tsx               # / (home)
├── _authenticated.tsx      # Protected layout
├── _authenticated/
│   ├── dashboard.tsx       # /dashboard
│   ├── users/
│   │   ├── index.tsx       # /users
│   │   ├── $userId.tsx     # /users/:userId
│   │   └── $userId.edit.tsx # /users/:userId/edit
└── login.tsx               # /login
```

### Root Route

```typescript
// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div>
      <nav>Navigation Bar</nav>
      <Outlet />
    </div>
  ),
})
```

### Basic Route

```typescript
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <h1>Home Page</h1>,
})
```

### Dynamic Route with Params

```typescript
// src/routes/posts.$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  component: () => {
    const { postId } = Route.useParams()
    return <div>Post {postId}</div>
  },
})
```

## Route Parameters

### Path Parameters

Use `$` prefix for dynamic segments:

```typescript
// src/routes/users/$userId.tsx
export const Route = createFileRoute('/users/$userId')({
  component: () => {
    const { userId } = Route.useParams()
    return <div>User ID: {userId}</div>
  },
})
```

### Search Parameters

Use `validateSearch` with Zod schema:

```typescript
// src/routes/products.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const productSearchSchema = z.object({
  page: z.number().int().positive().default(1),
  filter: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'price']).catch('newest'),
})

export const Route = createFileRoute('/products')({
  validateSearch: productSearchSchema,
  component: () => {
    const { page, filter, sort } = Route.useSearch()
    return (
      <div>
        <h1>Products (Page {page})</h1>
        {filter && <p>Filter: {filter}</p>}
        <p>Sort: {sort}</p>
      </div>
    )
  },
})
```

## Data Loading

### Loader with Dependencies

```typescript
// src/routes/posts.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

async function fetchPosts(page: number, filter?: string) {
  const params = new URLSearchParams({
    page: String(page),
    ...(filter && { filter })
  })
  const response = await fetch(`/api/posts?${params}`)
  return response.json()
}

export const Route = createFileRoute('/posts')({
  validateSearch: z.object({
    page: z.number().default(1),
    filter: z.string().optional(),
  }),
  
  loaderDeps: ({ search }) => ({
    page: search.page,
    filter: search.filter,
  }),
  
  loader: async ({ deps }) => {
    return await fetchPosts(deps.page, deps.filter)
  },
  
  staleTime: 5000,
  gcTime: 30000,
  
  component: () => {
    const posts = Route.useLoaderData()
    const { page } = Route.useSearch()
    
    return (
      <div>
        <h1>Posts (Page {page})</h1>
        <ul>
          {posts.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </div>
    )
  },
})
```

### Loader with Single Item

```typescript
// src/routes/posts.$postId.tsx
async function fetchPost(id: string) {
  const response = await fetch(`/api/posts/${id}`)
  return response.json()
}

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    return await fetchPost(params.postId)
  },
  component: () => {
    const post = Route.useLoaderData()
    return (
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    )
  },
})
```

## Protected Routes

### Authentication Layout

```typescript
// src/routes/_authenticated.tsx
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: () => <Outlet />,
})
```

### Protected Route with User Context

```typescript
// src/routes/_authenticated.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUser } from '@/lib/auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser()
    
    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    
    // Pass user to child routes
    return { user }
  },
})
```

### Using User Context in Protected Route

```typescript
// src/routes/_authenticated/dashboard.tsx
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: () => {
    const { user } = Route.useRouteContext()
    
    return (
      <div>
        <h1>Welcome, {user.email}!</h1>
      </div>
    )
  },
})
```

## Navigation

### Link Component

```typescript
import { Link } from '@tanstack/react-router'

function Navigation() {
  return (
    <nav>
      {/* Basic link */}
      <Link to="/about">About</Link>
      
      {/* With params */}
      <Link
        to="/posts/$postId"
        params={{ postId: '123' }}
      >
        View Post
      </Link>
      
      {/* With search params */}
      <Link
        to="/products"
        search={{ page: 1, filter: 'active' }}
      >
        Products
      </Link>
      
      {/* Active styling */}
      <Link
        to="/dashboard"
        activeProps={{ className: 'font-bold text-blue-600' }}
        activeOptions={{ exact: true }}
      >
        Dashboard
      </Link>
      
      {/* Preload on hover */}
      <Link
        to="/heavy-page"
        preload="intent"
        preloadDelay={100}
      >
        Heavy Page
      </Link>
    </nav>
  )
}
```

### Programmatic Navigation

```typescript
import { useNavigate } from '@tanstack/react-router'

function Component() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    // Navigate to route with params
    navigate({
      to: '/posts/$postId',
      params: { postId: '123' }
    })
  }
  
  const handleSearch = () => {
    // Update search params
    navigate({
      to: '.',
      search: (prev) => ({ ...prev, page: prev.page + 1 })
    })
  }
  
  const handleReplace = () => {
    // Replace history
    navigate({
      to: '/login',
      replace: true
    })
  }
  
  return (
    <div>
      <button onClick={handleClick}>View Post</button>
      <button onClick={handleSearch}>Next Page</button>
    </div>
  )
}
```

## Route Metadata

### staticData for Route Meta

```typescript
// src/routes/_authenticated/users/index.tsx
export const Route = createFileRoute('/_authenticated/users/')({
  component: UserList,
  staticData: {
    meta: {
      title: 'Users',
      titleKey: 'users.title',
    },
  },
})
```

## Common Patterns

### List with Detail Pages

```typescript
// List: src/routes/_authenticated/users/index.tsx
export const Route = createFileRoute('/_authenticated/users/')({
  loader: async () => {
    return await fetchUsers()
  },
  component: () => {
    const users = Route.useLoaderData()
    
    return (
      <div>
        <h1>Users</h1>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              <Link
                to="/users/$userId"
                params={{ userId: user.id }}
              >
                {user.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  },
})

// Detail: src/routes/_authenticated/users/$userId.tsx
export const Route = createFileRoute('/_authenticated/users/$userId')({
  loader: async ({ params }) => {
    return await fetchUser(params.userId)
  },
  component: () => {
    const user = Route.useLoaderData()
    
    return (
      <div>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
    )
  },
})
```

### CRUD Routes

```typescript
// List: /users
// Create: /users/create
// Detail: /users/:userId
// Edit: /users/:userId/edit
```

For detailed examples, see [references/route-patterns.md](references/route-patterns.md).

## Best Practices

1. **Use validateSearch** for type-safe search params
2. **Use loaderDeps** for intelligent caching
3. **Use beforeLoad** for authentication/authorization
4. **Pass user context** from layout to child routes
5. **Use Link component** for type-safe navigation
6. **Use relative navigation** with `.` and `..`
7. **Preload routes** on user intent
8. **Cache loader data** with staleTime/gcTime

## Additional Resources

- [Route patterns](references/route-patterns.md) - Common routing patterns
- [Authentication](references/authentication.md) - Implementing auth
- [Data loading](references/data-loading.md) - Advanced loader patterns
- [Navigation](references/navigation.md) - Navigation techniques
