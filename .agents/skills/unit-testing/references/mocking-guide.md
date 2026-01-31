# Mocking Guide

## Mock Functions (vi.fn)

### Basic Mock Function

```typescript
test('should call callback on button click', async () => {
  // Arrange
  const user = userEvent.setup()
  const mockCallback = vi.fn()
  render(<Button onClick={mockCallback}>Click me</Button>)
  
  // Act
  await user.click(screen.getByRole('button'))
  
  // Assert
  expect(mockCallback).toHaveBeenCalledTimes(1)
})
```

### Mock Function with Implementation

```typescript
test('should transform data using custom formatter', () => {
  // Arrange
  const mockFormatter = vi.fn((value: number) => `$${value.toFixed(2)}`)
  const component = render(<PriceDisplay value={100} formatter={mockFormatter} />)
  
  // Act
  // Component renders and calls formatter
  
  // Assert
  expect(mockFormatter).toHaveBeenCalledWith(100)
  expect(screen.getByText('$100.00')).toBeInTheDocument()
})
```

### Mock Function with Return Values

```typescript
test('should use mock return value', () => {
  // Arrange
  const mockGetUser = vi.fn()
  mockGetUser.mockReturnValue({ id: '1', name: 'John' })
  
  // Act
  const user = mockGetUser('1')
  
  // Assert
  expect(user).toEqual({ id: '1', name: 'John' })
  expect(mockGetUser).toHaveBeenCalledWith('1')
})
```

### Mock Function with Async Return

```typescript
test('should handle async mock function', async () => {
  // Arrange
  const mockFetchUser = vi.fn()
  mockFetchUser.mockResolvedValue({ id: '1', name: 'John' })
  
  // Act
  const user = await mockFetchUser('1')
  
  // Assert
  expect(user.name).toBe('John')
})
```

### Mock Function with Different Return Values per Call

```typescript
test('should handle multiple calls with different returns', () => {
  // Arrange
  const mockGetStatus = vi.fn()
  mockGetStatus
    .mockReturnValueOnce('pending')
    .mockReturnValueOnce('processing')
    .mockReturnValueOnce('completed')
  
  // Act & Assert
  expect(mockGetStatus()).toBe('pending')
  expect(mockGetStatus()).toBe('processing')
  expect(mockGetStatus()).toBe('completed')
})
```

## Mocking Modules with vi.mock

### Mocking Entire Module

```typescript
// Mock the entire hooks module
vi.mock('@/apis/user/hooks/use-users', () => ({
  useUsers: vi.fn()
}))

describe('UserList', () => {
  test('should display users from hook', () => {
    // Arrange
    const mockUseUsers = vi.mocked(useUsers)
    mockUseUsers.mockReturnValue({
      data: {
        users: [
          { id: '1', name: 'John Doe' },
          { id: '2', name: 'Jane Smith' }
        ]
      },
      isLoading: false,
      isError: false
    })
    
    // Act
    render(<UserList />)
    
    // Assert
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })
})
```

### Mocking Specific Exports

```typescript
vi.mock('@/commons/cookies', () => ({
  getCookie: vi.fn(),
  setCookie: vi.fn(),
  removeCookie: vi.fn()
}))

import { getCookie, setCookie } from '@/commons/cookies'

test('should read cookie value', () => {
  // Arrange
  vi.mocked(getCookie).mockReturnValue('user-token-123')
  
  // Act
  const token = getCookie('auth_token')
  
  // Assert
  expect(token).toBe('user-token-123')
  expect(getCookie).toHaveBeenCalledWith('auth_token')
})
```

### Partial Module Mocking

```typescript
// Mock only specific functions, keep the rest
vi.mock('@/lib/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/utils')>()
  return {
    ...actual,
    formatDate: vi.fn() // Only mock this function
  }
})
```

### Mocking React Query Hooks

```typescript
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  QueryClient: vi.fn(),
  QueryClientProvider: ({ children }: any) => children
}))

describe('UserProfile', () => {
  test('should handle loading state', () => {
    // Arrange
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null
    } as any)
    
    // Act
    render(<UserProfile userId="1" />)
    
    // Assert
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('should display user data when loaded', () => {
    // Arrange
    vi.mocked(useQuery).mockReturnValue({
      data: { id: '1', name: 'John Doe', email: 'john@example.com' },
      isLoading: false,
      isError: false,
      error: null
    } as any)
    
    // Act
    render(<UserProfile userId="1" />)
    
    // Assert
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})
```

## Mocking Axios

### Basic Axios Mock

```typescript
import axios from 'axios'

vi.mock('axios')

test('should fetch data successfully', async () => {
  // Arrange
  const mockData = { users: [{ id: '1', name: 'John' }] }
  vi.mocked(axios.get).mockResolvedValue({ data: mockData })
  
  // Act
  const result = await fetchUsers()
  
  // Assert
  expect(result.users).toHaveLength(1)
  expect(axios.get).toHaveBeenCalledWith('/api/users')
})
```

### Axios with Error Handling

```typescript
test('should handle API error', async () => {
  // Arrange
  const mockError = new Error('Network error')
  vi.mocked(axios.get).mockRejectedValue(mockError)
  
  // Act & Assert
  await expect(fetchUsers()).rejects.toThrow('Network error')
})
```

## Mocking Timers

### Using Fake Timers

```typescript
import { vi } from 'vitest'

describe('Timer Component', () => {
  beforeEach(() => {
    // Arrange - Enable fake timers
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Cleanup
    vi.restoreAllMocks()
  })

  test('should auto-save after 3 seconds', async () => {
    // Arrange
    const mockSave = vi.fn()
    render(<Editor onAutoSave={mockSave} />)
    
    // Act
    await userEvent.type(screen.getByRole('textbox'), 'Hello')
    vi.advanceTimersByTime(3000)
    
    // Assert
    expect(mockSave).toHaveBeenCalledTimes(1)
  })
})
```

## Mocking Date and Time

```typescript
test('should display current date', () => {
  // Arrange
  const mockDate = new Date('2024-01-15T10:00:00.000Z')
  vi.setSystemTime(mockDate)
  
  // Act
  render(<DateDisplay />)
  
  // Assert
  expect(screen.getByText('15/01/2024')).toBeInTheDocument()
  
  // Cleanup
  vi.useRealTimers()
})
```

## Mocking localStorage/sessionStorage

```typescript
describe('Storage Utils', () => {
  beforeEach(() => {
    // Arrange - Clear storage before each test
    localStorage.clear()
  })

  test('should save user preferences to localStorage', () => {
    // Arrange
    const preferences = { theme: 'dark', language: 'en' }
    
    // Act
    savePreferences(preferences)
    
    // Assert
    expect(localStorage.getItem('preferences')).toBe(JSON.stringify(preferences))
  })

  test('should retrieve user preferences', () => {
    // Arrange
    const preferences = { theme: 'dark', language: 'en' }
    localStorage.setItem('preferences', JSON.stringify(preferences))
    
    // Act
    const result = getPreferences()
    
    // Assert
    expect(result).toEqual(preferences)
  })
})
```

## Spy on Functions

### Spying on Object Methods

```typescript
test('should spy on console.error', () => {
  // Arrange
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  
  // Act
  someFunction() // This function calls console.error
  
  // Assert
  expect(consoleSpy).toHaveBeenCalledWith('Error message')
  
  // Cleanup
  consoleSpy.mockRestore()
})
```

### Spying on Module Functions

```typescript
import * as utils from '@/lib/utils'

test('should call utility function', () => {
  // Arrange
  const validateSpy = vi.spyOn(utils, 'validateEmail')
  
  // Act
  const result = utils.validateEmail('test@example.com')
  
  // Assert
  expect(validateSpy).toHaveBeenCalledWith('test@example.com')
  expect(result).toBe(true)
})
```

## Mock Assertions

```typescript
// Check if function was called
expect(mockFn).toHaveBeenCalled()
expect(mockFn).not.toHaveBeenCalled()

// Check call count
expect(mockFn).toHaveBeenCalledTimes(2)

// Check call arguments
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenLastCalledWith('arg1')
expect(mockFn).toHaveBeenNthCalledWith(2, 'arg1')

// Check call order
const mockFn1 = vi.fn()
const mockFn2 = vi.fn()
mockFn1()
mockFn2()
expect(mockFn1).toHaveBeenCalledBefore(mockFn2)

// Reset mocks
mockFn.mockClear() // Clear call history
mockFn.mockReset() // Clear call history and implementation
mockFn.mockRestore() // Restore original implementation
```

## Common Mock Patterns for This Project

### Mocking React Query Hooks

```typescript
// For hooks in @/apis/user/hooks/
vi.mock('@/apis/user/hooks/use-users', () => ({
  useUsers: vi.fn()
}))

// Usage in test
vi.mocked(useUsers).mockReturnValue({
  data: { users: [] },
  isLoading: false,
  isError: false
})
```

### Mocking TanStack Router

```typescript
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>
}))
```

### Mocking React Hook Form

```typescript
// Component already uses real react-hook-form
// Test it by interacting with rendered form
test('form validation', async () => {
  const user = userEvent.setup()
  render(<UserForm onSubmit={vi.fn()} />)
  
  await user.type(screen.getByLabelText(/email/i), 'invalid')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  await waitFor(() => {
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
  })
})
```

### Mocking i18next

```typescript
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Return the key as translation
    i18n: {
      changeLanguage: vi.fn(),
      language: 'en'
    }
  })
}))
```
