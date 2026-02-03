import { renderSimple, screen, userEvent } from '@/tests/utils/test-utils'
import { Select } from '../index'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

describe('Select', () => {
  test('renders with placeholder', () => {
    renderSimple(<Select options={options} placeholder="Choose..." />)
    expect(screen.getByText('Choose...')).toBeInTheDocument()
  })

  test('renders selected value when value is provided', () => {
    renderSimple(<Select options={options} value="b" />)
    expect(screen.getByText('Option B')).toBeInTheDocument()
  })

  test('calls onValueChange when option is selected', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    renderSimple(<Select options={options} onValueChange={onValueChange} />)
    const trigger = screen.getByRole('combobox')
    await user.click(trigger)
    const optionB = await screen.findByRole('option', { name: 'Option B' })
    await user.click(optionB)
    expect(onValueChange).toHaveBeenCalledWith('b')
  })

  test('renders disabled when disabled is true', () => {
    renderSimple(<Select options={options} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })
})
