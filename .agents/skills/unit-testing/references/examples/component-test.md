# Component Test

**File:** `src/components/UserForm/__tests__/UserForm.test.tsx`

```typescript
import { renderSimple, screen, waitFor, userEvent } from '@/tests/utils/test-utils'
import { UserForm } from '../index'

describe('UserForm', () => {
  test('should submit form with valid data', async () => {
    // Arrange
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    renderSimple(<UserForm onSubmit={mockOnSubmit} onCancel={vi.fn()} />)

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

  test('should show validation error for invalid email', async () => {
    // Arrange
    const user = userEvent.setup()
    renderSimple(<UserForm onSubmit={vi.fn()} onCancel={vi.fn()} />)

    // Act
    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.click(screen.getByRole('button', { name: /save/i }))

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
    })
  })

  test('should disable submit button while submitting', () => {
    // Arrange & Act
    renderSimple(<UserForm onSubmit={vi.fn()} onCancel={vi.fn()} isSubmitting={true} />)

    // Assert
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled()
  })
})
```

**Why `renderSimple`?** Form component uses React Hook Form which doesn't require providers. Using `renderSimple` keeps tests fast and focused.
