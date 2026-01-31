# Test Coverage Guidelines

## Coverage Goals

Aim for meaningful coverage that tests critical paths, not arbitrary percentages.

### Priority Levels

**High Priority (Must Test)**
- Business logic functions
- API integration code
- Form validation
- Error handling
- User authentication/authorization flows
- Data transformation utilities

**Medium Priority (Should Test)**
- UI components with complex interactions
- Custom hooks
- State management
- Routing logic
- Utility functions

**Low Priority (Optional)**
- Simple presentational components
- Type definitions
- Constants
- Configuration files

## What to Test

### ✅ Test These

1. **Critical User Flows**
```typescript
// User registration flow
test('should complete user registration', async () => {
  // Arrange
  const user = userEvent.setup()
  
  // Act
  await user.type(screen.getByLabelText(/name/i), 'John Doe')
  await user.type(screen.getByLabelText(/email/i), 'john@example.com')
  await user.type(screen.getByLabelText(/password/i), 'SecurePass123!')
  await user.click(screen.getByRole('button', { name: /register/i }))
  
  // Assert
  await waitFor(() => {
    expect(screen.getByText(/registration successful/i)).toBeInTheDocument()
  })
})
```

2. **Business Logic**
```typescript
// Price calculation
test('should calculate total with discount', () => {
  // Arrange
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 }
  ]
  const discountPercent = 10
  
  // Act
  const total = calculateTotal(items, discountPercent)
  
  // Assert
  expect(total).toBe(225) // (200 + 50) * 0.9
})
```

3. **Error Handling**
```typescript
test('should handle API error gracefully', async () => {
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

4. **Edge Cases**
```typescript
describe('validateEmail', () => {
  test('should accept valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })
  
  test('should reject empty email', () => {
    expect(validateEmail('')).toBe(false)
  })
  
  test('should reject email without @', () => {
    expect(validateEmail('testexample.com')).toBe(false)
  })
  
  test('should reject email without domain', () => {
    expect(validateEmail('test@')).toBe(false)
  })
})
```

5. **Data Transformations**
```typescript
test('should transform API response to UI format', () => {
  // Arrange
  const apiResponse = {
    user_id: '123',
    user_name: 'John Doe',
    created_at: '2024-01-15T10:00:00Z'
  }
  
  // Act
  const result = transformUserData(apiResponse)
  
  // Assert
  expect(result).toEqual({
    id: '123',
    name: 'John Doe',
    createdAt: new Date('2024-01-15T10:00:00Z')
  })
})
```

6. **Conditional Rendering**
```typescript
test('should show edit button only for admin', () => {
  // Arrange & Act - Admin
  render(<UserCard user={{ id: '1', role: 'admin' }} />)
  expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  
  // Arrange & Act - Regular user
  render(<UserCard user={{ id: '2', role: 'user' }} />)
  expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
})
```

### ❌ Don't Waste Time Testing These

1. **Third-party libraries** (React Query, React Hook Form - trust they work)
2. **Simple render-only components** without logic
3. **CSS/styling** (use visual regression testing if needed)
4. **Type definitions** (TypeScript handles this)
5. **Constants and enums**
6. **Auto-generated code** (TanStack Router routes)

## Coverage Metrics

### Component Coverage Checklist

For each important component, ensure:

- [ ] Happy path (normal usage)
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] User interactions (clicks, typing, selections)
- [ ] Form validation (if applicable)
- [ ] Conditional rendering
- [ ] Props variations

### Example: Complete Component Test Suite

```typescript
describe('UserEditForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()
  
  beforeEach(() => {
    mockOnSubmit.mockClear()
    mockOnCancel.mockClear()
  })
  
  // ✅ Happy path
  test('should submit form with valid data', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<UserEditForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Act
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email/i), 'john@example.com')
    await user.click(screen.getByRole('button', { name: /save/i }))
    
    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      })
    })
  })
  
  // ✅ Validation errors
  test('should show error for invalid email', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<UserEditForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Act
    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /save/i }))
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
  
  // ✅ Cancel action
  test('should call onCancel when cancel button clicked', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<UserEditForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Act
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    
    // Assert
    expect(mockOnCancel).toHaveBeenCalled()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })
  
  // ✅ Loading state
  test('should disable submit button while submitting', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<UserEditForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isSubmitting={true} />)
    
    // Assert
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })
  
  // ✅ Default values
  test('should populate form with default values', () => {
    // Arrange
    const defaultValues = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0987654321'
    }
    
    // Act
    render(<UserEditForm defaultValues={defaultValues} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Assert
    expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument()
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('0987654321')).toBeInTheDocument()
  })
  
  // ✅ Required fields
  test('should show error for empty required fields', async () => {
    // Arrange
    const user = userEvent.setup()
    render(<UserEditForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Act
    await user.click(screen.getByRole('button', { name: /save/i }))
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })
})
```

## Hook Coverage Checklist

For custom hooks:

- [ ] Success case with data
- [ ] Loading state
- [ ] Error state
- [ ] Different parameter variations
- [ ] Refetch functionality (if applicable)
- [ ] Caching behavior (if applicable)

### Example: Complete Hook Test Suite

```typescript
describe('useUsers', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
    
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
  
  // ✅ Success case
  test('should fetch users successfully', async () => {
    // Arrange
    const wrapper = createWrapper()
    
    // Act
    const { result } = renderHook(() => useUsers({ page: 1, limit: 10 }), { wrapper })
    
    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data?.users).toHaveLength(10)
  })
  
  // ✅ Loading state
  test('should show loading state initially', () => {
    // Arrange
    const wrapper = createWrapper()
    
    // Act
    const { result } = renderHook(() => useUsers(), { wrapper })
    
    // Assert
    expect(result.current.isLoading).toBe(true)
  })
  
  // ✅ Error state
  test('should handle error', async () => {
    // Arrange
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json({ error: 'Server error' }, { status: 500 })
      })
    )
    const wrapper = createWrapper()
    
    // Act
    const { result } = renderHook(() => useUsers(), { wrapper })
    
    // Assert
    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
  
  // ✅ Different parameters
  test('should fetch with pagination params', async () => {
    // Arrange
    const wrapper = createWrapper()
    
    // Act
    const { result } = renderHook(() => useUsers({ page: 2, limit: 20 }), { wrapper })
    
    // Assert
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data?.page).toBe(2)
    expect(result.current.data?.limit).toBe(20)
  })
})
```

## Utility Function Coverage

For utility functions, test:

- [ ] Normal inputs
- [ ] Edge cases (empty, null, undefined)
- [ ] Boundary values (min, max)
- [ ] Invalid inputs
- [ ] Type variations (if applicable)

```typescript
describe('formatCurrency', () => {
  test('should format positive number', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })
  
  test('should format zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })
  
  test('should format negative number', () => {
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56')
  })
  
  test('should handle large numbers', () => {
    expect(formatCurrency(1234567890)).toBe('$1,234,567,890.00')
  })
  
  test('should round to 2 decimals', () => {
    expect(formatCurrency(123.456)).toBe('$123.46')
  })
})
```

## Coverage Commands

```bash
# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test

# Run tests with UI
pnpm test:ui
```

## Coverage Thresholds

Set reasonable thresholds in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
        'src/routeTree.gen.ts'
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70
      }
    }
  }
})
```

## Test File Organization

```
src/
├── components/
│   ├── UserForm/
│   │   ├── index.tsx
│   │   └── UserForm.test.tsx
├── hooks/
│   ├── use-users.ts
│   └── use-users.test.ts
├── utils/
│   ├── validation.ts
│   └── validation.test.ts
└── tests/
    ├── setup.ts
    └── mocks/
        ├── handlers.ts
        └── server.ts
```

## Coverage Report Interpretation

- **Lines**: Percentage of code lines executed
- **Functions**: Percentage of functions called
- **Branches**: Percentage of if/else paths tested
- **Statements**: Percentage of statements executed

Focus on **branches** to ensure all code paths are tested.
