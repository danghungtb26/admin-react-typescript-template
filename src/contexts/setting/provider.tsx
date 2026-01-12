import React, { useEffect, useMemo, useState } from 'react'

import { getConfig, getTheme, setConfig, setTheme as saveTheme, Theme } from '@/commons/cookies'

import { SettingContext, SettingContextType } from './context'

type SettingProviderProps = {}

// Apply theme to document element
const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.classList.add('disable-color-transitions')
  setTimeout(() => {
    root.classList.remove('disable-color-transitions')
  }, 0)
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.classList.toggle('dark', systemTheme === 'dark')
  } else {
    root.classList.toggle('dark', theme === 'dark')
  }
}

const SettingProvider: React.FC<React.PropsWithChildren<SettingProviderProps>> = ({ children }) => {
  const config = getConfig()

  const [sidebarCollapsed, setCollapsed] = useState<boolean>(config.sidebarCollapsed)

  const [theme, setThemeState] = useState<Theme>(getTheme())

  const [fixedHeader, setFixedHeader] = useState<boolean>(config.fixedHeader)

  const [showTagView, setShowTagView] = useState<boolean>(config.showTagView)

  const toggleSidebarCollapsed = () => {
    setCollapsed(s => !s)
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    saveTheme(newTheme)
    applyTheme(newTheme)
  }

  const toggleFixedHeader = () => {
    setFixedHeader(s => !s)
  }

  const toggleShowTagView = () => {
    setShowTagView(s => !s)
  }

  const [drawerOpened, setDrawerOpened] = useState<SettingContextType['drawerOpened']>(false)

  const toggleDrawerOpened = () => {
    setDrawerOpened(s => !s)
  }

  // Apply theme on mount and when system preference changes
  useEffect(() => {
    applyTheme(theme)

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => applyTheme('system')
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  // Persist config to localStorage
  useEffect(() => {
    setConfig({
      sidebarCollapsed,
      fixedHeader,
      showTagView,
    })
  }, [sidebarCollapsed, fixedHeader, showTagView])

  const value = useMemo<SettingContextType>(
    () => ({
      sidebarCollapsed,
      toggleSidebarCollapsed,
      fixedHeader,
      showTagView,
      drawerOpened,
      toggleDrawerOpened,
      theme,
      setTheme,
      toggleFixedHeader,
      toggleShowTagView,
    }),
    [drawerOpened, sidebarCollapsed, theme, fixedHeader, showTagView],
  )

  return <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
}

export default SettingProvider
