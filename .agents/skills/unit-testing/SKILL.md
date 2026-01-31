---
name: unit-testing
description: Unit testing guide for React TypeScript projects using Vitest, React Testing Library, and MSW. Use when creating tests, writing test cases, mocking APIs, testing components, hooks, or utilities. Covers AAA pattern, mocking strategies, MSW setup, and coverage guidelines.
keywords: unit-test, vitest, react-testing-library, msw, mock, test, jest, coverage, aaa-pattern
---

# Unit Testing

Guide for writing unit tests using Vitest, React Testing Library, and MSW.

## Quick Start

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
pnpm test:ui        # UI mode
pnpm test:coverage  # Coverage report
```

## Test File Structure

Place test files in `__tests__` folder within the same directory as the source file.

**Naming:** `{name}.test.ts` or `{name}.test.tsx`

```
src/
├── components/
│   └── user-form/
│       ├── index.tsx
│       └── __tests__/
│           └── user-form.test.tsx
├── apis/
│   └── user/
│       ├── hooks/
│       │   ├── use-users.ts
│       │   └── __tests__/
│       │       └── use-users.test.ts
│       └── cores/
│           ├── get-users.ts
│           └── __tests__/
│               └── get-users.test.ts
├── commons/
│   └── validates/
│       ├── user.ts
│       └── __tests__/
│           └── user.test.ts
└── tests/
    ├── setup.ts
    └── mocks/
        ├── server.ts
        └── handlers/
            ├── index.ts
            └── user.handlers.ts
```

**Convention:**

| Type | Location | File Name |
|------|----------|-----------|
| Component | `components/UserForm/__tests__/` | `UserForm.test.tsx` |
| Hook | `hooks/__tests__/` | `use-users.test.ts` |
| API Core | `apis/user/cores/__tests__/` | `get-users.test.ts` |
| Utility | `commons/validates/__tests__/` | `user.test.ts` |
| MSW Handlers | `tests/mocks/handlers/` | `user.handlers.ts` |

## Test Design

### 1. Test Scope

| Type | Description | Ratio |
|------|-------------|-------|
| Unit Test | Isolated function/component | 70% |
| Integration Test | Multiple components together | 20% |
| E2E Test | Full flow UI → API | 10% |

### 2. Test Cases Analysis

| Type | Description | Example |
|------|-------------|---------|
| **Happy Path** | Valid input | Form submits successfully |
| **Edge Cases** | Boundary values | Empty string, max length |
| **Error Cases** | Invalid input | Invalid email, API 500 |
| **State Cases** | Different states | Loading, error, empty |

### 3. Test Matrix

```
UserForm:
├── Rendering
│   ├── should render all fields
│   └── should populate default values
├── Validation
│   ├── should show error for invalid email
│   └── should accept valid data
├── Submission
│   ├── should call onSubmit with form data
│   └── should disable button while submitting
└── User Actions
    └── should call onCancel when cancel clicked
```

**See test case design principles:** `references/test-case-design.md`

### 4. What to Mock

```
Component/Hook
├── External APIs     → MSW
├── Custom Hooks      → vi.mock
├── Context/Providers → Test wrapper
├── Browser APIs      → Mock localStorage, timers
└── Third-party       → Mock i18next, router
```

### 5. Naming Convention

Format: `should [behavior] when [condition]`

```typescript
// ✅ Good
test('should display error when email is invalid')
test('should disable button when submitting')

// ❌ Bad
test('email validation')
test('works correctly')
```

### 6. Coverage Checklist

- [ ] Happy path
- [ ] Validation errors
- [ ] Loading/Error/Empty states
- [ ] User interactions
- [ ] Edge cases

## AAA Pattern

**Always use Arrange-Act-Assert:**

```typescript
test('should update user', async () => {
  // Arrange - Setup test data and mocks
  const user = userEvent.setup()
  const mockOnSubmit = vi.fn()
  
  // Act - Render and execute actions
  render(<UserForm onSubmit={mockOnSubmit} />)
  await user.type(screen.getByLabelText(/name/i), 'John')
  await user.click(screen.getByRole('button', { name: /save/i }))
  
  // Assert - Verify outcome
  expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'John' })
})
```

**Key rules:**
- **Arrange**: Setup data, mocks, create userEvent instance
- **Act**: Render component + user interactions (last action before assertion)
- **Assert**: Verify the outcome (always at the end)
- **One test = One AAA block** (don't repeat AAA within same test)
- **Never use if/else in Assert** - split into separate tests instead

**Full details:** `references/aaa-pattern.md`

## Testing Types

| Type | Tool | Example |
|------|------|---------|
| Component | `render`, `screen`, `userEvent` | `examples/component-test.md` |
| Hook | `renderHook` | `examples/hook-test.md` |
| Utility | Direct call | `examples/utility-test.md` |
| States | Mock hook return | `examples/state-test.md` |
| API Mock | MSW override | `examples/msw-override.md` |

**See details:** `references/examples/`

## Mocking

### vi.fn() - Mock function

```typescript
const mockOnClick = vi.fn()
render(<Button onClick={mockOnClick} />)
await user.click(screen.getByRole('button'))
expect(mockOnClick).toHaveBeenCalledTimes(1)
```

### vi.mock() - Mock module

```typescript
vi.mock('@/hooks/use-users', () => ({
  useUsers: vi.fn()
}))

vi.mocked(useUsers).mockReturnValue({
  data: { users: [] },
  isLoading: false
} as any)
```

**Details:** `references/mocking-guide.md`

## MSW Setup

MSW intercepts HTTP requests for realistic API testing.

```typescript
// Override handler in test
server.use(
  http.get('/api/users', () => {
    return HttpResponse.json({ error: 'Error' }, { status: 500 })
  })
)
```

**Setup details:** `references/msw-setup.md`

## Test Organization

```typescript
describe('UserForm', () => {
  describe('Validation', () => {
    test('should validate email', () => {})
    test('should validate required fields', () => {})
  })
  
  describe('Submission', () => {
    test('should submit valid data', () => {})
  })
})
```

## Best Practices

### ✅ Do

- Use AAA pattern with comments
- Test behavior, not implementation
- Start test names with "should"
- Each test verifies one behavior
- Test error cases
- **Use test.each for similar tests with different inputs**
- **Avoid if/else in tests - split into separate tests**

### ❌ Avoid

- Testing implementation details
- Testing library code (React Query, React Hook Form)
- Vague assertions (`toBeTruthy()`)
- Skipping cleanup
- **Using if/else conditionals in tests**
- **Duplicating test logic - use test.each instead**

## Quick Reference

### Imports

```typescript
import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
```

### Assertions

```typescript
expect(screen.getByText('text')).toBeInTheDocument()
expect(screen.queryByText('text')).not.toBeInTheDocument()
expect(mockFn).toHaveBeenCalledWith('arg')
expect(result).toEqual({ id: '1' })
```

### User Events

```typescript
const user = userEvent.setup()
await user.click(element)
await user.type(element, 'text')
await user.clear(element)
```

## Resources

| File | Content |
|------|---------|
| `references/aaa-pattern.md` | AAA pattern rules & anti-patterns |
| `references/test-case-design.md` | Test case design principles & matrix |
| `references/test-utils.md` | Test utilities & provider helpers |
| `references/advanced-patterns.md` | test.each, avoid if/else patterns |
| `references/testing-patterns.md` | Component, hook, utility patterns |
| `references/mocking-guide.md` | Mock functions, modules, timers |
| `references/msw-setup.md` | MSW setup guide |
| `references/coverage-guide.md` | Coverage goals |
| `references/examples/` | Code examples |
