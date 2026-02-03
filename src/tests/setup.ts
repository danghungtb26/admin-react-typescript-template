import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, afterAll, beforeAll, vi } from 'vitest'
import { server } from './mocks/server'

// ResizeObserver is not available in jsdom
class ResizeObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock)

// Pointer capture for Radix/vaul in jsdom (elements need these methods)
if (typeof Element !== 'undefined') {
  Element.prototype.setPointerCapture = vi.fn()
  Element.prototype.releasePointerCapture = vi.fn()
  Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false)
  Element.prototype.scrollIntoView = vi.fn()
}

// vaul (drawer) getTranslate calls .match() on style value - jsdom may return undefined
if (typeof window !== 'undefined' && window.getComputedStyle) {
  const originalGetComputedStyle = window.getComputedStyle.bind(window)
  window.getComputedStyle = (el: Element) => {
    const s = originalGetComputedStyle(el)
    const origGetPropertyValue = s.getPropertyValue?.bind(s)
    return new Proxy(s, {
      get(target, prop) {
        if (prop === 'getPropertyValue' && origGetPropertyValue) {
          return (name: string) => {
            const v = origGetPropertyValue(name)
            if (name === 'transform' && (v === undefined || v === null || v === ''))
              return 'none'
            return v
          }
        }
        const v = Reflect.get(target, prop)
        if (prop === 'transform' && (v === undefined || v === null || v === '')) return 'none'
        return v
      },
    }) as CSSStyleDeclaration
  }
}

// Global i18n mock
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn().mockResolvedValue(undefined),
    },
  }),
}))

// Start MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

// Reset handlers and cleanup after each test
afterEach(() => {
  server.resetHandlers()
  cleanup()
})

// Close server after all tests
afterAll(() => {
  server.close()
})
