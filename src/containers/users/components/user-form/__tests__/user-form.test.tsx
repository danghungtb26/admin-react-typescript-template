import { renderSimple, screen, userEvent } from '@/tests/utils/test-utils'
import { UserForm } from '../index'

describe('UserForm', () => {
  test('renders form fields', () => {
    const onSubmit = vi.fn()
    const onCancel = vi.fn()
    renderSimple(<UserForm onSubmit={onSubmit} onCancel={onCancel} />)

    expect(screen.getByLabelText('users.edit_user.fields.name')).toBeInTheDocument()
    expect(screen.getByLabelText('users.edit_user.fields.email')).toBeInTheDocument()
    expect(screen.getByLabelText('users.edit_user.fields.phone')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.button.cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.button.save' })).toBeInTheDocument()
  })

  test('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    renderSimple(<UserForm onSubmit={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: 'common.button.cancel' }))
    expect(onCancel).toHaveBeenCalled()
  })

  test('shows validation errors when submitting empty required fields', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderSimple(<UserForm onSubmit={onSubmit} onCancel={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'common.button.save' }))
    const errors = await screen.findAllByText(/Name is required|Invalid email address/)
    expect(errors.length).toBeGreaterThanOrEqual(1)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  test('calls onSubmit with form data when valid', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    renderSimple(<UserForm onSubmit={onSubmit} onCancel={vi.fn()} />)

    await user.type(screen.getByLabelText('users.edit_user.fields.name'), 'John Doe')
    await user.type(screen.getByLabelText('users.edit_user.fields.email'), 'john@example.com')
    await user.click(screen.getByRole('button', { name: 'common.button.save' }))

    await vi.waitFor(
      () => {
        expect(onSubmit).toHaveBeenCalled()
        const [firstArg] = onSubmit.mock.calls[0]
        expect(firstArg).toMatchObject({
          name: 'John Doe',
          email: 'john@example.com',
        })
      },
      { timeout: 2000 }
    )
  })
})
