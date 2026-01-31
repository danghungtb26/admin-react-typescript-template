import Cookies from 'js-cookie'
import {
  getTheme,
  setTheme,
  getConfig,
  setConfig,
  getAuthenToken,
  setAuthenToken,
  getSidebarCollapsed,
  setSidebarCollapsed,
} from '../cookies'

vi.mock('js-cookie', () => ({
  default: {
    get: vi.fn(),
    set: vi.fn(),
  },
}))

describe('cookies', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe('getAuthenToken / setAuthenToken', () => {
    test('setAuthenToken sets cookie and getAuthenToken reads it', () => {
      setAuthenToken('token123')
      expect(Cookies.set).toHaveBeenCalledWith('AUTHEN_TOKEN_KEY', 'token123')

      vi.mocked(Cookies.get).mockReturnValue('token123')
      expect(getAuthenToken()).toBe('token123')
    })
  })

  describe('getTheme / setTheme', () => {
    test('returns "system" when no theme is set', () => {
      expect(getTheme()).toBe('system')
    })

    test('setTheme and getTheme persist theme', () => {
      setTheme('dark')
      expect(getTheme()).toBe('dark')
      setTheme('light')
      expect(getTheme()).toBe('light')
    })
  })

  describe('getConfig / setConfig', () => {
    test('returns default config when nothing is set', () => {
      const config = getConfig()
      expect(config).toEqual({
        sidebarCollapsed: false,
        fixedHeader: true,
        showTagView: true,
      })
    })

    test('setConfig merges partial config', () => {
      setConfig({ sidebarCollapsed: true })
      expect(getConfig()).toEqual({
        sidebarCollapsed: true,
        fixedHeader: true,
        showTagView: true,
      })
    })

    test('handles invalid JSON in localStorage by returning default', () => {
      localStorage.setItem('config', 'invalid json')
      expect(getConfig()).toEqual({
        sidebarCollapsed: false,
        fixedHeader: true,
        showTagView: true,
      })
    })
  })

  describe('getSidebarCollapsed / setSidebarCollapsed', () => {
    test('getSidebarCollapsed returns config value', () => {
      expect(getSidebarCollapsed()).toBe(false)
      setSidebarCollapsed(true)
      expect(getSidebarCollapsed()).toBe(true)
    })
  })
})
