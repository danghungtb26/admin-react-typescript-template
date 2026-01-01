import {
  DashboardOutlined,
  ExclamationOutlined,
  HomeOutlined,
  TableOutlined,
} from '@ant-design/icons'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu as MenuAntd, MenuProps as MenuAntdProps } from 'antd'
import { uniq } from 'lodash'
import React, { useEffect, useMemo } from 'react'

import { useSetting } from '@/contexts/setting/context'
import { router_keys } from '@/routers/key'

type MenuItem = {
  key: string
  label?: React.ReactNode
  icon?: React.ReactNode
  children?: MenuItem[]
}

const findMatchingKeys = (
  items: MenuItem[],
  currentPath: string,
): { selectedKey: string | null; openKeys: string[] } => {
  let bestMatch: { key: string; length: number } | null = null
  const openKeys: string[] = []

  for (const item of items) {
    if (currentPath.startsWith(item.key)) {
      if (!bestMatch || item.key.length > bestMatch.length) {
        bestMatch = { key: item.key, length: item.key.length }
      }
    }

    if (item.children) {
      const childResult = findMatchingKeys(item.children, currentPath)
      if (childResult.selectedKey) {
        openKeys.push(item.key, ...childResult.openKeys)
        const childKeyLength = childResult.selectedKey.length
        if (!bestMatch || childKeyLength > bestMatch.length) {
          bestMatch = { key: childResult.selectedKey, length: childKeyLength }
        }
      }
    }
  }

  return {
    selectedKey: bestMatch?.key || null,
    openKeys,
  }
}

type MenuProps = {}

const Menu: React.FC<React.PropsWithChildren<MenuProps>> = () => {
  const { toggleDrawerOpened } = useSetting()
  const pathname = useRouterState({
    select: state => {
      return state.location.pathname
    },
  })

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        key: '/dashboard',
        label: <Link to={router_keys.dashboard}>Dashboard</Link>,
        icon: <DashboardOutlined />,
      },
      { key: '/home', icon: <HomeOutlined />, label: <Link to={router_keys.home}>Home</Link> },
      {
        key: '/template',
        label: 'Template',
        icon: <ExclamationOutlined />,
        children: [
          {
            key: '/template/table',
            label: <Link to={router_keys.template.table.list}>Table</Link>,
            icon: <TableOutlined />,
          },
          {
            key: '/template/table/1',
            label: <Link to={router_keys.template.table.detail('1')}>Table 1</Link>,
            icon: <TableOutlined />,
          },
        ],
      },
    ],
    [],
  )

  const { selectedKeys, openKeys } = useMemo(() => {
    const { selectedKey, openKeys } = findMatchingKeys(menuItems, pathname)
    return {
      selectedKeys: selectedKey ? [selectedKey] : [],
      openKeys,
    }
  }, [pathname, menuItems])

  const [openKeysState, setOpenKeysState] = React.useState<string[]>(openKeys)

  const onClick: MenuAntdProps['onClick'] = () => {
    toggleDrawerOpened()
  }

  useEffect(() => {
    setOpenKeysState(s => uniq([...s, ...openKeys]))
  }, [openKeys])

  return (
    <div className="[&_.ant-menu]:bg-sidebar-bg [&_.ant-menu-submenu-open]:bg-sidebar-hover! [&_.ant-menu-submenu-open]:rounded-none! [&_.ant-menu-sub]:bg-sidebar-sub!">
      <MenuAntd
        theme="dark"
        mode="inline"
        onClick={onClick}
        selectedKeys={selectedKeys}
        openKeys={openKeysState}
        items={menuItems}
        onOpenChange={s => setOpenKeysState(s)}
      />
    </div>
  )
}

export default Menu
