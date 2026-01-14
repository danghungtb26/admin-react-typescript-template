import { useRouterState } from '@tanstack/react-router'
import { uniq } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'

import { menuItems } from './menu-items'
import { findMatchingKeys } from './utils'

type MenuContextValue = {
  selectedKeys: string[]
  openKeys: string[]
}

const MenuContext = React.createContext<MenuContextValue>({
  selectedKeys: [],
  openKeys: [],
})

export const useMenuContext = () => React.useContext(MenuContext)

type MenuProviderProps = {
  children: React.ReactNode
}

export const MenuProvider: React.FC<MenuProviderProps> = ({ children }) => {
  const pathname = useRouterState({ select: state => state.location.pathname })

  const [openKeys, setOpenKeys] = useState<string[]>([])

  const { selectedKeys, openKeys: memoOpenKeys } = useMemo(() => {
    const { selectedKey, openKeys } = findMatchingKeys(menuItems, pathname)
    return {
      selectedKeys: selectedKey ? [selectedKey] : [],
      openKeys,
    }
  }, [pathname])

  useEffect(() => {
    setOpenKeys(s => uniq([...s, ...memoOpenKeys]))
  }, [memoOpenKeys])

  return <MenuContext.Provider value={{ selectedKeys, openKeys }}>{children}</MenuContext.Provider>
}
