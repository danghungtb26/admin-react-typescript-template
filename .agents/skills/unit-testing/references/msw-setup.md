# MSW (Mock Service Worker) Setup & Usage

## MSW Overview

MSW intercepts HTTP requests at the network level, providing realistic API mocking for testing.

## Setup MSW in Your Project

### 1. Install Dependencies

```bash
pnpm add -D msw@latest
```

### 2. Handler Architecture

```
src/tests/mocks/
├── handlers/
│   ├── index.ts           # Combines all handlers
│   ├── user.handlers.ts   # User API handlers
│   └── category.handlers.ts
└── server.ts              # MSW server setup
```

### 3. Create Handler Files

Each API module has its own handler file with success/error patterns.

**Naming Convention:** `{action}{Entity}{Success|Error}Handler`

Examples:
- `getUsersSuccessHandler`
- `getUsersErrorHandler`
- `getUserByIdSuccessHandler`
- `createUserSuccessHandler`
- `createUserValidationErrorHandler`

#### `src/tests/mocks/handlers/user.handlers.ts`

```typescript
import { http, HttpResponse } from 'msw'
import type { User } from '@/models/user'

// ============================================================================
// MOCK DATA
// ============================================================================

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '0123456789',
  avatar: 'https://i.pravatar.cc/150?img=1',
  birthday: '1990-01-15',
  gender: 'male',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const createMockUsers = (count: number, page = 1): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockUser,
    id: `${(page - 1) * count + i + 1}`,
    name: `User ${(page - 1) * count + i + 1}`,
    email: `user${(page - 1) * count + i + 1}@example.com`
  }))
}

// ============================================================================
// GET /api/users - List Users
// ============================================================================

export const getUsersSuccessHandler = http.get('/api/users', ({ request }) => {
  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '10')

  return HttpResponse.json({
    users: createMockUsers(limit, page),
    total: 100,
    page,
    limit
  })
})

export const getUsersEmptyHandler = http.get('/api/users', () => {
  return HttpResponse.json({
    users: [],
    total: 0,
    page: 1,
    limit: 10
  })
})

export const getUsersErrorHandler = http.get('/api/users', () => {
  return HttpResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  )
})

export const getUsersNetworkErrorHandler = http.get('/api/users', () => {
  return HttpResponse.error()
})

// ============================================================================
// GET /api/users/:id - Get User By ID
// ============================================================================

export const getUserByIdSuccessHandler = http.get('/api/users/:id', ({ params }) => {
  const { id } = params
  return HttpResponse.json({
    ...mockUser,
    id: id as string
  })
})

export const getUserByIdNotFoundHandler = http.get('/api/users/:id', () => {
  return HttpResponse.json(
    { error: 'User not found' },
    { status: 404 }
  )
})

// ============================================================================
// POST /api/users - Create User
// ============================================================================

export const createUserSuccessHandler = http.post('/api/users', async ({ request }) => {
  const body = await request.json() as Partial<User>
  return HttpResponse.json(
    {
      id: '123',
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { status: 201 }
  )
})

export const createUserValidationErrorHandler = http.post('/api/users', () => {
  return HttpResponse.json(
    {
      error: 'Validation error',
      details: {
        email: 'Email is required',
        name: 'Name is required'
      }
    },
    { status: 400 }
  )
})

export const createUserErrorHandler = http.post('/api/users', () => {
  return HttpResponse.json(
    { error: 'Failed to create user' },
    { status: 500 }
  )
})

// ============================================================================
// PUT /api/users/:id - Update User
// ============================================================================

export const updateUserSuccessHandler = http.put('/api/users/:id', async ({ params, request }) => {
  const { id } = params
  const body = await request.json() as Partial<User>
  return HttpResponse.json({
    ...mockUser,
    id: id as string,
    ...body,
    updatedAt: new Date().toISOString()
  })
})

export const updateUserNotFoundHandler = http.put('/api/users/:id', () => {
  return HttpResponse.json(
    { error: 'User not found' },
    { status: 404 }
  )
})

export const updateUserErrorHandler = http.put('/api/users/:id', () => {
  return HttpResponse.json(
    { error: 'Failed to update user' },
    { status: 500 }
  )
})

// ============================================================================
// DELETE /api/users/:id - Delete User
// ============================================================================

export const deleteUserSuccessHandler = http.delete('/api/users/:id', () => {
  return HttpResponse.json({ success: true })
})

export const deleteUserErrorHandler = http.delete('/api/users/:id', () => {
  return HttpResponse.json(
    { error: 'Failed to delete user' },
    { status: 500 }
  )
})

// ============================================================================
// DEFAULT HANDLERS (Success patterns for normal testing)
// ============================================================================

export const userHandlers = [
  getUsersSuccessHandler,
  getUserByIdSuccessHandler,
  createUserSuccessHandler,
  updateUserSuccessHandler,
  deleteUserSuccessHandler
]
```

#### `src/tests/mocks/handlers/category.handlers.ts`

```typescript
import { http, HttpResponse } from 'msw'

// Mock data
export const mockCategories = [
  { id: '1', name: 'Technology', slug: 'technology' },
  { id: '2', name: 'Business', slug: 'business' },
  { id: '3', name: 'Health', slug: 'health' }
]

// Success handlers
export const getCategoriesSuccessHandler = http.get('/api/categories', () => {
  return HttpResponse.json({ categories: mockCategories })
})

export const getCategoriesEmptyHandler = http.get('/api/categories', () => {
  return HttpResponse.json({ categories: [] })
})

// Error handlers
export const getCategoriesErrorHandler = http.get('/api/categories', () => {
  return HttpResponse.json(
    { error: 'Failed to load categories' },
    { status: 500 }
  )
})

// Default handlers
export const categoryHandlers = [
  getCategoriesSuccessHandler
]
```

#### `src/tests/mocks/handlers/index.ts`

```typescript
import { userHandlers } from './user.handlers'
import { categoryHandlers } from './category.handlers'

// Combine all default handlers
export const handlers = [
  ...userHandlers,
  ...categoryHandlers
]

// Re-export individual handlers for test overrides
export * from './user.handlers'
export * from './category.handlers'
```

### 4. Create Server Setup

`src/tests/mocks/server.ts`:

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

### 5. Setup Test Configuration

`src/tests/setup.ts`:

```typescript
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll } from 'vitest'
import { server } from './mocks/server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => {
  server.close()
})
```

### 6. Configure Vitest

`vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    css: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

## Using Handlers in Tests

### Import and Override Handlers

```typescript
import { server } from '@/tests/mocks/server'
import {
  getUsersErrorHandler,
  getUsersEmptyHandler,
  createUserValidationErrorHandler
} from '@/tests/mocks/handlers'

describe('UserList', () => {
  test('should display users', async () => {
    // Uses default success handler
    render(<UserList />, { wrapper })
    
    await waitFor(() => {
      expect(screen.getByText('User 1')).toBeInTheDocument()
    })
  })

  test('should display error state', async () => {
    // Arrange - Override with error handler
    server.use(getUsersErrorHandler)
    
    // Act
    render(<UserList />, { wrapper })
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  test('should display empty state', async () => {
    // Arrange - Override with empty handler
    server.use(getUsersEmptyHandler)
    
    // Act
    render(<UserList />, { wrapper })
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument()
    })
  })
})
```

### Testing Form Validation Errors

```typescript
import { createUserValidationErrorHandler } from '@/tests/mocks/handlers'

test('should display validation errors from API', async () => {
  // Arrange
  server.use(createUserValidationErrorHandler)
  const user = userEvent.setup()
  render(<UserCreateForm />, { wrapper })
  
  // Act
  await user.click(screen.getByRole('button', { name: /create/i }))
  
  // Assert
  await waitFor(() => {
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })
})
```

### Custom Handler for Specific Test

```typescript
test('should handle custom scenario', async () => {
  // Arrange - Create inline handler for specific case
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json({
        users: [{ id: '1', name: 'Custom User' }],
        total: 1
      })
    })
  )
  
  // Act & Assert
  render(<UserList />, { wrapper })
  await waitFor(() => {
    expect(screen.getByText('Custom User')).toBeInTheDocument()
  })
})
```

## Advanced Patterns

### Testing with Network Delay

```typescript
import { delay } from 'msw'

export const getUsersDelayedHandler = http.get('/api/users', async () => {
  await delay(1000)
  return HttpResponse.json({ users: createMockUsers(10) })
})

test('should show loading state', async () => {
  server.use(getUsersDelayedHandler)
  
  render(<UserList />, { wrapper })
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
  
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  }, { timeout: 2000 })
})
```

### Capture and Verify Request Body

```typescript
test('should send correct data to API', async () => {
  // Arrange
  let capturedBody: any
  
  server.use(
    http.post('/api/users', async ({ request }) => {
      capturedBody = await request.json()
      return HttpResponse.json({ id: '123', ...capturedBody }, { status: 201 })
    })
  )
  
  const user = userEvent.setup()
  render(<UserCreateForm />, { wrapper })
  
  // Act
  await user.type(screen.getByLabelText(/name/i), 'John Doe')
  await user.type(screen.getByLabelText(/email/i), 'john@example.com')
  await user.click(screen.getByRole('button', { name: /create/i }))
  
  // Assert
  await waitFor(() => {
    expect(capturedBody).toEqual({
      name: 'John Doe',
      email: 'john@example.com'
    })
  })
})
```

### Sequential Responses

```typescript
test('should handle polling', async () => {
  let callCount = 0
  
  server.use(
    http.get('/api/status', () => {
      callCount++
      const statuses = ['pending', 'processing', 'completed']
      return HttpResponse.json({
        status: statuses[Math.min(callCount - 1, 2)]
      })
    })
  )
  
  // Test polling behavior
})
```

### Response with Custom Headers

```typescript
export const getUsersWithHeadersHandler = http.get('/api/users', () => {
  return HttpResponse.json(
    { users: [] },
    {
      headers: {
        'X-Total-Count': '100',
        'X-Page': '1'
      }
    }
  )
})
```

## Best Practices

1. **Organize by domain**: Each API module has its own handler file
2. **Use naming convention**: `{action}{Entity}{Success|Error}Handler`
3. **Export default handlers**: Combine success handlers as defaults
4. **Export individual handlers**: Allow tests to import specific scenarios
5. **Create mock data generators**: Reuse mock data across handlers
6. **Reset handlers after each test**: Ensure test isolation
7. **Type your handlers**: Use TypeScript for request/response bodies

## Handler Naming Reference

| Action | Success | Error | Empty |
|--------|---------|-------|-------|
| Get list | `getUsersSuccessHandler` | `getUsersErrorHandler` | `getUsersEmptyHandler` |
| Get by ID | `getUserByIdSuccessHandler` | `getUserByIdNotFoundHandler` | - |
| Create | `createUserSuccessHandler` | `createUserErrorHandler` | `createUserValidationErrorHandler` |
| Update | `updateUserSuccessHandler` | `updateUserErrorHandler` | `updateUserNotFoundHandler` |
| Delete | `deleteUserSuccessHandler` | `deleteUserErrorHandler` | - |
