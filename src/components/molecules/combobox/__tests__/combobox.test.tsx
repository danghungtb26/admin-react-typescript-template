import { renderSimple, screen, userEvent } from '@/tests/utils/test-utils'
import { Combobox } from '../index'

const options = [
  { value: '1', label: 'Option One' },
  { value: '2', label: 'Option Two', description: 'Second option' },
]

describe('Combobox', () => {
  test('renders with placeholder when no value', () => {
    renderSimple(<Combobox options={options} />)
    expect(screen.getByText('Select option...')).toBeInTheDocument()
  })

  test('renders selected label when value is provided', () => {
    renderSimple(<Combobox options={options} value="2" />)
    expect(screen.getByText('Option Two')).toBeInTheDocument()
  })

  test('has combobox role and aria-expanded', () => {
    renderSimple(<Combobox options={options} />)
    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('calls onValueChange when option is selected', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderSimple(<Combobox options={options} onValueChange={onValueChange} />)
    await user.click(screen.getByRole('combobox'))
    const optionOne = await screen.findByText('Option One')
    await user.click(optionOne)
    expect(onValueChange).toHaveBeenCalledWith('1')
  })

  test('renders disabled when disabled is true', () => {
    renderSimple(<Combobox options={options} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  test('shows empty text when no options match search', async () => {
    const user = userEvent.setup()
    renderSimple(<Combobox options={options} emptyText="No results" />)
    await user.click(screen.getByRole('combobox'))
    const searchInput = screen.getByPlaceholderText('Search...')
    await user.type(searchInput, 'xyz')
    expect(await screen.findByText('No results')).toBeInTheDocument()
  })
})
