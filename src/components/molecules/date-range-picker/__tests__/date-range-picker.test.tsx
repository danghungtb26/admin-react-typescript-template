import { renderSimple, screen } from '@/tests/utils/test-utils'

import { DateRangePicker } from '../index'

describe('DateRangePicker', () => {
  test('renders with placeholder when no value', () => {
    renderSimple(<DateRangePicker />)
    expect(screen.getByText('Pick a date range')).toBeInTheDocument()
  })

  test('renders with custom placeholder', () => {
    renderSimple(<DateRangePicker placeholder="Select range" />)
    expect(screen.getByText('Select range')).toBeInTheDocument()
  })

  test('renders formatted range when value is provided', () => {
    const from = new Date(2024, 0, 10)
    const to = new Date(2024, 0, 15)
    renderSimple(<DateRangePicker value={{ from, to }} />)
    expect(screen.getByText(/Jan 10, 2024/)).toBeInTheDocument()
    expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument()
  })

  test('renders disabled when disabled is true', () => {
    renderSimple(<DateRangePicker disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
