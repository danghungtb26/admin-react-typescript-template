# Test Case Design

## Principles for Defining Test Cases

### 1. Avoid Redundant Checks

**Rule:** Don't test behaviors that are impossible in the current state.

#### ❌ Bad - Testing disabled button's onClick

```typescript
test('should not call onClick when button is disabled', async () => {
  // Arrange
  const user = userEvent.setup()
  const mockOnClick = vi.fn()
  
  // Act
  render(<Button disabled onClick={mockOnClick} />)
  await user.click(screen.getByRole('button'))
  
  // Assert
  expect(mockOnClick).not.toHaveBeenCalled() // Redundant - browser prevents this
})
```

**Why it's bad:** Disabled buttons cannot be clicked by design. This tests browser behavior, not your code.

#### ✅ Good - Test the disabled state itself

```typescript
test('should disable button when loading', () => {
  // Arrange & Act
  render(<Button loading />)
  
  // Assert
  expect(screen.getByRole('button')).toBeDisabled()
})
```

#### Another Example: Loading State

```typescript
// ❌ Bad - Checking multiple redundant things
test('should not allow form submission when loading', async () => {
  const user = userEvent.setup()
  const mockOnSubmit = vi.fn()
  
  render(<Form loading onSubmit={mockOnSubmit} />)
  
  expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  await user.click(screen.getByRole('button', { name: /submit/i }))
  expect(mockOnSubmit).not.toHaveBeenCalled() // Redundant!
})

// ✅ Good - Test state, not impossible interaction
test('should disable submit button when loading', () => {
  // Arrange & Act
  render(<Form loading />)
  
  // Assert
  expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
})
```

### 2. Avoid Testing Equivalent Values

**Rule:** For the same data type with no special logic, one value is enough.

#### ❌ Bad - Testing multiple equivalent numbers

```typescript
describe('Counter', () => {
  test('should display count 1', () => {
    render(<Counter count={1} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  test('should display count 2', () => {
    render(<Counter count={2} />)
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('should display count 4', () => {
    render(<Counter count={4} />)
    expect(screen.getByText('4')).toBeInTheDocument()
  })
})
```

**Why it's bad:** Testing 1, 2, 4 doesn't add value - they're all positive integers with no special logic.

#### ✅ Good - Test one representative value

```typescript
test('should display count value', () => {
  // Arrange & Act
  render(<Counter count={5} />)
  
  // Assert
  expect(screen.getByText('5')).toBeInTheDocument()
})
```

#### When to Test Multiple Values

Only when values have **different behavior** or **special meaning**:

```typescript
describe('Badge color by priority', () => {
  test.each([
    { priority: 'low', expectedColor: 'green' },
    { priority: 'medium', expectedColor: 'orange' },
    { priority: 'high', expectedColor: 'red' }
  ])('should show $expectedColor badge for $priority', ({ priority, expectedColor }) => {
    // Arrange & Act
    render(<PriorityBadge priority={priority} />)
    
    // Assert
    expect(screen.getByTestId('badge')).toHaveClass(`bg-${expectedColor}`)
  })
})
```

**Why this is good:** Each priority has different visual behavior.

### 3. Test Boundary Values

**Rule:** When there's a condition with boundaries, test the edges.

#### Boundary Testing Strategy

For conditions like `if (value >= 100)`, test:
- Below boundary: `99`
- At boundary: `100`
- Above boundary: `101`

#### Example: Password Strength

```typescript
describe('Password strength validation', () => {
  test.each([
    { 
      input: 'short',
      expected: 'weak',
      description: 'below minimum (5 chars)'
    },
    { 
      input: 'medium12',
      expected: 'medium',
      description: 'at minimum (8 chars)'
    },
    { 
      input: 'verystrongpass123',
      expected: 'strong',
      description: 'above maximum (12+ chars)'
    }
  ])('should return $expected for $description', ({ input, expected }) => {
    // Arrange & Act
    const result = getPasswordStrength(input)
    
    // Assert
    expect(result).toBe(expected)
  })
})
```

#### Example: Discount Based on Cart Total

```typescript
describe('Cart discount', () => {
  test.each([
    { total: 99, discount: 0, description: 'below $100 (no discount)' },
    { total: 100, discount: 10, description: 'exactly $100 (10% off)' },
    { total: 101, discount: 10, description: 'above $100 (10% off)' },
    { total: 499, discount: 10, description: 'below $500 (still 10%)' },
    { total: 500, discount: 20, description: 'exactly $500 (20% off)' },
    { total: 501, discount: 20, description: 'above $500 (20% off)' }
  ])('$description: $total should get $discount% discount', ({ total, discount }) => {
    // Arrange & Act
    const result = calculateDiscount(total)
    
    // Assert
    expect(result).toBe(discount)
  })
})
```

### 4. Test All Enum/Union Type Values

**Rule:** For enums or union types, test every possible value using `test.each`.

#### Example: User Role Permissions

```typescript
type UserRole = 'admin' | 'moderator' | 'user' | 'guest'

describe('User permissions by role', () => {
  test.each([
    { 
      role: 'admin' as UserRole,
      canDelete: true,
      canEdit: true,
      canView: true
    },
    { 
      role: 'moderator' as UserRole,
      canDelete: false,
      canEdit: true,
      canView: true
    },
    { 
      role: 'user' as UserRole,
      canDelete: false,
      canEdit: false,
      canView: true
    },
    { 
      role: 'guest' as UserRole,
      canDelete: false,
      canEdit: false,
      canView: false
    }
  ])('$role: delete=$canDelete, edit=$canEdit, view=$canView', 
    ({ role, canDelete, canEdit, canView }) => {
      // Arrange
      const user = { role }
      
      // Act
      render(<UserDashboard user={user} />)
      
      // Assert
      const deleteBtn = screen.queryByRole('button', { name: /delete/i })
      const editBtn = screen.queryByRole('button', { name: /edit/i })
      const content = screen.queryByTestId('content')
      
      if (canDelete) {
        expect(deleteBtn).toBeInTheDocument()
      } else {
        expect(deleteBtn).not.toBeInTheDocument()
      }
      
      if (canEdit) {
        expect(editBtn).toBeInTheDocument()
      } else {
        expect(editBtn).not.toBeInTheDocument()
      }
      
      if (canView) {
        expect(content).toBeInTheDocument()
      } else {
        expect(content).not.toBeInTheDocument()
      }
    }
  )
})
```

**Wait!** This violates the "no if/else in Assert" rule. Let's fix it:

#### ✅ Better - Split by behavior

```typescript
describe('User permissions - can delete', () => {
  test.each([
    { role: 'admin' as UserRole }
  ])('$role can see delete button', ({ role }) => {
    // Arrange & Act
    render(<UserDashboard user={{ role }} />)
    
    // Assert
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })
})

describe('User permissions - cannot delete', () => {
  test.each([
    { role: 'moderator' as UserRole },
    { role: 'user' as UserRole },
    { role: 'guest' as UserRole }
  ])('$role cannot see delete button', ({ role }) => {
    // Arrange & Act
    render(<UserDashboard user={{ role }} />)
    
    // Assert
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })
})

describe('User permissions - can edit', () => {
  test.each([
    { role: 'admin' as UserRole },
    { role: 'moderator' as UserRole }
  ])('$role can see edit button', ({ role }) => {
    // Arrange & Act
    render(<UserDashboard user={{ role }} />)
    
    // Assert
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
  })
})

describe('User permissions - cannot edit', () => {
  test.each([
    { role: 'user' as UserRole },
    { role: 'guest' as UserRole }
  ])('$role cannot see edit button', ({ role }) => {
    // Arrange & Act
    render(<UserDashboard user={{ role }} />)
    
    // Assert
    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
  })
})
```

#### Example: HTTP Status Codes (Enum-like)

```typescript
describe('API error handling', () => {
  test.each([
    { status: 400, expectedMessage: 'Bad Request' },
    { status: 401, expectedMessage: 'Unauthorized' },
    { status: 403, expectedMessage: 'Forbidden' },
    { status: 404, expectedMessage: 'Not Found' },
    { status: 500, expectedMessage: 'Internal Server Error' },
    { status: 503, expectedMessage: 'Service Unavailable' }
  ])('should handle $status error', async ({ status, expectedMessage }) => {
    // Arrange
    server.use(
      http.get('/api/data', () => HttpResponse.json({ error: 'Error' }, { status }))
    )
    
    // Act
    renderWithQuery(<DataFetcher />)
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(expectedMessage)).toBeInTheDocument()
    })
  })
})
```

### 5. Test Nullable and Undefined Values

**Rule:** If a value can be `null` or `undefined`, you must test those cases.

#### Example: Optional User Data

```typescript
describe('UserProfile with optional data', () => {
  test.each([
    {
      input: { name: 'John', avatar: 'avatar.jpg' },
      expectedAvatar: true,
      description: 'with avatar'
    },
    {
      input: { name: 'John', avatar: null },
      expectedAvatar: false,
      description: 'with null avatar'
    },
    {
      input: { name: 'John', avatar: undefined },
      expectedAvatar: false,
      description: 'with undefined avatar'
    },
    {
      input: { name: 'John' },
      expectedAvatar: false,
      description: 'without avatar field'
    }
  ])('should render correctly $description', ({ input, expectedAvatar }) => {
    // Arrange & Act
    render(<UserProfile user={input} />)
    
    // Assert
    expect(screen.getByText('John')).toBeInTheDocument()
    
    const avatar = screen.queryByTestId('user-avatar')
    if (expectedAvatar) {
      expect(avatar).toBeInTheDocument()
    } else {
      expect(avatar).not.toBeInTheDocument()
    }
  })
})
```

**Better - Split into separate describes:**

```typescript
describe('UserProfile - with avatar', () => {
  test('should display avatar when provided', () => {
    // Arrange & Act
    render(<UserProfile user={{ name: 'John', avatar: 'avatar.jpg' }} />)
    
    // Assert
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument()
  })
})

describe('UserProfile - without avatar', () => {
  test.each([
    { avatar: null, description: 'null' },
    { avatar: undefined, description: 'undefined' },
    { description: 'missing field' }
  ])('should show default avatar when avatar is $description', ({ avatar }) => {
    // Arrange
    const user = avatar === undefined && !('avatar' in {})
      ? { name: 'John' }
      : { name: 'John', avatar }
    
    // Act
    render(<UserProfile user={user} />)
    
    // Assert
    expect(screen.queryByTestId('user-avatar')).not.toBeInTheDocument()
    expect(screen.getByTestId('default-avatar')).toBeInTheDocument()
  })
})
```

#### Example: Optional Callback Props

```typescript
describe('Button with optional onClick', () => {
  test('should call onClick when provided', async () => {
    // Arrange
    const user = userEvent.setup()
    const mockOnClick = vi.fn()
    
    // Act
    render(<Button onClick={mockOnClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))
    
    // Assert
    expect(mockOnClick).toHaveBeenCalledOnce()
  })

  test('should not crash when onClick is undefined', async () => {
    // Arrange
    const user = userEvent.setup()
    
    // Act & Assert - Should not throw
    render(<Button>Click me</Button>)
    await user.click(screen.getByRole('button'))
    
    // No assertion needed - test passes if no error thrown
  })
})
```

## Test Case Matrix Template

Use this template to plan your test cases:

```
Feature: [Feature Name]
Component/Function: [Name]

Input Combinations:
┌─────────────────┬──────────────────┬─────────────────┬─────────────┐
│ Input           │ Expected Output  │ Test Priority   │ Test Case   │
├─────────────────┼──────────────────┼─────────────────┼─────────────┤
│ Valid email     │ No error         │ High            │ Happy path  │
│ Empty string    │ "Required"       │ High            │ Boundary    │
│ Invalid format  │ "Invalid email"  │ High            │ Validation  │
│ null            │ "Required"       │ Medium          │ Nullable    │
│ undefined       │ "Required"       │ Medium          │ Nullable    │
│ Very long       │ "Too long"       │ Low             │ Edge case   │
└─────────────────┴──────────────────┴─────────────────┴─────────────┘
```

### Example: Email Validation Matrix

```typescript
describe('Email validation', () => {
  test.each([
    // Happy path
    {
      input: 'user@example.com',
      expectedOutput: true,
      description: 'valid email'
    },
    
    // Boundary cases
    {
      input: '',
      expectedOutput: false,
      description: 'empty string'
    },
    {
      input: 'a@b.c',
      expectedOutput: true,
      description: 'minimum valid length'
    },
    
    // Invalid formats
    {
      input: 'invalid',
      expectedOutput: false,
      description: 'no @ symbol'
    },
    {
      input: '@example.com',
      expectedOutput: false,
      description: 'missing local part'
    },
    {
      input: 'user@',
      expectedOutput: false,
      description: 'missing domain'
    },
    {
      input: 'user@example',
      expectedOutput: false,
      description: 'missing TLD'
    },
    
    // Nullable cases
    {
      input: null,
      expectedOutput: false,
      description: 'null value'
    },
    {
      input: undefined,
      expectedOutput: false,
      description: 'undefined value'
    }
  ])('should return $expectedOutput for $description', ({ input, expectedOutput }) => {
    // Arrange & Act
    const result = validateEmail(input)
    
    // Assert
    expect(result).toBe(expectedOutput)
  })
})
```

## test.each Format Recommendation

### Simple Format (Inline)

```typescript
test.each([
  { input: 'a', expected: 'A' },
  { input: 'b', expected: 'B' }
])('converts $input to $expected', ({ input, expected }) => {
  expect(transform(input)).toBe(expected)
})
```

### Detailed Format (Multi-line)

```typescript
test.each([
  {
    input: 'valid@example.com',
    expectedOutput: true,
    expectedError: null,
    description: 'valid email'
  },
  {
    input: 'invalid',
    expectedOutput: false,
    expectedError: 'Invalid format',
    description: 'invalid format'
  }
])('$description', ({ input, expectedOutput, expectedError }) => {
  // Test implementation
})
```

### Grouped by Behavior

```typescript
// Group 1: Valid inputs
describe('Valid inputs', () => {
  test.each([
    { input: 'value1', description: 'case 1' },
    { input: 'value2', description: 'case 2' }
  ])('should accept $description', ({ input }) => {
    // Test
  })
})

// Group 2: Invalid inputs
describe('Invalid inputs', () => {
  test.each([
    { input: null, error: 'Required', description: 'null' },
    { input: '', error: 'Required', description: 'empty' }
  ])('should reject $description with "$error"', ({ input, error }) => {
    // Test
  })
})
```

## Quick Checklist

Before writing tests, ask yourself:

- [ ] Am I testing redundant behavior? (e.g., disabled button can't be clicked)
- [ ] Am I testing equivalent values? (e.g., multiple similar numbers)
- [ ] Have I identified all boundary values?
- [ ] Have I covered all enum/union type values?
- [ ] Have I tested null/undefined if the value is nullable?
- [ ] Can I use `test.each` to reduce duplication?
- [ ] Should I split `test.each` into separate describes to avoid if/else?

## Summary

| Principle | Rule | Example |
|-----------|------|---------|
| **Avoid Redundancy** | Don't test impossible interactions | Don't test onClick on disabled button |
| **Avoid Equivalence** | One value per type unless special logic | Test `count={1}`, not 1, 2, 4 |
| **Test Boundaries** | Test edges of conditions | For `>= 100`: test 99, 100, 101 |
| **Cover All Enums** | Test every enum/union value | All user roles: admin, moderator, user, guest |
| **Test Nullability** | If nullable, test null/undefined | Test `avatar: null` and `avatar: undefined` |
| **Use test.each** | Reduce duplication for similar tests | Group related test cases together |
| **Split by Behavior** | Avoid if/else in assertions | Separate describe blocks for different outcomes |
