import { renderHook } from '@testing-library/react'
import { useIsMobile } from '../use-mobile'

describe('useIsMobile', () => {
  const mockAddEventListener = vi.fn()
  const mockRemoveEventListener = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }))
  })

  test('returns boolean based on window width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    })
    const { result } = renderHook(() => useIsMobile())
    expect(typeof result.current).toBe('boolean')
  })

  test('registers and cleans up matchMedia listener', () => {
    const { unmount } = renderHook(() => useIsMobile())
    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    unmount()
    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
