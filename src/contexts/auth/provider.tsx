import { uniq } from 'lodash'
import React, { useMemo, useState } from 'react'

import { AuthContext, AuthContextType } from './context'

import { Account } from '@/models/account'
import { getScopesOfPermissions } from '@/models/permission'
import { flattenScope } from '@/models/scope'

type AuthProviderProps = {
  children?: React.ReactNode
  login: boolean
  user: Account
}

const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  login: initLogin,
  user: initUser,
}) => {
  const [login, setLogin] = useState<AuthContextType['login']>(initLogin)

  const [user, setUser] = useState<AuthContextType['user']>(Account.fromJson(initUser))

  // useEffect(() => {
  //   let timeout: NodeJS.Timeout

  //   const fetch = () => {
  //     getAccountMe({}).then(r => {
  //       if (r.data && r.success) {
  //         setUser(r.data)
  //         return
  //       }

  //       timeout = setTimeout(() => {
  //         fetch()
  //       }, 2000)
  //     })
  //   }

  //   if (login) {
  //     fetch()
  //   } else {
  //     setUser({} as Account)
  //   }

  //   return () => {
  //     clearTimeout(timeout)
  //   }
  // }, [login])

  const currentScopes = useMemo(() => {
    return uniq(
      (user?.accountRole?.scopes ?? []).concat(
        getScopesOfPermissions(user?.accountRole?.permissions ?? [])
          .concat(getScopesOfPermissions(user?.accountRole?.role?.permissions ?? []))
          .concat(user?.accountRole?.role?.scopes ?? []),
      ),
    ).map(flattenScope)
  }, [
    user?.accountRole?.permissions,
    user?.accountRole?.role?.permissions,
    user?.accountRole?.role?.scopes,
    user?.accountRole?.scopes,
  ])

  const value = useMemo<AuthContextType>(() => {
    return {
      login,
      setLogin,
      user,
      setUser,
      currentScopes,
    }
  }, [currentScopes, login, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
