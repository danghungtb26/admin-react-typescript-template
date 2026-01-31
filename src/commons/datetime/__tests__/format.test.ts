import { formatDate, formatScheduleTime, DD_MM_YYYY } from '../format'

describe('formatDate', () => {
  test('formats date with default format', () => {
    const result = formatDate('2024-01-15T10:30:00.000Z')
    expect(result).toMatch(/\d{2}:\d{2}:\d{2} \d{2}-\d{2}-\d{4}/)
  })

  test('formats date with custom format', () => {
    const result = formatDate('2024-01-15', DD_MM_YYYY)
    expect(result).toBe('15-01-2024')
  })
})

describe('formatScheduleTime', () => {
  test('returns same day format when start and end are same day', () => {
    const start = '2024-01-15T09:00:00.000Z'
    const end = '2024-01-15T17:00:00.000Z'
    const result = formatScheduleTime(start, end)
    expect(result).toContain('09:00')
    expect(result).toContain('17:00')
    expect(result).toContain('15-01-2024')
  })

  test('returns different day format when start and end are different days', () => {
    const start = '2024-01-15T09:00:00.000Z'
    const end = '2024-01-16T17:00:00.000Z'
    const result = formatScheduleTime(start, end)
    expect(result).toContain('15-01-2024')
    expect(result).toContain('16-01-2024')
  })
})
