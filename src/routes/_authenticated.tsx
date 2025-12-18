import { createFileRoute, redirect } from '@tanstack/react-router'

import DashboardLayout from '@/layouts/dashboard'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const logined = true
    if (!logined) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <DashboardLayout />
}
