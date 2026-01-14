import { createFileRoute } from '@tanstack/react-router'

import AnalyticsDashboard from '@/containers/dashboard/analytics'

export const Route = createFileRoute('/_authenticated/dashboard/analytics')({
  component: AnalyticsDashboard,
  staticData: {
    meta: {
      title: 'Analytics Dashboard',
      titleKey: 'dashboard.analytics',
    },
  },
})
