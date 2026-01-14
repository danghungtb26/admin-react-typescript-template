import { Link, useNavigate } from '@tanstack/react-router'
import React from 'react'

import BreadCrumb from '@/components/breadcrumb'
import Hamburger from '@/components/hamburger'
import Avatar from '@/components/molecules/avatar'
import { DropdownMenu } from '@/components/molecules/dropdown-menu'
import LanguageSwitcher from '@/components/molecules/language-switcher'
import { router_keys } from '@/routers/key'

type LayoutHeaderProps = {}

const LayoutHeader: React.FC<React.PropsWithChildren<LayoutHeaderProps>> = () => {
  const navigate = useNavigate()
  const menuItems = [
    {
      type: 'label' as const,
      key: 'account-label',
      label: 'My Account',
    },
    {
      type: 'item' as const,
      key: 'profile',
      label: <Link to={router_keys.profile}>Profile</Link>,
      shortcut: '⇧⌘P',
      onClick: () => {
        navigate({ to: router_keys.profile })
      },
    },
    {
      type: 'separator' as const,
      key: 'separator-1',
    },
    {
      type: 'item' as const,
      key: 'settings',
      label: 'Settings',
      shortcut: '⌘S',
    },
    {
      type: 'separator' as const,
      key: 'separator-2',
    },
    {
      type: 'item' as const,
      key: 'logout',
      label: 'Log out',
      shortcut: '⇧⌘Q',
      variant: 'destructive' as const,
    },
  ]

  return (
    <header className="relative z-9 flex h-header items-center justify-between bg-card px-6 shadow-[0_1px_4px_rgba(0,21,41,0.08)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
      <div className="flex items-center gap-4">
        <Hamburger />
        <BreadCrumb />
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <DropdownMenu
          trigger={
            <div className="cursor-pointer">
              <Avatar
                src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
                fallback="User"
                alt="User avatar"
              />
            </div>
          }
          items={menuItems}
        />
      </div>
    </header>
  )
}

export default LayoutHeader
