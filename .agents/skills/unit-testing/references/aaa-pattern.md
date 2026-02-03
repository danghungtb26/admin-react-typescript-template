# AAA Pattern Guidelines

## Structure

Every test should follow Arrange-Act-Assert pattern with exactly **one AAA block**.

```typescript
test('should do something', () => {
  // Arrange - Setup
  
  // Act - Execute
  
  // Assert - Verify
})
```

## What Goes Where

### Arrange (Setup)

- Create test data
- Create mock functions (`vi.fn()`)
- Setup userEvent instance
- Configure test state
- Setup MSW handlers (optional)

```typescript
// Arrange
const user = userEvent.setup()
const mockOnSubmit = vi.fn()
const testData = { name: 'John', email: 'john@example.com' }
```

### Act (Execute)

- Render component
- User interactions (click, type, etc.)
- Function calls
- **Last action before verification**

```typescript
// Act
render(<UserForm onSubmit={mockOnSubmit} />)
await user.type(screen.getByLabelText(/name/i), 'John')
await user.click(screen.getByRole('button', { name: /save/i }))
```

### Assert (Verify)

- Check component output
- Verify function calls
- Check state changes
- **Always at the end**

```typescript
// Assert
expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'John' })
expect(screen.getByText(/success/i)).toBeInTheDocument()
```

## Common Patterns

### Simple Render Test

```typescript
test('should render button', () => {
  // Arrange
  const label = 'Click me'
  
  // Act
  render(<Button>{label}</Button>)
  
  // Assert
  expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
})
```

### Async User Interaction

```typescript
test('should submit form', async () => {
  // Arrange
  const user = userEvent.setup()
  const mockOnSubmit = vi.fn()
  
  // Act
  render(<Form onSubmit={mockOnSubmit} />)
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  // Assert
  await waitFor(() => {
    expect(mockOnSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
  })
})
```

### With MSW Handler Override

```typescript
test('should display error on API failure', async () => {
  // Arrange
  server.use(getUsersErrorHandler)
  
  // Act
  renderWithQuery(<UserList />)
  
  // Assert
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })
})
```

### Hook Testing

```typescript
test('should fetch data', async () => {
  // Arrange
  const wrapper = createQueryWrapper()
  
  // Act
  const { result } = renderHook(() => useUsers({ page: 1 }), { wrapper })
  
  // Assert
  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data?.users).toHaveLength(10)
})
```

## When Arrange & Act Can Be Combined

For very simple tests without setup:

```typescript
test('should accept valid email', () => {
  // Arrange & Act
  const result = validateEmail('test@example.com')
  
  // Assert
  expect(result).toBe(true)
})
```

Or when just rendering:

```typescript
test('should show loading state', () => {
  // Arrange & Act
  renderWithQuery(<UserList />)
  
  // Assert
  expect(screen.getByText(/loading/i)).toBeInTheDocument()
})
```

## Anti-Patterns

### ❌ Multiple AAA Blocks in One Test

```typescript
test('should handle both admin and user', () => {
  // Arrange - Admin
  const admin = { role: 'admin' }
  
  // Act
  render(<UserCard user={admin} />)
  
  // Assert
  expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  
  // Arrange - User (WRONG!)
  const user = { role: 'user' }
  
  // Act
  render(<UserCard user={user} />)
  
  // Assert
  expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
})
```

**✅ Fix: Split into separate tests**

```typescript
test('should show delete button for admin', () => {
  // Arrange
  const admin = { role: 'admin' }
  
  // Act
  render(<UserCard user={admin} />)
  
  // Assert
  expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
})

test('should hide delete button for user', () => {
  // Arrange
  const user = { role: 'user' }
  
  // Act
  render(<UserCard user={user} />)
  
  // Assert
  expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
})
```

### ❌ Render in Arrange

```typescript
test('should submit form', async () => {
  // Arrange
  const user = userEvent.setup()
  const mockOnSubmit = vi.fn()
  render(<Form onSubmit={mockOnSubmit} />) // WRONG! This is an action
  
  // Act
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  // Assert
  expect(mockOnSubmit).toHaveBeenCalled()
})
```

**✅ Fix: Move render to Act**

```typescript
test('should submit form', async () => {
  // Arrange
  const user = userEvent.setup()
  const mockOnSubmit = vi.fn()
  
  // Act
  render(<Form onSubmit={mockOnSubmit} />)
  await user.type(screen.getByLabelText(/email/i), 'test@example.com')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  // Assert
  expect(mockOnSubmit).toHaveBeenCalled()
})
```

### ❌ Assert in Act

```typescript
test('should show validation error', async () => {
  // Arrange
  const user = userEvent.setup()
  
  // Act
  render(<Form />)
  await user.type(screen.getByLabelText(/email/i), 'invalid')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  expect(screen.getByText(/invalid email/i)).toBeInTheDocument() // WRONG! This is assertion
})
```

**✅ Fix: Move assertion to Assert section**

```typescript
test('should show validation error', async () => {
  // Arrange
  const user = userEvent.setup()
  
  // Act
  render(<Form />)
  await user.type(screen.getByLabelText(/email/i), 'invalid')
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  // Assert
  await waitFor(() => {
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
  })
})
```

## Key Rules

1. **One test = One AAA block** - Never repeat AAA within same test
2. **Arrange first** - All setup at the top
3. **Act last before Assert** - Final action(s) that trigger the behavior
4. **Render is Act** - Component rendering is an action, not setup
5. **Assert at end** - All verifications after actions complete
6. **Clear comments** - Always label each section

## Benefits

✅ **Readable** - Clear structure, easy to understand
✅ **Maintainable** - Changes are isolated to specific sections
✅ **Debuggable** - Easy to identify what failed
✅ **Consistent** - All tests follow same pattern
