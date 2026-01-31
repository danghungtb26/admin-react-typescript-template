# Utility Function Test

**File:** `src/commons/validates/__tests__/user.test.ts`

```typescript
import { validateEmail, formatDate } from '../user'

describe('validateEmail', () => {
  // ✅ Good - Using test.each for multiple similar tests
  test.each([
    { email: 'test@example.com', description: 'standard email' },
    { email: 'user+tag@mail.example.com', description: 'email with plus sign' },
    { email: 'user.name@company.co.uk', description: 'email with dot and subdomain' }
  ])('should accept $description', ({ email }) => {
    // Arrange & Act & Assert
    expect(validateEmail(email)).toBe(true)
  })

  test.each([
    { email: '', description: 'empty string' },
    { email: 'invalid', description: 'missing @ symbol' },
    { email: 'user@', description: 'missing domain' },
    { email: '@example.com', description: 'missing username' },
    { email: 'user @example.com', description: 'space in email' }
  ])('should reject $description', ({ email }) => {
    // Arrange & Act & Assert
    expect(validateEmail(email)).toBe(false)
  })
})

describe('formatDate', () => {
  test.each([
    {
      date: '2024-01-15',
      format: 'dd/MM/yyyy',
      expected: '15/01/2024',
      description: 'standard format'
    },
    {
      date: '2024-12-31',
      format: 'dd/MM/yyyy',
      expected: '31/12/2024',
      description: 'end of year'
    },
    {
      date: '2024-02-29',
      format: 'dd/MM/yyyy',
      expected: '29/02/2024',
      description: 'leap year date'
    }
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

**Why test.each?** Multiple test cases share identical logic but differ only in input/output. Using `test.each` reduces duplication and makes it easy to add new test cases.
