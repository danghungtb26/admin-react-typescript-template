import { formatMoney } from '../money'

describe('formatMoney', () => {
  test('formats numbers with comma separators', () => {
    expect(formatMoney(1000)).toBe('1,000')
    expect(formatMoney(1000000)).toBe('1,000,000')
    expect(formatMoney(123)).toBe('123')
  })

  test('handles null and undefined by returning empty string', () => {
    expect(formatMoney(null as unknown as number)).toBe('')
    expect(formatMoney(undefined)).toBe('')
  })

  test('handles zero', () => {
    expect(formatMoney(0)).toBe('')
  })

  test('uses custom group size when x is provided', () => {
    expect(formatMoney(1000, 2)).toBe('10,00')
  })

  test('formats large numbers correctly', () => {
    expect(formatMoney(1234567890)).toBe('1,234,567,890')
  })
})
