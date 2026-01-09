import { LayoutDashboardIcon, FileExclamationPoint, HomeIcon, TableIcon, User } from 'lucide-react'

import { router_keys } from '@/routers/key'

import type { MenuItem } from './types'

export const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    label: 'Dashboard',
    to: router_keys.dashboard,
    icon: <LayoutDashboardIcon />,
    children: [
      {
        key: '/dashboard/default',
        label: 'Default',
        to: router_keys.dashboard,
        icon: <LayoutDashboardIcon className="size-4" />,
      },
      {
        key: '/dashboard/analytics',
        label: 'Analytics',
        to: router_keys.analytics,
        icon: <LayoutDashboardIcon className="size-4" />,
      },
    ],
  },
  {
    key: '/users',
    label: 'Users',
    to: router_keys.users,
    icon: <User />,
  },
  {
    key: '/home',
    label: 'Home',
    to: router_keys.home,
    icon: <HomeIcon />,
  },
  {
    key: '/template',
    label: 'Template',
    to: '/template',
    icon: <FileExclamationPoint />,
    children: [
      {
        key: '/template/table',
        label: 'Table',
        to: router_keys.template.table.list,
        icon: <TableIcon />,
      },
      {
        key: '/template/table/1',
        label: 'Table 1',
        to: router_keys.template.table.detail('1'),
        icon: <TableIcon />,
      },
    ],
  },
]
