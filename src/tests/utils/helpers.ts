/**
 * Mock user shape for tests (plain object, API response shape)
 */
export interface MockUser {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  birthday?: string
  gender?: 'male' | 'female' | 'other'
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// Mock Data Builders
// ============================================================================

export const createMockUser = (overrides?: Partial<MockUser>): MockUser => ({
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '0123456789',
  avatar: 'https://i.pravatar.cc/150?img=1',
  birthday: '1990-01-15',
  gender: 'male',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
})

export const createMockUsers = (count: number, startId = 1): MockUser[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockUser({
      id: `${startId + i}`,
      name: `User ${startId + i}`,
      email: `user${startId + i}@example.com`,
    })
  )
}

// ============================================================================
// DOM Utilities
// ============================================================================

/**
 * Wait for loading to finish
 */
export const waitForLoadingToFinish = async () => {
  const { screen, waitFor } = await import('@testing-library/react')
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
}

// ============================================================================
// Mock Utilities
// ============================================================================

/**
 * Mock localStorage
 */
export const mockLocalStorage = () => {
  const storage: Record<string, string> = {}

  return {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => {
      storage[key] = value
    },
    removeItem: (key: string) => {
      delete storage[key]
    },
    clear: () => {
      Object.keys(storage).forEach((key) => delete storage[key])
    },
  }
}
