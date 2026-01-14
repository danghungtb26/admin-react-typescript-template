import { useLocation } from '@tanstack/react-router'
import React, { useEffect } from 'react'

import { useSetting } from '@/contexts/setting/context'
import { useMobile } from '@/hooks/media'
import { cn } from '@/lib/utils'

import Logo from './logo'
import Menu from './menu'
import UserProfile from './user-profile'

type LayoutSiderProps = {}

const LayoutSider: React.FC<React.PropsWithChildren<LayoutSiderProps>> = () => {
  const { sidebarCollapsed, drawerOpened, toggleDrawerOpened } = useSetting()
  const mobile = useMobile()
  const location = useLocation()

  // Close drawer on mobile when route changes
  useEffect(() => {
    if (mobile && drawerOpened) {
      toggleDrawerOpened()
    }
  }, [location.pathname])

  return (
    <>
      {drawerOpened && mobile ? (
        <div
          className="fixed top-0 h-screen w-screen bg-black opacity-30 z-10 transition-colors"
          onClick={toggleDrawerOpened}
        />
      ) : null}
      <div
        className={cn(
          'fixed top-0 bottom-0 left-0 z-10 h-full overflow-hidden overscroll-contain bg-sidebar transition-[width] duration-280 border-r border-sidebar-border',
          mobile && '-translate-x-full',
          mobile && drawerOpened && 'translate-x-0',
          mobile && !drawerOpened && 'pointer-events-none',
          {
            'w-sidebar': !mobile && !sidebarCollapsed,
            'w-sidebar-collapsed': !mobile && sidebarCollapsed,
            'transition-transform duration-300': mobile,
            'w-[80%] max-w-[300px]': mobile,
          },
        )}
      >
        <div className="flex h-full flex-col">
          <Logo />
          <div className="flex-1 overflow-y-auto">
            <Menu />
          </div>
          <UserProfile />
        </div>
      </div>
    </>
  )
}

export default LayoutSider
