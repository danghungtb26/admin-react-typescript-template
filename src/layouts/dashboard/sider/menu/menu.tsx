import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'

import { cn } from '@/lib/utils'

import { MenuProvider } from './menu-context'
import { MenuItemComponent } from './menu-item'
import { menuItems } from './menu-items'

const Menu: React.FC = () => {
  return (
    <Scrollbars
      autoHide
      autoHideTimeout={500}
      autoHideDuration={200}
      hideTracksWhenNotNeeded={true}
      renderThumbVertical={({ ...props }) => (
        <div {...props} className="dark:bg-white/20! w-1 rounded-1 bg-black" />
      )}
    >
      <nav className={cn('h-full bg-sidebar')}>
        <MenuProvider>
          {menuItems.map(item => (
            <MenuItemComponent key={item.key} item={item} />
          ))}
        </MenuProvider>
      </nav>
    </Scrollbars>
  )
}

export default Menu
