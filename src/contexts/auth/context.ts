import React, { useContext } from 'react'

import { checkScope } from '@/constants/permission'
import { Account } from '@/models/account'
import { ScopeType } from '@/models/scope'

export type AuthContextType = {
  login: boolean
  setLogin: (v: boolean) => void
  user: Account
  setUser: (v: Account) => void
  currentScopes: ScopeType[]
}

export const AuthContext = React.createContext<AuthContextType>({
  login: false,
  setLogin: () => {},
  user: {} as Account,
  setUser: () => {},
  currentScopes: [],
})

export const useAuthContext = () => useContext(AuthContext)

export const useCurrentUser = () => {
  const { user } = useContext(AuthContext)

  return user
}

export const useCurrentScopes = () => {
  const { currentScopes } = useContext(AuthContext)

  return currentScopes
}

export const useRequiredScopes = (scopes: ScopeType[]) => {
  const currentScopes = useCurrentScopes()
  return scopes.map(i => {
    return checkScope(currentScopes, i)
  })
}
