# Testing Loading/Error States

**File:** `src/containers/users/__tests__/UserList.test.tsx`

```typescript
import { renderWithQuery, screen, waitFor } from '@/tests/utils/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '@/tests/mocks/server'
import { getUsersErrorHandler, getUsersEmptyHandler } from '@/tests/mocks/handlers'
import { UserList } from '../index'

describe('UserList States', () => {
  test('should show loading state initially', () => {
    // Arrange & Act
    renderWithQuery(<UserList />)

    // Assert
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('should show error state', async () => {
    // Arrange
    server.use(getUsersErrorHandler)

    // Act
    renderWithQuery(<UserList />)

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  test('should show empty state', async () => {
    // Arrange
    server.use(getUsersEmptyHandler)

    // Act
    renderWithQuery(<UserList />)

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument()
    })
  })

  test('should display users on success', async () => {
    // Arrange & Act
    renderWithQuery(<UserList />)

    // Assert
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
    expect(screen.getByText('User 1')).toBeInTheDocument()
  })
})
```

**Why `renderWithQuery`?** Component fetches data using React Query hooks. Using `renderWithQuery` provides only the QueryClient provider needed for data fetching.
