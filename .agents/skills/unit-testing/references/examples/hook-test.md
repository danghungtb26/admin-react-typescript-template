# Hook Test (React Query)

**File:** `src/apis/user/hooks/__tests__/use-users.test.ts`

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '@/tests/utils/test-utils'
import { http, HttpResponse } from 'msw'
import { server } from '@/tests/mocks/server'
import { useUsers } from '../use-users'

describe('useUsers', () => {
  test('should fetch users successfully', async () => {
    // Arrange
    const wrapper = createQueryWrapper()

    // Act
    const { result } = renderHook(() => useUsers({ page: 1 }), { wrapper })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.users).toHaveLength(10)
  })

  test('should handle API error', async () => {
    // Arrange
    server.use(
      http.get('/api/users', () => HttpResponse.json({ error: 'Error' }, { status: 500 }))
    )
    const wrapper = createQueryWrapper()

    // Act
    const { result } = renderHook(() => useUsers(), { wrapper })

    // Assert
    await waitFor(() => expect(result.current.isError).toBe(true))
  })

  test('should retry failed requests when enabled', async () => {
    // Arrange
    const wrapper = createQueryWrapper({ retry: 2 })
    let callCount = 0
    
    // MSW handler that fails twice then succeeds
    server.use(
      http.get('/api/users', () => {
        callCount++
        // First 2 calls fail, third succeeds
        return callCount <= 2
          ? HttpResponse.json({ error: 'Error' }, { status: 500 })
          : HttpResponse.json({ users: [] })
      })
    )

    // Act
    const { result } = renderHook(() => useUsers(), { wrapper })

    // Assert
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(callCount).toBe(3) // Initial + 2 retries
  })
})
```

**Why `createQueryWrapper`?** Hook uses React Query, so it only needs QueryClient provider. Using `createQueryWrapper` provides exactly what's needed without extra overhead.
