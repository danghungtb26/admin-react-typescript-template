import { renderSimple, screen, userEvent } from '@/tests/utils/test-utils'
import { Drawer } from '../index'

describe('Drawer', () => {
  test('renders title and description when open', () => {
    renderSimple(
      <Drawer open title="Drawer Title" description="Drawer description">
        <p>Drawer content</p>
      </Drawer>
    )
    expect(screen.getByText('Drawer Title')).toBeInTheDocument()
    expect(screen.getByText('Drawer description')).toBeInTheDocument()
    expect(screen.getByText('Drawer content')).toBeInTheDocument()
  })

  test('renders default footer with Confirm and Cancel when showDefaultFooter', () => {
    renderSimple(
      <Drawer open showDefaultFooter>
        <p>Content</p>
      </Drawer>
    )
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  test('calls onOpenChange(false) when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    renderSimple(
      <Drawer open showDefaultFooter onOpenChange={onOpenChange}>
        <p>Content</p>
      </Drawer>
    )
    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
