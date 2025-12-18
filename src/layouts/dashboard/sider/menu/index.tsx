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
import styled from 'styled-components'

import { useSetting } from '@/contexts/setting/context'
import { router_keys } from '@/routers/key'

const MenuStyled = styled.div`
  .ant-menu {
    background-color: rgba(48, 65, 86, 0.5);
    .ant-menu-submenu-open {
      background-color: #263445 !important;
      border-radius: 0;
    }

    .ant-menu-sub {
      background-color: #1f2d3d !important;
    }
  }
`

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
  console.log('🚀 ~ Menu ~ pathname:', pathname)

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
    <MenuStyled>
      <MenuAntd
        theme="dark"
        mode="inline"
        onClick={onClick}
        selectedKeys={selectedKeys}
        openKeys={openKeysState}
        items={menuItems}
        onOpenChange={s => setOpenKeysState(s)}
      />
    </MenuStyled>
  )
}

export default Menu
