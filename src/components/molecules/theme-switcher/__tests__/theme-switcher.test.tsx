import { renderSimple, screen, userEvent } from '@/tests/utils/test-utils'
import { ThemeSwitcher } from '../index'

const mockSetTheme = vi.fn()

vi.mock('@/contexts/setting/context', () => ({
  useSetting: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}))

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  test('renders theme options', () => {
    renderSimple(<ThemeSwitcher />)
    expect(screen.getByLabelText('settings.theme.light')).toBeInTheDocument()
    expect(screen.getByLabelText('settings.theme.dark')).toBeInTheDocument()
    expect(screen.getByLabelText('settings.theme.system')).toBeInTheDocument()
  })

  test('calls setTheme when option is selected', async () => {
    const user = userEvent.setup()
    renderSimple(<ThemeSwitcher />)
    const darkOption = screen.getByLabelText('settings.theme.dark')
    await user.click(darkOption)
    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})
