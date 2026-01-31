import { renderSimple, screen, userEvent } from '@/tests/utils/test-utils'
import { Dialog } from '../index'

describe('Dialog', () => {
  test('renders title and description when open', () => {
    renderSimple(
      <Dialog open title="Test Title" description="Test description">
        <p>Content</p>
      </Dialog>
    )
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  test('renders default footer with Confirm and Cancel when showDefaultFooter', () => {
    renderSimple(
      <Dialog open showDefaultFooter>
        <p>Content</p>
      </Dialog>
    )
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  test('calls onOpenChange(false) when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    renderSimple(
      <Dialog open showDefaultFooter onOpenChange={onOpenChange}>
        <p>Content</p>
      </Dialog>
    )
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  test('calls onConfirm and onOpenChange when Confirm is clicked', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onOpenChange = vi.fn()
    renderSimple(
      <Dialog open showDefaultFooter onConfirm={onConfirm} onOpenChange={onOpenChange}>
        <p>Content</p>
      </Dialog>
    )
    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onConfirm).toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
