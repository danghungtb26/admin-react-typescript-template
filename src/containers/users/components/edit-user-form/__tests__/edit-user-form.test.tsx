import { renderWithQuery, screen } from '@/tests/utils/test-utils'
import { EditUserForm } from '../index'

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockUserData = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '0123456789',
  avatar: '',
  birthday: '1990-01-15',
  gender: 'male' as const,
}

vi.mock('@/apis/user/hooks/use-user-by-id', () => ({
  useUserById: (userId: string) => ({
    data: userId === '1' ? mockUserData : undefined,
    isLoading: false,
  }),
}))

vi.mock('@/apis/user/hooks/use-update-user', () => ({
  useUpdateUser: () => ({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
    isPending: false,
  }),
}))

describe('EditUserForm', () => {
  test('renders UserForm with user data when loaded', () => {
    const onCancel = vi.fn()
    renderWithQuery(<EditUserForm userId="1" onCancel={onCancel} />)
    expect(screen.getByLabelText('users.edit_user.fields.name')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
  })
})
