import { createFileRoute } from '@tanstack/react-router'

import { UserCreatePage } from '@/containers/users/user-create-page'

export const Route = createFileRoute('/_authenticated/users/create')({
  component: UserCreatePage,
  staticData: {
    meta: {
      title: 'Create User',
      titleKey: 'users.create_user.page_title',
    },
  },
})
