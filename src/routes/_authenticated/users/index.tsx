import { createFileRoute } from '@tanstack/react-router'

import UserList from '@/containers/users'

export const Route = createFileRoute('/_authenticated/users/')({
  component: UserList,
  staticData: {
    meta: {
      title: 'Users',
      titleKey: 'users.title',
    },
  },
})
