# Navigation Techniques

Complete guide for navigation in TanStack Router.

## Link Component

### Basic Usage

```typescript
import { Link } from '@tanstack/react-router'

<Link to="/about">About</Link>
```

### With Route Parameters

```typescript
<Link
  to="/users/$userId"
  params={{ userId: '123' }}
>
  View User 123
</Link>
```

### With Search Parameters

```typescript
<Link
  to="/products"
  search={{ page: 1, filter: 'active', sort: 'name' }}
>
  Products
</Link>
```

### Active Link Styling

```typescript
<Link
  to="/dashboard"
  activeProps={{
    className: 'font-bold text-blue-600',
    'aria-current': 'page'
  }}
  activeOptions={{
    exact: true,  // Only active on exact match
  }}
>
  Dashboard
</Link>
```

### Relative Navigation

```typescript
// Current page with updated search
<Link to="." search={{ page: 2 }}>
  Next Page
</Link>

// Parent route
<Link to=".." params={{ id: '456' }}>
  Go Up
</Link>

// Sibling route
<Link to="../other">
  Sibling
</Link>
```

### Preloading

```typescript
<Link
  to="/heavy-page"
  preload="intent"        // Preload on hover/focus
  preloadDelay={100}      // Wait 100ms before preloading
>
  Heavy Page
</Link>

// Options: false | "intent" | "render"
```

### Replace History

```typescript
<Link to="/login" replace>
  Login
</Link>
```

### External Links

```typescript
// Automatically detected
<Link to="https://example.com">
  External Site
</Link>
```

## useNavigate Hook

### Basic Navigation

```typescript
import { useNavigate } from '@tanstack/react-router'

function Component() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate({ to: '/about' })
  }
  
  return <button onClick={handleClick}>Go to About</button>
}
```

### Navigate with Parameters

```typescript
const navigate = useNavigate()

// Path params
navigate({
  to: '/users/$userId',
  params: { userId: '123' }
})

// Search params
navigate({
  to: '/products',
  search: { page: 1, filter: 'active' }
})

// Both
navigate({
  to: '/users/$userId/posts',
  params: { userId: '123' },
  search: { page: 2 }
})
```

### Update Search Parameters

```typescript
const navigate = useNavigate()
const { page } = Route.useSearch()

// Replace all search params
navigate({
  to: '.',
  search: { page: page + 1 }
})

// Update specific params (merge with previous)
navigate({
  to: '.',
  search: (prev) => ({ ...prev, page: page + 1 })
})
```

### Replace History

```typescript
navigate({
  to: '/login',
  replace: true
})
```

### Navigate to Parent

```typescript
navigate({
  to: '..',
  params: { id: '456' }
})
```

## Accessing Current Route Info

### useParams

```typescript
import { useParams } from '@tanstack/react-router'

function Component() {
  const { userId } = useParams({ from: '/_authenticated/users/$userId' })
  return <div>User ID: {userId}</div>
}

// Or use Route.useParams()
function Component() {
  const { userId } = Route.useParams()
  return <div>User ID: {userId}</div>
}
```

### useSearch

```typescript
import { useSearch } from '@tanstack/react-router'

function Component() {
  const { page, filter } = useSearch({ from: '/_authenticated/products' })
  return <div>Page {page}</div>
}

// Or use Route.useSearch()
function Component() {
  const { page, filter } = Route.useSearch()
  return <div>Page {page}</div>
}
```

### useLocation

```typescript
import { useLocation } from '@tanstack/react-router'

function Component() {
  const location = useLocation()
  
  console.log(location.pathname)  // "/users/123"
  console.log(location.search)    // { page: 1 }
  console.log(location.href)      // Full URL
}
```

### useRouterState

```typescript
import { useRouterState } from '@tanstack/react-router'

function Component() {
  const state = useRouterState()
  
  console.log(state.location)
  console.log(state.matches)      // Matched routes
  console.log(state.isLoading)
  console.log(state.isTransitioning)
}
```

## Navigation with State

### Pass State During Navigation

```typescript
navigate({
  to: '/result',
  state: {
    from: 'search',
    query: 'typescript',
  }
})

// Access state
function ResultPage() {
  const location = useLocation()
  console.log(location.state)  // { from: 'search', query: 'typescript' }
}
```

## Programmatic Preloading

### Preload Route

```typescript
import { useRouter } from '@tanstack/react-router'

function Component() {
  const router = useRouter()
  
  const handleMouseEnter = (userId: string) => {
    router.preloadRoute({
      to: '/users/$userId',
      params: { userId }
    })
  }
  
  return (
    <div onMouseEnter={() => handleMouseEnter('123')}>
      Hover to preload
    </div>
  )
}
```

## Route Matching

### Check if Route is Active

```typescript
import { useMatchRoute } from '@tanstack/react-router'

function Component() {
  const matchRoute = useMatchRoute()
  
  const isUsersRoute = matchRoute({ to: '/users' })
  const isUserDetailRoute = matchRoute({
    to: '/users/$userId',
    params: { userId: '123' }
  })
  
  return (
    <div>
      {isUsersRoute && <span>On users page</span>}
      {isUserDetailRoute && <span>Viewing user 123</span>}
    </div>
  )
}
```

## Navigation Guards

### Confirm Before Navigation

```typescript
function EditForm() {
  const navigate = useNavigate()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const handleNavigate = (to: string) => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Continue?')) {
        navigate({ to })
      }
    } else {
      navigate({ to })
    }
  }
  
  return (
    <form>
      {/* form fields */}
      <button type="button" onClick={() => handleNavigate('/users')}>
        Cancel
      </button>
    </form>
  )
}
```

## Scroll Behavior

### Scroll to Top on Navigation

```typescript
// In router configuration
const router = createRouter({
  routeTree,
  defaultPreloadDelay: 100,
  defaultOnCatch: (error) => {
    console.error(error)
  },
})

// Or per route
export const Route = createFileRoute('/posts')({
  component: PostsPage,
  onEnter: () => {
    window.scrollTo(0, 0)
  },
})
```

### Restore Scroll Position

```typescript
function Component() {
  const location = useLocation()
  
  useEffect(() => {
    // Scroll to saved position or top
    const savedPosition = sessionStorage.getItem(`scroll-${location.pathname}`)
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition))
    } else {
      window.scrollTo(0, 0)
    }
    
    // Save scroll position on unmount
    return () => {
      sessionStorage.setItem(
        `scroll-${location.pathname}`,
        window.scrollY.toString()
      )
    }
  }, [location.pathname])
}
```

## Common Patterns

### Breadcrumb Navigation

```typescript
import { useMatches } from '@tanstack/react-router'

function Breadcrumbs() {
  const matches = useMatches()
  
  return (
    <nav>
      {matches.map((match, i) => (
        <span key={match.id}>
          <Link to={match.pathname}>
            {match.staticData?.meta?.title || 'Page'}
          </Link>
          {i < matches.length - 1 && ' / '}
        </span>
      ))}
    </nav>
  )
}
```

### Back Button

```typescript
function BackButton() {
  const navigate = useNavigate()
  
  const goBack = () => {
    window.history.back()
  }
  
  return <button onClick={goBack}>← Back</button>
}
```

### Conditional Navigation

```typescript
function SaveButton() {
  const navigate = useNavigate()
  const [hasChanges, setHasChanges] = useState(false)
  
  const handleSave = async () => {
    if (hasChanges) {
      await saveChanges()
      navigate({ to: '/success' })
    } else {
      navigate({ to: '/dashboard' })
    }
  }
  
  return <button onClick={handleSave}>Save</button>
}
```

## Best Practices

1. **Use Link for user-triggered navigation** - Better for accessibility
2. **Use useNavigate for programmatic navigation** - After form submissions, etc.
3. **Preload on intent** - Better perceived performance
4. **Use relative navigation** when appropriate - More maintainable
5. **Pass params explicitly** - Type-safe with TypeScript
6. **Update search params functionally** - Preserve other params
7. **Use replace** when appropriate - Don't pollute history
8. **Check route matching** for conditional UI
