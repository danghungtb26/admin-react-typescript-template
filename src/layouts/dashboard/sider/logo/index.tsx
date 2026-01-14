import { Link } from '@tanstack/react-router'
import React from 'react'

import { useSetting } from '@/contexts/setting/context'
import { router_keys } from '@/routers/key'

type LogoProps = {}

const Logo: React.FC<React.PropsWithChildren<LogoProps>> = () => {
  const { sidebarCollapsed } = useSetting()

  return (
    <Link
      to={router_keys.dashboard}
      className="flex h-20.25 items-center justify-center border-b border-sidebar-border px-4 transition-all"
    >
      {!sidebarCollapsed && (
        <span
          className="text-[20px] font-extrabold leading-[1.364] text-sidebar-item-active"
          style={{ fontFamily: 'Nunito Sans' }}
        >
          TechStack
        </span>
      )}
      {sidebarCollapsed && (
        <span
          className="text-[20px] font-extrabold leading-[1.364] text-sidebar-item-active"
          style={{ fontFamily: 'Nunito Sans' }}
        >
          D
        </span>
      )}
    </Link>
  )
}

export default Logo
