# Advanced Testing Patterns

## test.each - Parameterized Tests

Use `test.each` when multiple tests share the same logic but differ only in input/output.

### Basic test.each

**❌ Bad - Repetitive tests:**

```typescript
describe('validateEmail', () => {
  test('should accept gmail', () => {
    expect(validateEmail('user@gmail.com')).toBe(true)
  })

  test('should accept yahoo', () => {
    expect(validateEmail('user@yahoo.com')).toBe(true)
  })

  test('should accept company email', () => {
    expect(validateEmail('user@company.co.uk')).toBe(true)
  })
})
```

**✅ Good - Using test.each:**

```typescript
describe('validateEmail', () => {
  test.each([
    { email: 'user@gmail.com', description: 'gmail' },
    { email: 'user@yahoo.com', description: 'yahoo' },
    { email: 'user@company.co.uk', description: 'company email' },
    { email: 'user+tag@example.com', description: 'email with plus sign' }
  ])('should accept $description', ({ email }) => {
    // Arrange & Act & Assert
    expect(validateEmail(email)).toBe(true)
  })

  test.each([
    { email: '', description: 'empty string' },
    { email: 'invalid', description: 'missing @ symbol' },
    { email: 'user@', description: 'missing domain' },
    { email: '@example.com', description: 'missing username' }
  ])('should reject $description', ({ email }) => {
    // Arrange & Act & Assert
    expect(validateEmail(email)).toBe(false)
  })
})
```

### test.each with Table Syntax

```typescript
describe('calculateDiscount', () => {
  test.each`
    price   | discount | expected | description
    ${100}  | ${10}    | ${90}    | ${'10% off 100'}
    ${200}  | ${20}    | ${160}   | ${'20% off 200'}
    ${50}   | ${0}     | ${50}    | ${'no discount'}
    ${1000} | ${50}    | ${500}   | ${'50% off 1000'}
  `('should calculate $description', ({ price, discount, expected }) => {
    // Arrange & Act
    const result = calculateDiscount(price, discount)

    // Assert
    expect(result).toBe(expected)
  })
})
```

### test.each with Complex Objects

```typescript
describe('UserForm validation', () => {
  test.each([
    {
      input: { name: '', email: 'test@example.com' },
      expectedError: 'Name is required',
      description: 'empty name'
    },
    {
      input: { name: 'John', email: '' },
      expectedError: 'Email is required',
      description: 'empty email'
    },
    {
      input: { name: 'John', email: 'invalid' },
      expectedError: 'Invalid email format',
      description: 'invalid email format'
    }
  ])('should show error for $description', async ({ input, expectedError }) => {
    // Arrange
    const user = userEvent.setup()
    renderSimple(<UserForm onSubmit={vi.fn()} />)

    // Act
    await user.clear(screen.getByLabelText(/name/i))
    await user.clear(screen.getByLabelText(/email/i))
    if (input.name) await user.type(screen.getByLabelText(/name/i), input.name)
    if (input.email) await user.type(screen.getByLabelText(/email/i), input.email)
    await user.click(screen.getByRole('button', { name: /submit/i }))

    // Assert
    await waitFor(() => {
      expect(screen.getByText(new RegExp(expectedError, 'i'))).toBeInTheDocument()
    })
  })
})
```

**Note:** `if` in Act section for optional inputs is acceptable (see "If/Else in Tests - Important Rules" below).

### test.each with API Responses

```typescript
describe('UserList with different API states', () => {
  test.each([
    {
      handler: getUsersSuccessHandler,
      expectedText: 'User 1',
      description: 'success state'
    },
    {
      handler: getUsersEmptyHandler,
      expectedText: /no users found/i,
      description: 'empty state'
    },
    {
      handler: getUsersErrorHandler,
      expectedText: /error/i,
      description: 'error state'
    }
  ])('should display $description', async ({ handler, expectedText }) => {
    // Arrange
    server.use(handler)

    // Act
    renderWithQuery(<UserList />)

    // Assert
    await waitFor(() => {
      expect(screen.getByText(expectedText)).toBeInTheDocument()
    })
  })
})
```

## Avoid If/Else in Tests

**Why?** If/else in tests indicates testing multiple scenarios in one test. Split into separate tests.

### ❌ Bad - Using if/else

```typescript
test('should handle user roles', () => {
  const user = getCurrentUser()
  
  if (user.role === 'admin') {
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  } else {
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  }
})
```

### ✅ Good - Separate tests

```typescript
describe('User permissions', () => {
  test('should show delete button for admin', () => {
    // Arrange
    const adminUser = { role: 'admin' }
    
    // Act
    render(<UserCard user={adminUser} />)
    
    // Assert
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  test('should hide delete button for regular user', () => {
    // Arrange
    const regularUser = { role: 'user' }
    
    // Act
    render(<UserCard user={regularUser} />)
    
    // Assert
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })
})
```

### ❌ Don't Use test.each With If/Else in Assertions

Even with `test.each`, avoid if/else in assertions. Split into separate test suites:

```typescript
describe('User permissions - admins', () => {
  test.each([
    { role: 'admin', description: 'admin' },
    { role: 'moderator', description: 'moderator' }
  ])('$description can see delete button', ({ role }) => {
    // Arrange
    const user = { role }
    
    // Act
    render(<UserCard user={user} />)
    
    // Assert
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })
})

describe('User permissions - non-admins', () => {
  test.each([
    { role: 'user', description: 'user' },
    { role: 'guest', description: 'guest' }
  ])('$description cannot see delete button', ({ role }) => {
    // Arrange
    const user = { role }
    
    // Act
    render(<UserCard user={user} />)
    
    // Assert
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
  })
})

### ❌ Bad - Complex conditions

```typescript
test('should validate form', async () => {
  const formData = getFormData()
  
  if (formData.email) {
    if (formData.email.includes('@')) {
      expect(isValid).toBe(true)
    } else {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    }
  } else {
    expect(screen.getByText(/email required/i)).toBeInTheDocument()
  }
})
```

### ✅ Good - Split into separate describe blocks

```typescript
describe('Email validation - valid', () => {
  test('should accept valid email', async () => {
    // Arrange
    const user = userEvent.setup()
    renderSimple(<EmailInput />)
    
    // Act
    await user.type(screen.getByLabelText(/email/i), 'valid@example.com')
    await user.click(screen.getByRole('button', { name: /validate/i }))
    
    // Assert
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('Email validation - errors', () => {
  test.each([
    { email: 'invalid', error: 'Invalid email format', description: 'invalid format' },
    { email: '', error: 'Email is required', description: 'empty email' }
  ])('should show error for $description', async ({ email, error }) => {
    // Arrange
    const user = userEvent.setup()
    renderSimple(<EmailInput />)
    
    // Act
    if (email) {
      await user.type(screen.getByLabelText(/email/i), email)
    }
    await user.click(screen.getByRole('button', { name: /validate/i }))
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(new RegExp(error, 'i'))).toBeInTheDocument()
    })
  })
})

## If/Else in Tests - Important Rules

### ❌ NEVER use if/else in Assert section

```typescript
// WRONG - Testing logic in assertion
test('should validate input', () => {
  const result = validate(input)
  
  if (result.isValid) {
    expect(result.error).toBeUndefined()
  } else {
    expect(result.error).toBeDefined()
  }
})
```

**Fix:** Split into separate tests or test.each with separate describe blocks.

### ⚠️ Acceptable: if in Act section for optional inputs

```typescript
// OK - Handling optional input setup, not testing logic
test.each([
  { name: 'John', email: '', error: 'Email required' },
  { name: '', email: 'test@example.com', error: 'Name required' }
])('should validate $error', async ({ name, email, error }) => {
  // Arrange
  const user = userEvent.setup()
  renderSimple(<Form />)
  
  // Act - Optional input handling is OK
  if (name) await user.type(screen.getByLabelText(/name/i), name)
  if (email) await user.type(screen.getByLabelText(/email/i), email)
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  // Assert - No if/else here!
  expect(screen.getByText(new RegExp(error, 'i'))).toBeInTheDocument()
})
```

### Key Distinction

- **If in Act**: Setting up actions ✅ (acceptable for optional inputs)
- **If in Assert**: Testing logic ❌ (always wrong, split the test)

## When to Use test.each

| Scenario | Use test.each? | Why |
|----------|---------------|-----|
| Same validation, different inputs | ✅ Yes | Reduces duplication |
| Different edge cases | ✅ Yes | Tests all boundaries |
| Different error messages | ✅ Yes | Verifies all error paths |
| Different user roles | ✅ Yes | Tests all permission levels |
| Different API states | ✅ Yes | Tests all response scenarios |
| Completely different logic | ❌ No | Separate tests are clearer |

## Benefits of test.each

1. **DRY (Don't Repeat Yourself)**: Write test logic once
2. **Easy to add cases**: Just add new row to table
3. **Clear failure messages**: Shows which case failed
4. **Better coverage**: Encourages testing edge cases
5. **Maintainable**: Change logic in one place

## test.each Array vs Table Syntax

### Array Syntax (Recommended for complex data)

```typescript
test.each([
  { input: 'data', expected: 'result', description: 'case 1' },
  { input: 'data2', expected: 'result2', description: 'case 2' }
])('$description', ({ input, expected }) => {
  // test code
})
```

**Pros:** Better for complex objects, better IDE support

### Table Syntax (Good for simple data)

```typescript
test.each`
  input    | expected
  ${'a'}   | ${'A'}
  ${'b'}   | ${'B'}
`('converts $input to $expected', ({ input, expected }) => {
  // test code
})
```

**Pros:** Visual table format, easy to read

## Real-World Examples

### HTTP Status Codes

```typescript
describe('API error handling', () => {
  test.each([
    { status: 400, expectedMessage: /bad request/i, description: '400 Bad Request' },
    { status: 401, expectedMessage: /unauthorized/i, description: '401 Unauthorized' },
    { status: 403, expectedMessage: /forbidden/i, description: '403 Forbidden' },
    { status: 404, expectedMessage: /not found/i, description: '404 Not Found' },
    { status: 500, expectedMessage: /server error/i, description: '500 Server Error' }
  ])('should handle $description', async ({ status, expectedMessage }) => {
    // Arrange
    server.use(
      http.get('/api/users', () => {
        return HttpResponse.json({ error: 'Error' }, { status })
      })
    )
    
    // Act
    renderWithQuery(<UserList />)
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(expectedMessage)).toBeInTheDocument()
    })
  })
})
```

### Input Validation Edge Cases

```typescript
describe('Phone validation', () => {
  test.each([
    { phone: '0123456789', valid: true, description: 'valid 10 digits' },
    { phone: '0987654321', valid: true, description: 'valid starting with 09' },
    { phone: '012345678', valid: false, description: '9 digits (too short)' },
    { phone: '01234567890', valid: false, description: '11 digits (too long)' },
    { phone: '012-345-6789', valid: false, description: 'with dashes' },
    { phone: 'abcdefghij', valid: false, description: 'with letters' },
    { phone: '', valid: false, description: 'empty string' }
  ])('$description', ({ phone, valid }) => {
    // Arrange & Act
    const result = validatePhone(phone)
    
    // Assert
    expect(result).toBe(valid)
  })
})
```

### Date Formatting

```typescript
describe('formatDate', () => {
  test.each([
    { date: '2024-01-01', format: 'dd/MM/yyyy', expected: '01/01/2024', description: 'standard date' },
    { date: '2024-12-31', format: 'dd/MM/yyyy', expected: '31/12/2024', description: 'end of year' },
    { date: '2024-02-29', format: 'dd/MM/yyyy', expected: '29/02/2024', description: 'leap year' },
    { date: '2024-01-01', format: 'yyyy-MM-dd', expected: '2024-01-01', description: 'ISO format' },
    { date: '2024-01-01', format: 'MM/dd/yyyy', expected: '01/01/2024', description: 'US format' }
  ])('should format $description', ({ date, format, expected }) => {
    // Arrange
    const dateObj = new Date(date)
    
    // Act
    const result = formatDate(dateObj, format)
    
    // Assert
    expect(result).toBe(expected)
  })
})
```
