import Cookies from 'js-cookie'

import { AUTHEN_TOKEN_KEY, SIDE_BAR_COLLAPSED_KEY } from '@/constants/key'

export const getAuthenToken = () => {
  return Cookies.get(AUTHEN_TOKEN_KEY)
}

export const setAuthenToken = (value: unknown) => {
  return Cookies.set(AUTHEN_TOKEN_KEY, `${value}`)
}

export const getSidebarCollapsed = () => {
  return !!Number(Cookies.get(SIDE_BAR_COLLAPSED_KEY))
}

export const setSidebarCollapsed = (value: boolean) => {
  return Boolean(Cookies.set(SIDE_BAR_COLLAPSED_KEY, `${value ? 1 : 0}`))
}
