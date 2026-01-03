import { Link } from '@tanstack/react-router'
import React from 'react'

import { Avatar, AvatarImage } from '@/components/atoms/avatar'
import BreadCrumb from '@/components/breadcrumb'
import Hamburger from '@/components/hamburger'
import { DropdownMenu } from '@/components/molecules/dropdown-menu'
import { router_keys } from '@/routers/key'

type LayoutHeaderProps = {}

const LayoutHeader: React.FC<React.PropsWithChildren<LayoutHeaderProps>> = () => {
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
    <header className="relative z-9 flex h-header items-center justify-between bg-white px-6 shadow-[0_1px_4px_rgba(0,21,41,0.08)]">
      <div className="flex items-center gap-4">
        <Hamburger />
        <BreadCrumb />
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu
          trigger={
            <Avatar className="size-10 cursor-pointer">
              <AvatarImage
                src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
                alt="User avatar"
              />
            </Avatar>
          }
          items={menuItems}
        />
      </div>
    </header>
  )
}

export default LayoutHeader
