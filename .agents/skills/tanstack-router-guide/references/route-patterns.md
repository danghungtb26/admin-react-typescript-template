# Common Route Patterns

Real-world routing patterns with TanStack Router.

## RESTful CRUD Routes

### Standard Pattern

```
/users                # List all users
/users/create         # Create new user
/users/:userId        # View user detail
/users/:userId/edit   # Edit user
```

### Implementation

#### List Route

```typescript
// src/routes/_authenticated/users/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: z.object({
    page: z.number().default(1),
    search: z.string().optional(),
  }),
  
  loaderDeps: ({ search }) => ({
    page: search.page,
    search: search.search,
  }),
  
  loader: async ({ deps }) => {
    return await fetchUsers(deps.page, deps.search)
  },
  
  staticData: {
    meta: {
      title: 'Users',
      titleKey: 'users.title',
    },
  },
  
  component: () => {
    const users = Route.useLoaderData()
    const { page, search } = Route.useSearch()
    const navigate = useNavigate()
    
    return (
      <div>
        <h1>Users</h1>
        
        <input
          value={search || ''}
          onChange={(e) =>
            navigate({
              search: (prev) => ({ ...prev, search: e.target.value })
            })
          }
          placeholder="Search..."
        />
        
        <ul>
          {users.data.map(user => (
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
        
        <button
          onClick={() =>
            navigate({
              search: (prev) => ({ ...prev, page: prev.page + 1 })
            })
          }
        >
          Next Page
        </button>
      </div>
    )
  },
})
```

#### Create Route

```typescript
// src/routes/_authenticated/users/create.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UserCreatePage } from '@/containers/users/user-create-page'

export const Route = createFileRoute('/_authenticated/users/create')({
  component: UserCreatePage,
  staticData: {
    meta: {
      title: 'Create User',
      titleKey: 'users.create_user.page_title',
    },
  },
})
```

#### Detail Route

```typescript
// src/routes/_authenticated/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/users/$userId')({
  loader: async ({ params }) => {
    return await fetchUser(params.userId)
  },
  
  staticData: {
    meta: {
      title: 'User Detail',
      titleKey: 'users.detail.page_title',
    },
  },
  
  component: () => {
    const user = Route.useLoaderData()
    
    return (
      <div>
        <h1>{user.name}</h1>
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        
        <Link
          to="/users/$userId/edit"
          params={{ userId: user.id }}
        >
          Edit User
        </Link>
      </div>
    )
  },
})
```

#### Edit Route

```typescript
// src/routes/_authenticated/users/$userId.edit.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UserEditPage } from '@/containers/users/user-edit-page'

export const Route = createFileRoute('/_authenticated/users/$userId/edit')({
  loader: async ({ params }) => {
    return await fetchUser(params.userId)
  },
  
  staticData: {
    meta: {
      title: 'Edit User',
      titleKey: 'users.edit_user.page_title',
    },
  },
  
  component: UserEditPage,
})
```

## Nested Routes with Tabs

### Pattern

```
/projects/:projectId          # Project overview
/projects/:projectId/members  # Project members tab
/projects/:projectId/settings # Project settings tab
```

### Implementation

```typescript
// src/routes/_authenticated/projects/$projectId.tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/projects/$projectId')({
  loader: async ({ params }) => {
    return await fetchProject(params.projectId)
  },
  
  component: () => {
    const project = Route.useLoaderData()
    
    return (
      <div>
        <h1>{project.name}</h1>
        
        <nav>
          <Link
            to="/projects/$projectId"
            params={{ projectId: project.id }}
            activeOptions={{ exact: true }}
          >
            Overview
          </Link>
          <Link
            to="/projects/$projectId/members"
            params={{ projectId: project.id }}
          >
            Members
          </Link>
          <Link
            to="/projects/$projectId/settings"
            params={{ projectId: project.id }}
          >
            Settings
          </Link>
        </nav>
        
        <Outlet />
      </div>
    )
  },
})

// src/routes/_authenticated/projects/$projectId/index.tsx
export const Route = createFileRoute('/_authenticated/projects/$projectId/')({
  component: () => {
    const project = Route.useLoaderData()
    return <div>Project Overview: {project.description}</div>
  },
})
```

## Modal Routes

### Pattern

Modal that opens on top of current page while maintaining URL.

```typescript
// src/routes/_authenticated/users/$userId.edit.sheet.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UserEditSheet } from '@/containers/users/user-edit-sheet'

export const Route = createFileRoute('/_authenticated/users/$userId/edit/sheet')({
  loader: async ({ params }) => {
    return await fetchUser(params.userId)
  },
  
  component: () => {
    const user = Route.useLoaderData()
    const navigate = useNavigate()
    
    const handleClose = () => {
      navigate({ to: '/users/$userId', params: { userId: user.id } })
    }
    
    return (
      <Sheet open={true} onOpenChange={handleClose}>
        <UserEditSheet user={user} onClose={handleClose} />
      </Sheet>
    )
  },
})
```

## Search/Filter Routes

### Pattern with Complex Search

```typescript
// src/routes/_authenticated/products/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const productSearchSchema = z.object({
  page: z.number().default(1),
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sortBy: z.enum(['name', 'price', 'created']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export const Route = createFileRoute('/_authenticated/products/')({
  validateSearch: productSearchSchema,
  
  loaderDeps: ({ search }) => search,
  
  loader: async ({ deps }) => {
    return await fetchProducts(deps)
  },
  
  component: () => {
    const products = Route.useLoaderData()
    const search = Route.useSearch()
    const navigate = useNavigate()
    
    const updateSearch = (updates: Partial<typeof search>) => {
      navigate({
        search: (prev) => ({ ...prev, ...updates })
      })
    }
    
    return (
      <div>
        <h1>Products</h1>
        
        <input
          value={search.search || ''}
          onChange={(e) => updateSearch({ search: e.target.value })}
        />
        
        <select
          value={search.category || ''}
          onChange={(e) => updateSearch({ category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
        
        <select
          value={search.sortBy}
          onChange={(e) => updateSearch({ sortBy: e.target.value as any })}
        >
          <option value="name">Name</option>
          <option value="price">Price</option>
          <option value="created">Date</option>
        </select>
        
        <ProductList products={products} />
      </div>
    )
  },
})
```

## Dashboard with Layout

```typescript
// src/routes/_authenticated/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard')({
  loader: async () => {
    const [stats, activity] = await Promise.all([
      fetchDashboardStats(),
      fetchRecentActivity(),
    ])
    
    return { stats, activity }
  },
  
  staleTime: 60000, // Cache for 1 minute
  
  staticData: {
    meta: {
      title: 'Dashboard',
      titleKey: 'dashboard.title',
    },
  },
  
  component: () => {
    const { stats, activity } = Route.useLoaderData()
    
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        
        <div className="stats-grid">
          <StatCard label="Users" value={stats.totalUsers} />
          <StatCard label="Revenue" value={stats.revenue} />
          <StatCard label="Orders" value={stats.orders} />
        </div>
        
        <div className="activity">
          <h2>Recent Activity</h2>
          <ActivityList items={activity} />
        </div>
      </div>
    )
  },
})
```

## Error Handling

```typescript
// src/routes/_authenticated/users/$userId.tsx
export const Route = createFileRoute('/_authenticated/users/$userId')({
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
  
  component: UserDetail,
})
```

## Key Patterns Summary

| Pattern | Use Case |
|---------|----------|
| RESTful CRUD | Standard resource management |
| Nested with Tabs | Multi-section views |
| Modal Routes | Overlays with URL state |
| Search/Filter | Complex queries |
| Dashboard | Data aggregation |
| Error Handling | Graceful failures |
