# Authentication with TanStack Router

Complete guide for implementing authentication.

## Protected Routes Pattern

### Layout Route for Authentication

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

### Passing User Context

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
    
    // Pass user to all child routes
    return { user }
  },
})
```

### Using User Context in Child Routes

```typescript
// src/routes/_authenticated/dashboard.tsx
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: () => {
    const { user } = Route.useRouteContext()
    
    return (
      <div>
        <h1>Welcome, {user.email}!</h1>
        <p>Role: {user.role}</p>
      </div>
    )
  },
})
```

## Login Route with Redirect

```typescript
// src/routes/login.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  
  component: () => {
    const { redirect } = Route.useSearch()
    const navigate = useNavigate()
    
    const handleLogin = async (credentials) => {
      await login(credentials)
      
      // Redirect to original location or dashboard
      navigate({ to: redirect || '/dashboard' })
    }
    
    return <LoginForm onSubmit={handleLogin} />
  },
})
```

## Role-Based Access Control

### Check Permissions in beforeLoad

```typescript
// src/routes/_authenticated/admin.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin')({
  beforeLoad: ({ context }) => {
    if (!context.user.roles.includes('admin')) {
      throw redirect({
        to: '/dashboard',
        // Optionally show error toast
      })
    }
  },
})
```

### Permission Check Utility

```typescript
// src/lib/permissions.ts
export function hasPermission(user: User, permission: string): boolean {
  return user.permissions.includes(permission)
}

// Usage in route
export const Route = createFileRoute('/_authenticated/users/$userId/delete')({
  beforeLoad: ({ context, params }) => {
    if (!hasPermission(context.user, 'users.delete')) {
      throw redirect({ to: '/users/$userId', params })
    }
  },
})
```

## Token Refresh

```typescript
// src/routes/__root.tsx
import { createRootRoute } from '@tanstack/react-router'
import { refreshToken } from '@/lib/auth'

export const Route = createRootRoute({
  beforeLoad: async ({ context }) => {
    // Check if token needs refresh
    if (context.auth.tokenNeedsRefresh()) {
      await refreshToken()
    }
  },
  component: RootComponent,
})
```

## Logout

```typescript
// components/LogoutButton.tsx
import { useNavigate } from '@tanstack/react-router'
import { logout } from '@/lib/auth'

export function LogoutButton() {
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    await logout()
    navigate({ to: '/login' })
  }
  
  return <button onClick={handleLogout}>Logout</button>
}
```

## Context Setup

```typescript
// src/lib/router.ts
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { getCurrentUser } from './auth'

export const router = createRouter({
  routeTree,
  context: {
    auth: {
      isAuthenticated: false,
    },
    user: undefined,
  },
  defaultPreload: 'intent',
})

// Update context on mount
async function initializeAuth() {
  const user = await getCurrentUser()
  
  router.update({
    context: {
      auth: {
        isAuthenticated: !!user,
      },
      user,
    },
  })
}

initializeAuth()
```

## Complete Authentication Flow

### 1. Root Route Setup

```typescript
// src/routes/__root.tsx
export const Route = createRootRoute({
  beforeLoad: async () => {
    // Global auth check or token refresh
  },
  component: RootComponent,
})
```

### 2. Auth Layout

```typescript
// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser()
    
    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    
    return { user }
  },
})
```

### 3. Login Route

```typescript
// src/routes/login.tsx
export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginPage,
})
```

### 4. Protected Routes

```typescript
// src/routes/_authenticated/dashboard.tsx
// Automatically protected by _authenticated layout
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})
```

## Best Practices

1. **Use layout routes** for shared authentication logic
2. **Pass user context** from layout to avoid refetching
3. **Preserve redirect location** for better UX
4. **Check permissions early** in beforeLoad
5. **Handle token refresh** at root level
6. **Clear sensitive data** on logout
7. **Use TypeScript** for type-safe auth context

## Common Patterns

### Multi-Level Permission Check

```typescript
// Admin section
export const Route = createFileRoute('/_authenticated/_admin')({
  beforeLoad: ({ context }) => {
    if (!context.user.roles.includes('admin')) {
      throw redirect({ to: '/dashboard' })
    }
  },
})

// Super admin section
export const Route = createFileRoute('/_authenticated/_admin/_super')({
  beforeLoad: ({ context }) => {
    if (!context.user.roles.includes('super_admin')) {
      throw redirect({ to: '/admin' })
    }
  },
})
```

### Feature-Specific Permissions

```typescript
export const Route = createFileRoute('/_authenticated/projects/$projectId/delete')({
  beforeLoad: async ({ context, params }) => {
    const canDelete = await checkProjectPermission(
      context.user.id,
      params.projectId,
      'delete'
    )
    
    if (!canDelete) {
      throw redirect({
        to: '/projects/$projectId',
        params: { projectId: params.projectId }
      })
    }
  },
})
```
