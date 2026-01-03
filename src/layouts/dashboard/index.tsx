import { Outlet } from '@tanstack/react-router'
import React from 'react'

import LayoutHeader from './header'
import LayoutSider from './sider'
import TagView from './tag-view'

import { useSetting } from '@/contexts/setting/context'
import { cn } from '@/lib/utils'

type DashboardLayoutProps = {}

const DashboardLayout: React.FC<React.PropsWithChildren<DashboardLayoutProps>> = () => {
  const { sidebarCollapsed, showTagView } = useSetting()

  return (
    <div className="h-full w-full">
      <LayoutSider />

      <div
        className={cn(
          'h-full transition-[margin] duration-280',
          'ml-(--width-sidebar)',
          sidebarCollapsed && 'ml-(--width-sidebar-collapsed)',
          'max-xs:ml-0',
        )}
      >
        <div className="sticky top-0 z-9 w-full bg-white">
          <LayoutHeader />
          {showTagView && <TagView />}
        </div>

        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
