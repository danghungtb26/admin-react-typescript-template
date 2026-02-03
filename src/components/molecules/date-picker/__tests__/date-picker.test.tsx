import { renderSimple, screen, userEvent } from '@/tests/utils/test-utils'
import { DatePicker } from '../index'

describe('DatePicker', () => {
  test('renders with placeholder when no value', () => {
    renderSimple(<DatePicker />)
    expect(screen.getByText('Pick a date')).toBeInTheDocument()
  })

  test('renders with custom placeholder', () => {
    renderSimple(<DatePicker placeholder="Select date" />)
    expect(screen.getByText('Select date')).toBeInTheDocument()
  })

  test('renders formatted date when value is provided', () => {
    const date = new Date(2024, 0, 15)
    renderSimple(<DatePicker value={date} />)
    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument()
  })

  test('opens popover when trigger is clicked', async () => {
    const user = userEvent.setup()
    renderSimple(<DatePicker />)
    const trigger = screen.getByRole('button', { name: /pick a date/i })
    await user.click(trigger)
    const calendar = await screen.findByRole('dialog')
    expect(calendar).toBeInTheDocument()
  })

  test('renders disabled when disabled is true', () => {
    renderSimple(<DatePicker disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
