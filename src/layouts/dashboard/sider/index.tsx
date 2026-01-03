import React from 'react'

import Logo from './logo'
import Menu from './menu'

import { useSetting } from '@/contexts/setting/context'
import { useMobile } from '@/hooks/media'
import { cn } from '@/lib/utils'

type LayoutSiderProps = {}

const LayoutSider: React.FC<React.PropsWithChildren<LayoutSiderProps>> = () => {
  const { sidebarCollapsed, drawerOpened, toggleDrawerOpened } = useSetting()
  const mobile = useMobile()

  return (
    <>
      {drawerOpened && mobile ? (
        <div
          className="fixed top-0 h-screen w-screen bg-black opacity-30 z-222"
          onClick={toggleDrawerOpened}
        />
      ) : null}
      <div
        className={cn(
          'fixed top-0 bottom-0 left-0 z-999 h-full overflow-hidden overscroll-contain bg-white text-[0] transition-[width] duration-280 border-r border-sidebar-border',
          mobile && 'duration-300 -translate-x-60',
          mobile && drawerOpened && 'translate-x-0',
          mobile && !drawerOpened && 'pointer-events-none',
          !mobile && sidebarCollapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
        )}
      >
        <Logo />
        <Menu />
      </div>
    </>
  )
}

export default LayoutSider
