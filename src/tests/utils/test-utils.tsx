import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ============================================================================
// Test Provider Options
// ============================================================================

export interface TestProviderOptions {
  /** Custom QueryClient configuration */
  queryClientConfig?: {
    retry?: boolean
    cacheTime?: number
  }
}

// ============================================================================
// Create Test Wrapper
// ============================================================================

export function createTestWrapper(options: TestProviderOptions = {}) {
  const { queryClientConfig = {} } = options

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: queryClientConfig.retry ?? false,
          gcTime: queryClientConfig.cacheTime ?? 0,
        },
        mutations: {
          retry: false,
        },
      },
    })

    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}

// ============================================================================
// Custom Render Functions
// ============================================================================

/**
 * Render component without any providers
 * Use for simple components that don't need context
 */
export function renderSimple(ui: ReactElement) {
  return render(ui)
}

/**
 * Render component with React Query provider
 * Use for components/hooks that use useQuery/useMutation
 */
export function renderWithQuery(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    queryClientConfig?: TestProviderOptions['queryClientConfig']
  }
) {
  const { queryClientConfig, ...renderOptions } = options ?? {}

  return render(ui, {
    wrapper: createTestWrapper({ queryClientConfig }),
    ...renderOptions,
  })
}

// ============================================================================
// Hook Testing Wrapper
// ============================================================================

/**
 * Create wrapper for renderHook with React Query
 */
export function createQueryWrapper(
  config?: TestProviderOptions['queryClientConfig']
) {
  return createTestWrapper({ queryClientConfig: config })
}

// ============================================================================
// Re-export everything from testing-library
// ============================================================================

export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'
