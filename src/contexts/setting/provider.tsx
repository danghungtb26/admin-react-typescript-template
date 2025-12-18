import { getSidebarCollapsed, setSidebarCollapsed } from '@commons/cookies'
import React, { useEffect, useMemo, useState } from 'react'

import { SettingContext, SettingContextType } from './context'

type SettingProviderProps = {}

const SettingProvider: React.FC<React.PropsWithChildren<SettingProviderProps>> = ({ children }) => {
  const [sidebarCollapsed, setCollapsed] =
    useState<SettingContextType['sidebarCollapsed']>(getSidebarCollapsed())

  const toggleSidebarCollapsed = () => {
    setCollapsed(s => !s)
  }

  const [drawerOpened, setDrawerOpened] = useState<SettingContextType['drawerOpened']>(false)

  const toggleDrawerOpened = () => {
    setDrawerOpened(s => !s)
  }

  useEffect(() => {
    setSidebarCollapsed(sidebarCollapsed)
  }, [sidebarCollapsed])

  const value = useMemo<SettingContextType>(
    () => ({
      sidebarCollapsed,
      toggleSidebarCollapsed,
      fixedHeader: true,
      showTagView: true,
      drawerOpened,
      toggleDrawerOpened,
    }),
    [drawerOpened, sidebarCollapsed],
  )

  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
}

export default SettingProvider
