# Testing Patterns & Best Practices

## AAA Pattern (Arrange-Act-Assert)

Structure all tests using AAA pattern with clear comment separators:

```typescript
test('should update user successfully', async () => {
  // Arrange
  const userId = '123'
  const updatedData = { name: 'John Doe', email: 'john@example.com' }
  
  // Act
  const result = await updateUser(userId, updatedData)
  
  // Assert
  expect(result.success).toBe(true)
  expect(result.data.name).toBe('John Doe')
})
```

### When to Use Each Section

**Arrange**: Setup test data, mock functions, create component instances, configure initial state
**Act**: Execute the function/action being tested, trigger user interactions, call the method
**Assert**: Verify outcomes, check function calls, validate state changes, ensure correct rendering

## Component Testing Patterns

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react'
import { UserProfile } from './UserProfile'

describe('UserProfile', () => {
  test('should render user information', () => {
    // Arrange
    const user = { id: '1', name: 'John Doe', email: 'john@example.com' }
    
    // Act
    render(<UserProfile user={user} />)
    
    // Assert
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})
```

### Component with User Interactions

```typescript
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  test('should call onSubmit with form data when submitted', async () => {
    // Arrange
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    render(<LoginForm onSubmit={mockOnSubmit} />)
    
    // Act
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /submit/i }))
    
    // Assert
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })
})
```

### Component with React Hook Form

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { UserForm } from './UserForm'

describe('UserForm', () => {
  test('should validate and submit form data', async () => {
    // Arrange
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    render(<UserForm onSubmit={mockOnSubmit} onCancel={vi.fn()} />)
    
    // Act - Fill form
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone/i), '0123456789')
    
    // Act - Submit form
    await user.click(screen.getByRole('button', { name: /save/i }))
    
    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '0123456789'
      })
    })
  })

  test('should show validation errors for invalid email', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<UserForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    
    // Act
    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /save/i }))
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })
})
```

### Component with Context/Providers

```typescript
import { renderWithQuery, screen, waitFor } from '@/tests/utils/test-utils'
import { UserList } from './UserList'

describe('UserList', () => {
  test('should display loading state initially', () => {
    // Act
    renderWithQuery(<UserList />)
    
    // Assert
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  test('should display users from API', async () => {
    // Arrange & Act
    renderWithQuery(<UserList />)
    
    // Assert - Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })
    
    // Assert - Users are displayed
    expect(screen.getByText('User 1')).toBeInTheDocument()
  })
})
```

For complex components needing multiple providers:

```typescript
import { renderWithProviders } from '@/tests/utils/test-utils'

test('should work with query and router', async () => {
  renderWithProviders(<ComplexComponent />, {
    withQuery: true,
    withRouter: true,
    initialRoute: '/users'
  })
  
  // test logic
})
```

## Custom Hook Testing

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { createQueryWrapper } from '@/tests/utils/test-utils'
import { useUsers } from './use-users'

describe('useUsers', () => {
  test('should fetch users successfully', async () => {
    // Arrange
    const wrapper = createQueryWrapper()
    
    // Act
    const { result } = renderHook(() => useUsers({ page: 1, limit: 10 }), { wrapper })
    
    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data?.users).toHaveLength(10)
  })
})
```

## Utility Function Testing

```typescript
import { formatDate, calculateAge } from './date-utils'

describe('date-utils', () => {
  describe('formatDate', () => {
    test('should format date correctly', () => {
      // Arrange
      const date = new Date('2024-01-15')
      
      // Act
      const result = formatDate(date, 'dd/MM/yyyy')
      
      // Assert
      expect(result).toBe('15/01/2024')
    })
  })

  describe('calculateAge', () => {
    test('should calculate age from birthdate', () => {
      // Arrange
      const birthdate = new Date('1990-01-15')
      const today = new Date('2024-01-15')
      
      // Act
      const age = calculateAge(birthdate, today)
      
      // Assert
      expect(age).toBe(34)
    })
  })
})
```

## Test Organization

### Describe Blocks Structure

```typescript
// Top-level: Component/Module name
describe('UserForm', () => {
  
  // Second-level: Feature/Scenario groups
  describe('Form Validation', () => {
    test('should validate email format', () => { /* ... */ })
    test('should validate required fields', () => { /* ... */ })
  })

  describe('Form Submission', () => {
    test('should submit valid data', () => { /* ... */ })
    test('should handle submission errors', () => { /* ... */ })
  })
})
```

### Test Naming Convention

Use descriptive test names starting with "should":
- ✅ `should render user name and email`
- ✅ `should call onSubmit when form is valid`
- ✅ `should display error message on API failure`
- ❌ `test user rendering`
- ❌ `renders correctly`

## Common Testing Scenarios

### Testing Async Operations

```typescript
test('should handle async data fetching', async () => {
  // Arrange
  render(<UserList />)
  
  // Act - wait for data to load
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
  
  // Assert
  expect(screen.getByText('John Doe')).toBeInTheDocument()
})
```

### Testing Error States

```typescript
test('should display error message on fetch failure', async () => {
  // Arrange
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json({ error: 'Server error' }, { status: 500 })
    })
  )
  
  // Act
  render(<UserList />)
  
  // Assert
  await waitFor(() => {
    expect(screen.getByText(/error loading users/i)).toBeInTheDocument()
  })
})
```

### Testing Conditional Rendering

```typescript
test('should show edit button only for admin', () => {
  // Arrange
  const adminUser = { id: '1', role: 'admin' }
  
  // Act
  render(<UserCard user={adminUser} />)
  
  // Assert
  expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
})

test('should hide edit button for regular user', () => {
  // Arrange
  const regularUser = { id: '2', role: 'user' }
  
  // Act
  render(<UserCard user={regularUser} />)
  
  // Assert
  expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
})

test('should show edit button for moderator', () => {
  // Arrange
  const moderatorUser = { id: '3', role: 'moderator' }
  
  // Act
  render(<UserCard user={moderatorUser} />)
  
  // Assert
  expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
})
```

### Testing Side Effects

```typescript
test('should call analytics on button click', async () => {
  // Arrange
  const user = userEvent.setup()
  const mockAnalytics = vi.fn()
  render(<CTAButton onAnalytics={mockAnalytics} />)
  
  // Act
  await user.click(screen.getByRole('button'))
  
  // Assert
  expect(mockAnalytics).toHaveBeenCalledWith('button_clicked', {
    timestamp: expect.any(Number)
  })
})
```
