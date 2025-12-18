import { createFileRoute } from '@tanstack/react-router'

import Home from '@/containers/home'

export const Route = createFileRoute('/_authenticated/home')({
  component: Home,
  staticData: {
    meta: {
      title: 'Home',
      titleKey: 'home',
    },
  },
})
