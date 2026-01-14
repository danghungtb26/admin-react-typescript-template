import { createFileRoute } from '@tanstack/react-router'

import Login from '@/containers/login'

export const Route = createFileRoute('/login')({
  component: Login,
  staticData: {
    meta: {
      title: 'Login',
    },
  },
})
