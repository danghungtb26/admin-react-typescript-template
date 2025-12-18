import { createFileRoute } from '@tanstack/react-router'

import Profile from '@/containers/profile'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
  staticData: {
    meta: {
      title: 'Profile',
    },
  },
})
