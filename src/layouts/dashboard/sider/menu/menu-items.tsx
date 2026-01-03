import {
  DashboardOutlined,
  ExclamationOutlined,
  HomeOutlined,
  TableOutlined,
} from '@ant-design/icons'

import { router_keys } from '@/routers/key'

import type { MenuItem } from './types'

export const menuItems: MenuItem[] = [
  {
    key: '/dashboard',
    label: 'Dashboard',
    to: router_keys.dashboard,
    icon: <DashboardOutlined />,
  },
  {
    key: '/home',
    label: 'Home',
    to: router_keys.home,
    icon: <HomeOutlined />,
  },
  {
    key: '/template',
    label: 'Template',
    to: '/template',
    icon: <ExclamationOutlined />,
    children: [
      {
        key: '/template/table',
        label: 'Table',
        to: router_keys.template.table.list,
        icon: <TableOutlined />,
      },
      {
        key: '/template/table/1',
        label: 'Table 1',
        to: router_keys.template.table.detail('1'),
        icon: <TableOutlined />,
      },
    ],
  },
]
