# Test Utilities & Providers

Create reusable test utilities to avoid provider duplication.

**File:** `src/tests/utils/test-utils.tsx`

```typescript
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router'

// ============================================================================
// Test Provider Options
// ============================================================================

export interface TestProviderOptions {
  /** Enable React Query provider */
  withQuery?: boolean
  /** Enable Router provider */
  withRouter?: boolean
  /** Custom QueryClient configuration */
  queryClientConfig?: {
    retry?: boolean
    cacheTime?: number
  }
  /** Initial router location */
  initialRoute?: string
}

// ============================================================================
// Create Test Wrapper
// ============================================================================

export function createTestWrapper(options: TestProviderOptions = {}) {
  const {
    withQuery = false,
    withRouter = false,
    queryClientConfig = {},
    initialRoute = '/'
  } = options

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    let wrapped = children

    // Wrap with React Query
    if (withQuery) {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: queryClientConfig.retry ?? false,
            cacheTime: queryClientConfig.cacheTime ?? 0
          }
        }
      })

      wrapped = (
        <QueryClientProvider client={queryClient}>
          {wrapped}
        </QueryClientProvider>
      )
    }

    // Wrap with Router
    if (withRouter) {
      const history = createMemoryHistory({
        initialEntries: [initialRoute]
      })

      wrapped = (
        <RouterProvider history={history}>
          {wrapped}
        </RouterProvider>
      )
    }

    return <>{wrapped}</>
  }
}

// ============================================================================
// Custom Render Functions
// ============================================================================

/**
 * Render component without any providers
 * Use for simple components that don't need context
 */
export function renderSimple(ui: ReactElement) {
  return render(ui)
}

/**
 * Render component with React Query provider
 * Use for components/hooks that use useQuery/useMutation
 */
export function renderWithQuery(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    queryClientConfig?: TestProviderOptions['queryClientConfig']
  }
) {
  const { queryClientConfig, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: createTestWrapper({ withQuery: true, queryClientConfig }),
    ...renderOptions
  })
}

/**
 * Render component with Router provider
 * Use for components that use routing features
 */
export function renderWithRouter(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialRoute?: string
  }
) {
  const { initialRoute, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: createTestWrapper({ withRouter: true, initialRoute }),
    ...renderOptions
  })
}

/**
 * Render component with both Query and Router providers
 * Use for complex components that need both
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & TestProviderOptions
) {
  const { withQuery, withRouter, queryClientConfig, initialRoute, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: createTestWrapper({
      withQuery: withQuery ?? true,
      withRouter: withRouter ?? false,
      queryClientConfig,
      initialRoute
    }),
    ...renderOptions
  })
}

// ============================================================================
// Hook Testing Wrapper
// ============================================================================

/**
 * Create wrapper for renderHook with React Query
 */
export function createQueryWrapper(
  config?: TestProviderOptions['queryClientConfig']
) {
  return createTestWrapper({ withQuery: true, queryClientConfig: config })
}

// ============================================================================
// Re-export everything from testing-library
// ============================================================================

export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
```

## Usage Examples

### 1. Simple Component (No Providers)

```typescript
import { renderSimple, screen } from '@/tests/utils/test-utils'
import { Button } from './Button'

test('should render button', () => {
  // Arrange & Act
  renderSimple(<Button>Click me</Button>)
  
  // Assert
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

### 2. Component with React Query

```typescript
import { renderWithQuery, screen, waitFor } from '@/tests/utils/test-utils'
import { UserList } from './UserList'

test('should fetch and display users', async () => {
  // Arrange & Act
  renderWithQuery(<UserList />)
  
  // Assert
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
  expect(screen.getByText('User 1')).toBeInTheDocument()
})
```

### 3. Component with Router

```typescript
import { renderWithRouter, screen } from '@/tests/utils/test-utils'
import { Navigation } from './Navigation'

test('should highlight active route', () => {
  // Arrange & Act
  renderWithRouter(<Navigation />, { initialRoute: '/users' })
  
  // Assert
  expect(screen.getByRole('link', { name: /users/i })).toHaveClass('active')
})
```

### 4. Component with Both Providers

```typescript
import { renderWithProviders, screen } from '@/tests/utils/test-utils'
import { UserProfile } from './UserProfile'

test('should fetch user and allow navigation', async () => {
  // Arrange & Act
  renderWithProviders(<UserProfile />, {
    withQuery: true,
    withRouter: true,
    initialRoute: '/users/123'
  })
  
  // Assert
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})
```

### 5. Custom Query Client Config

```typescript
import { renderWithQuery, screen } from '@/tests/utils/test-utils'

test('should retry failed requests', async () => {
  // Arrange & Act
  renderWithQuery(<UserList />, {
    queryClientConfig: {
      retry: 3, // Enable retry for this test
      cacheTime: 5000
    }
  })
  
  // Assert - test retry behavior
})
```

### 6. Hook Testing with Query

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '@/tests/utils/test-utils'
import { useUsers } from './use-users'

test('should fetch users', async () => {
  // Arrange
  const wrapper = createQueryWrapper()
  
  // Act
  const { result } = renderHook(() => useUsers({ page: 1 }), { wrapper })
  
  // Assert
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data?.users).toHaveLength(10)
})
```

### 7. Hook Testing with Custom Config

```typescript
test('should handle retry on error', async () => {
  // Arrange
  const wrapper = createQueryWrapper({ retry: 2 })
  
  // Act
  const { result } = renderHook(() => useUsers(), { wrapper })
  
  // Assert - verify retry behavior
})
```

## Benefits

| Approach | Pros | Cons |
|----------|------|------|
| **`renderSimple`** | Fast, no overhead | No providers |
| **`renderWithQuery`** | Only Query, lightweight | Missing Router if needed |
| **`renderWithRouter`** | Only Router, focused | Missing Query if needed |
| **`renderWithProviders`** | Full flexibility with options | Slightly more config |
| **`createQueryWrapper`** | Tailored for hooks | Hook-specific |

## When to Use What

| Component Type | Function | Why |
|----------------|----------|-----|
| Simple UI (Button, Input) | `renderSimple` | No providers needed |
| Form with validation | `renderSimple` | React Hook Form doesn't need providers |
| List with API data | `renderWithQuery` | Needs React Query only |
| Navigation component | `renderWithRouter` | Needs Router only |
| Complex page with data + routing | `renderWithProviders` | Needs both |
| Custom hook with useQuery | `createQueryWrapper` | Hook testing with Query |

## Provider Decision Tree

```
Does component use API data (useQuery/useMutation)?
├─ No
│  └─ Does it use routing (useNavigate/useParams)?
│     ├─ No  → renderSimple
│     └─ Yes → renderWithRouter
└─ Yes
   └─ Does it use routing?
      ├─ No  → renderWithQuery
      └─ Yes → renderWithProviders({ withQuery: true, withRouter: true })
```
