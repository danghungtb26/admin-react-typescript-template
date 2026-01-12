import React, { useContext } from 'react'

import { Theme } from '@/commons/cookies'

export type SettingContextType = {
  sidebarCollapsed: boolean

  toggleSidebarCollapsed: () => void

  fixedHeader: boolean

  showTagView: boolean

  drawerOpened: boolean

  toggleDrawerOpened: () => void

  theme: Theme

  setTheme: (theme: Theme) => void

  toggleFixedHeader: () => void

  toggleShowTagView: () => void
}

export const SettingContext = React.createContext<SettingContextType>({
  sidebarCollapsed: false,
  toggleSidebarCollapsed: () => {},
  fixedHeader: true,
  showTagView: true,
  drawerOpened: false,
  toggleDrawerOpened: () => {},
  theme: 'system',
  setTheme: () => {},
  toggleFixedHeader: () => {},
  toggleShowTagView: () => {},
})

export const useSetting = () => useContext(SettingContext)
