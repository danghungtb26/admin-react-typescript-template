import { createFileRoute } from '@tanstack/react-router'

import { UserEditPage } from '@/containers/users/user-edit-page'

export const Route = createFileRoute('/_authenticated/users/create')({
  component: UserEditPage,
  staticData: {
    meta: {
      title: 'Create User',
      // titleKey: 'users.create_user.page_title',
    },
  },
})
