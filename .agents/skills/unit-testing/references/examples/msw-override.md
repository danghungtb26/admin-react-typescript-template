# MSW Handler Override

**File:** `src/containers/users/__tests__/UserList.test.tsx`

```typescript
import { renderWithQuery, screen, waitFor } from '@/tests/utils/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '@/tests/mocks/server'
import { getUsersEmptyHandler } from '@/tests/mocks/handlers'
import { UserList } from '../index'

describe('UserList with MSW', () => {
  test('should display empty state', async () => {
    // Arrange - Override with empty handler
    server.use(getUsersEmptyHandler)

    // Act
    renderWithQuery(<UserList />)

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/no users found/i)).toBeInTheDocument()
    })
  })

  test('should handle custom response', async () => {
    // Arrange - Custom inline handler
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json({
          users: [{ id: '1', name: 'Custom User' }],
          total: 1
        })
      })
    )

    // Act
    renderWithQuery(<UserList />)

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Custom User')).toBeInTheDocument()
    })
  })
})
```

**Why `renderWithQuery`?** Component needs React Query to fetch API data. Using `renderWithQuery` provides minimal required providers for optimal test performance.
