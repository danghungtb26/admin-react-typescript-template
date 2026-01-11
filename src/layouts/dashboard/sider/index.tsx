import React from 'react'

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

  return (
    <>
      {drawerOpened && mobile ? (
        <div
          className="fixed top-0 h-screen w-screen bg-black opacity-30 z-10"
          onClick={toggleDrawerOpened}
        />
      ) : null}
      <div
        className={cn(
          'fixed top-0 bottom-0 left-0 z-10 h-full overflow-hidden overscroll-contain bg-white transition-[width] duration-280 border-r border-sidebar-border',
          mobile && 'duration-300 -translate-x-60',
          mobile && drawerOpened && 'translate-x-0',
          mobile && !drawerOpened && 'pointer-events-none',
          {
            'w-sidebar': !mobile && !sidebarCollapsed,
            'w-sidebar-collapsed': !mobile && sidebarCollapsed,
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
