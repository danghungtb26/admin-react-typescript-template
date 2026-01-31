import { renderSimple, screen } from '@/tests/utils/test-utils'
import LanguageSwitcher from '../index'

describe('LanguageSwitcher', () => {
  test('renders trigger button', () => {
    renderSimple(<LanguageSwitcher />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  test('shows current language name when variant is full', () => {
    renderSimple(<LanguageSwitcher variant="full" />)
    expect(screen.getByText('English')).toBeInTheDocument()
  })
})
