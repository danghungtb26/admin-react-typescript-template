import { LayoutDashboardIcon, FileExclamationPoint, HomeIcon, TableIcon } from 'lucide-react'

import type { MenuItem } from './types'

import { router_keys } from '@/routers/key'

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
