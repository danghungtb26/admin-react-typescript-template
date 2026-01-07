import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AnimatePresence } from 'framer-motion'
import nProgress from 'nprogress'
import { useEffect } from 'react'

import SettingProvider from '@/contexts/setting/provider'
import TagViewProvider from '@/contexts/tag-view/provider'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const isLoading = useRouterState({ select: s => s.status === 'pending' })

  useEffect(() => {
    if (isLoading) {
      nProgress.start()
    } else {
      nProgress.done()
    }
  }, [isLoading])

  return (
    <>
      <SettingProvider>
        <TagViewProvider>
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </TagViewProvider>
      </SettingProvider>

      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </>
  )
}
