import { router_keys } from '@routers/key'
import { Outlet, useNavigate, useNavigation } from '@tanstack/react-router'
import nProgress from 'nprogress'
import React, { useEffect, useState } from 'react'

type AppProps = {}

const App: React.FC<React.PropsWithChildren<AppProps>> = () => {
  const [loading, setLoading] = useState<boolean>(true)

  const navigate = useNavigate()

  const navigation = useNavigation()
  useEffect(() => {
    if (navigation.state === 'idle') {
      nProgress.done()
    } else {
      nProgress.start()
    }
  }, [navigation.state])

  useEffect(() => {
    // check authen, role, ...
    setTimeout(() => {
      const pathname = window.location.pathname
      const logined = true
      if (logined)
        if (pathname === router_keys.login) {
          navigate(router_keys.dashboard)
        }

      if (!logined) {
        if (pathname !== router_keys.login) {
          navigate(router_keys.login)
        }
      }

      setLoading(false)
    }, 2000)
  }, [navigate])

  if (loading) return <div>This is splash screen</div>

  return <Outlet />
}

export default App
