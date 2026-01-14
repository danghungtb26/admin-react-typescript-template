import { MenuIcon as HamburgerIcon } from 'lucide-react'
import React from 'react'

import { useSetting } from '@/contexts/setting/context'
import { useMobile } from '@/hooks/media'

type HamburgerProps = {}

const Hamburger: React.FC<React.PropsWithChildren<HamburgerProps>> = () => {
  const { sidebarCollapsed, toggleSidebarCollapsed, drawerOpened, toggleDrawerOpened } =
    useSetting()
  const mobile = useMobile()
  const cond = !mobile ? sidebarCollapsed : !drawerOpened
  const Component = cond ? HamburgerIcon : HamburgerIcon
  return (
    <div className="h-full float-left cursor-pointer transition-[background] duration-300 flex self-center hover:bg-black/2.5">
      <Component
        onClick={mobile ? toggleDrawerOpened : toggleSidebarCollapsed}
        className="size-5"
      />
    </div>
  )
}

export default Hamburger
