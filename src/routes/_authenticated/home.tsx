import Home from '@containers/home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/home')({
  component: Home,
  staticData: {
    meta: {
      title: 'Home',
      titleKey: 'home',
    },
  },
})
