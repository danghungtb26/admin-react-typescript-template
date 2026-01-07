import { LayoutDashboardIcon, FileExclamationPoint, HomeIcon, TableIcon } from 'lucide-react'

import type { MenuItem } from './types'

import { router_keys } from '@/routers/key'

export const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    label: 'Dashboard',
    to: router_keys.dashboard,
    icon: <LayoutDashboardIcon />,
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
