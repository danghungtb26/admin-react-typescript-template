import React from 'react'

import { cn } from '@/lib/utils'

import { MenuProvider } from './menu-context'
import { MenuItemComponent } from './menu-item'
import { menuItems } from './menu-items'

const Menu: React.FC = () => {
  return (
    <nav
      className={cn(
        'h-[calc(100vh-81px)] overflow-y-auto bg-sidebar-bg',
        '[scrollbar-width:thin] [scrollbar-color:#e0e0e0_transparent]',
        '[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent',
        '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-sidebar-divider',
      )}
    >
      <MenuProvider>
        {menuItems.map(item => (
          <MenuItemComponent key={item.key} item={item} />
        ))}
      </MenuProvider>
    </nav>
  )
}

export default Menu
