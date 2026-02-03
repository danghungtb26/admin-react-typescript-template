import { renderHook } from '@testing-library/react'
import { useMediaQuery } from 'react-responsive'
import { useMobile } from '../media'

vi.mock('react-responsive', () => ({
  useMediaQuery: vi.fn(),
}))

describe('useMobile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('returns true when media query matches mobile', () => {
    vi.mocked(useMediaQuery).mockReturnValue(true)
    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(true)
  })

  test('returns false when media query does not match mobile', () => {
    vi.mocked(useMediaQuery).mockReturnValue(false)
    const { result } = renderHook(() => useMobile())
    expect(result.current).toBe(false)
  })

  test('calls useMediaQuery with max-width 768px', () => {
    renderHook(() => useMobile())
    expect(useMediaQuery).toHaveBeenCalledWith({
      query: '(max-width: 768px)',
    })
  })
})
