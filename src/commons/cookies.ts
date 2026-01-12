import Cookies from 'js-cookie'

import { AUTHEN_TOKEN_KEY } from '@/constants/key'

export type Theme = 'light' | 'dark' | 'system'

export interface AppConfig {
  sidebarCollapsed: boolean
  fixedHeader: boolean
  showTagView: boolean
}

const THEME_KEY = 'theme'
const CONFIG_KEY = 'config'

const DEFAULT_CONFIG: AppConfig = {
  sidebarCollapsed: false,
  fixedHeader: true,
  showTagView: true,
}

export const getAuthenToken = () => {
  return Cookies.get(AUTHEN_TOKEN_KEY)
}

export const setAuthenToken = (value: unknown) => {
  return Cookies.set(AUTHEN_TOKEN_KEY, `${value}`)
}

// Theme management using localStorage
export const getTheme = (): Theme => {
  const theme = localStorage.getItem(THEME_KEY) as Theme | null
  return theme || 'system'
}

export const setTheme = (value: Theme) => {
  localStorage.setItem(THEME_KEY, value)
}

// Config management using localStorage
export const getConfig = (): AppConfig => {
  const config = localStorage.getItem(CONFIG_KEY)
  if (config) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(config) }
    } catch {
      return DEFAULT_CONFIG
    }
  }
  return DEFAULT_CONFIG
}

export const setConfig = (value: Partial<AppConfig>) => {
  const currentConfig = getConfig()
  const newConfig = { ...currentConfig, ...value }
  localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig))
}

// Deprecated - keep for backwards compatibility, will be removed
export const getSidebarCollapsed = () => {
  return getConfig().sidebarCollapsed
}

export const setSidebarCollapsed = (value: boolean) => {
  setConfig({ sidebarCollapsed: value })
}
