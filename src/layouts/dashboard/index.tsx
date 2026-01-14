import { Outlet } from '@tanstack/react-router'
import React from 'react'

import { FloatingSettingsButton } from '@/components/molecules/floating-settings-button'
import { UserEditSheet } from '@/containers/users/user-edit-sheet'
import { useSetting } from '@/contexts/setting/context'
import { cn } from '@/lib/utils'

import LayoutHeader from './header'
import LayoutSider from './sider'
import TagView from './tag-view'

type DashboardLayoutProps = {}

const DashboardLayout: React.FC<React.PropsWithChildren<DashboardLayoutProps>> = () => {
  const { sidebarCollapsed, showTagView, fixedHeader } = useSetting()

  return (
    <div className="h-full w-full">
      <LayoutSider />

      <div
        className={cn(
          'h-full transition-[margin] duration-280',
          'md:ml-(--width-sidebar)',
          sidebarCollapsed && 'md:ml-(--width-sidebar-collapsed)',
          'max-xs:ml-0',
        )}
      >
        <div className={cn('z-9 w-full bg-card', fixedHeader && 'sticky top-0')}>
          <LayoutHeader />
          {showTagView && <TagView />}
        </div>

        <div className="w-full">
          <Outlet />
        </div>
      </div>

      {/* Global User Edit Drawer */}
      <UserEditSheet />

      {/* Floating Settings Button */}
      <FloatingSettingsButton />
    </div>
  )
}

export default DashboardLayout
