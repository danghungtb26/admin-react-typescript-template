import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AnimatePresence } from 'framer-motion'

import { Toaster } from '@/components/atoms/sonner'
import SettingProvider from '@/contexts/setting/provider'
import TagViewProvider from '@/contexts/tag-view/provider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <SettingProvider>
        <TagViewProvider>
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </TagViewProvider>
      </SettingProvider>

      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
      <Toaster position="top-right" />
    </QueryClientProvider>
  )
}
