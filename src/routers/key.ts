export const router_keys = {
  login: '/login',
  home: '/home',
  dashboard: '/dashboard',
  analytics: '/dashboard/analytics',
  users: '/users',

  template: {
    table: {
      list: '/template/table',
      detail: (id: string) => `/template/table/${id}`,
    },
    form: '/template/form',
  },
  profile: '/profile',
}
