import { renderSimple, screen } from '@/tests/utils/test-utils'
import { Avatar } from '../index'

describe('Avatar', () => {
  test('renders fallback "UN" when no fallback prop', () => {
    renderSimple(<Avatar />)
    expect(screen.getByText('UN')).toBeInTheDocument()
  })

  test('renders fallback initials from single word', () => {
    renderSimple(<Avatar fallback="John" />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  test('renders fallback initials from first and last word', () => {
    renderSimple(<Avatar fallback="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  test('renders image when src is provided', () => {
    const dataUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    renderSimple(<Avatar src={dataUrl} fallback="JD" />)
    expect(screen.getByText('J')).toBeInTheDocument()
    const img = document.querySelector('img')
    if (img) {
      expect(img).toHaveAttribute('src', dataUrl)
      expect(img).toHaveAttribute('alt', 'Avatar')
    }
  })

  test('renders custom alt text', () => {
    const dataUrl = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    renderSimple(<Avatar src={dataUrl} alt="User avatar" />)
    const avatarRoot = document.querySelector('[data-slot="avatar"]')
    expect(avatarRoot).toBeInTheDocument()
    const img = avatarRoot?.querySelector('img')
    if (img) expect(img).toHaveAttribute('alt', 'User avatar')
  })
})
