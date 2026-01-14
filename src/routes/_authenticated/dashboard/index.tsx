import { createFileRoute } from '@tanstack/react-router'

import Dashboard from '@/containers/dashboard'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: Dashboard,
  staticData: {
    meta: {
      title: 'Dashboard',
      titleKey: 'dashboard',
    },
  },
})
