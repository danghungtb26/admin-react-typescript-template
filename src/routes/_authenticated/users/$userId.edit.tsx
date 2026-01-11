import { createFileRoute } from '@tanstack/react-router'

import { UserEditPage } from '@/containers/users/user-edit-page'

export const Route = createFileRoute('/_authenticated/users/$userId/edit')({
  component: UserEditPage,
  staticData: {
    meta: {
      title: 'Edit User',
    },
  },
})
