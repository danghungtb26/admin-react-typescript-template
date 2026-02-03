import { renderSimple, screen, userEvent } from '@/tests/utils/test-utils'
import { Pagination } from '../index'

describe('Pagination', () => {
  test('renders current page and total pages', () => {
    renderSimple(<Pagination currentPage={1} totalPages={10} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  test('calls onPageChange when page is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    renderSimple(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    )
    const page2 = screen.getByRole('link', { name: '2' })
    await user.click(page2)
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  test('does not call onPageChange when clicking current page', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    renderSimple(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />
    )
    const page2 = screen.getByRole('link', { name: '2' })
    await user.click(page2)
    expect(onPageChange).not.toHaveBeenCalled()
  })

  test('renders single page without extra navigation', () => {
    renderSimple(<Pagination currentPage={1} totalPages={1} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
