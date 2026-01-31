import { renderSimple, screen } from '@/tests/utils/test-utils'
import { CreateUserForm } from '../index'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/apis/user/hooks/use-create-user', () => ({
  useCreateUser: () => ({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  }),
}))

describe('CreateUserForm', () => {
  test('renders UserForm', () => {
    const onCancel = vi.fn()
    renderSimple(<CreateUserForm onCancel={onCancel} />)
    expect(screen.getByLabelText('users.edit_user.fields.name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'common.button.save' })).toBeInTheDocument()
  })
})
