import {
  LayoutDashboardIcon,
  FileExclamationPoint,
  HomeIcon,
  TableIcon,
  User,
  FileText,
} from 'lucide-react'

import { router_keys } from '@/routers/key'

import type { MenuItem } from './types'

export const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    label: 'Dashboard',
    labelKey: 'menu.dashboard',
    to: router_keys.dashboard,
    icon: <LayoutDashboardIcon className="size-4.5" />,
    children: [
      {
        key: '/dashboard',
        label: 'Default',
        labelKey: 'menu.dashboard_default',
        to: router_keys.dashboard,
        icon: <LayoutDashboardIcon className="size-4" />,
      },
      {
        key: '/dashboard/analytics',
        label: 'Analytics',
        labelKey: 'menu.analytics',
        to: router_keys.analytics,
        icon: <LayoutDashboardIcon className="size-4" />,
      },
    ],
  },
  {
    key: '/users',
    label: 'Users',
    labelKey: 'menu.users',
    to: router_keys.users,
    icon: <User className="size-4.5" />,
  },
  {
    key: '/home',
    label: 'Home',
    labelKey: 'menu.home',
    to: router_keys.home,
    icon: <HomeIcon className="size-4.5" />,
  },
  {
    key: '/template',
    label: 'Template',
    labelKey: 'menu.template',
    to: '/template',
    icon: <FileExclamationPoint className="size-4.5" />,
    children: [
      {
        key: '/template/table',
        label: 'Table',
        labelKey: 'menu.table',
        to: router_keys.template.table.list,
        icon: <TableIcon className="size-4.5" />,
      },
      {
        key: '/template/table/1',
        label: 'Table 1',
        labelKey: 'menu.table_1',
        to: router_keys.template.table.detail('1'),
        icon: <TableIcon className="size-4.5" />,
      },
      {
        key: '/template/form',
        label: 'Form',
        labelKey: 'menu.form',
        to: router_keys.template.form,
        icon: <FileText className="size-4.5" />,
      },
    ],
  },
]
