import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

import { Popover } from '@/components/molecules/popover'
import { Tooltip } from '@/components/molecules/tooltip'
import { useSetting } from '@/contexts/setting/context'
import { cn } from '@/lib/utils'

import { useMenuContext } from './menu-context'

import type { MenuItem } from './types'

type MenuItemComponentProps = {
  item: MenuItem
  level?: number
}

export const MenuItemComponent: React.FC<MenuItemComponentProps> = ({ item, level = 0 }) => {
  const { selectedKeys, openKeys } = useMenuContext()
  const { sidebarCollapsed } = useSetting()

  const hasChildren = item.children && item.children.length > 0

  const isSelected = selectedKeys.includes(item.key)

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault()
      setIsOpen(prev => !prev)
    }
  }

  const paddingLeft = level === 0 ? 'pl-6' : 'pl-14.5'

  // Collapsed mode: center icon, hide text, show tooltip or popover
  if (sidebarCollapsed && level === 0) {
    const hasSelectedChild = (item.children ?? []).some(child => selectedKeys.includes(child.key))

    const iconContent = (
      <div
        className={cn(
          'relative flex h-menu-item w-full items-center justify-center text-base text-sidebar-text transition-none',
          'hover:bg-sidebar-item-hover',
          (isSelected || hasSelectedChild) &&
            'bg-transparent text-sidebar-text-active before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-sidebar-item-active before:content-[""]',
        )}
      >
        {item.icon}
      </div>
    )

    // If has children, show popover with submenu
    if (hasChildren) {
      const popoverContent = (closePopover: () => void) => (
        <>
          <div className="px-4 py-3 font-semibold text-sidebar-text border-b border-sidebar-border">
            {item.label}
          </div>
          <div>
            {item.children!.map(child => {
              const isChildSelected = selectedKeys.includes(child.key)
              return (
                <Link
                  key={child.key}
                  to={child.to}
                  onClick={closePopover}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm font-semibold text-sidebar-text transition-colors',
                    'hover:bg-sidebar-item-hover',
                    isChildSelected && 'text-sidebar-text-active',
                  )}
                >
                  {child.icon && <span className="mr-3 text-base">{child.icon}</span>}
                  <span>{child.label}</span>
                </Link>
              )
            })}
          </div>
        </>
      )

      return (
        <Popover
          trigger={iconContent}
          content={popoverContent}
          side="right"
          align="start"
          triggerMode="hover"
          className="cursor-pointer"
          contentClassName="min-w-50 w-auto border-sidebar-border bg-white p-0 shadow-lg"
        />
      )
    }

    // Regular item: show tooltip with label
    return (
      <Tooltip content={item.label} side="right" align="center">
        <Link to={item.to} onClick={handleClick}>
          {iconContent}
        </Link>
      </Tooltip>
    )
  }

  const [isOpen, setIsOpen] = useState(() => {
    return hasChildren && openKeys.includes(item.key)
  })

  return (
    <>
      {hasChildren ? (
        <div
          className={cn(
            'flex h-menu-item cursor-pointer items-center text-sm font-semibold leading-12.5 text-sidebar-text transition-none relative',
            paddingLeft,
            'hover:bg-sidebar-item-hover',
          )}
          onClick={handleClick}
        >
          {item.icon && <span className="mr-4 text-base">{item.icon}</span>}
          <span className="flex-1">{item.label}</span>
          <ChevronDown
            className={cn('mr-4 text-xs transition-transform duration-200', isOpen && 'rotate-180')}
          />
        </div>
      ) : (
        <Link
          to={item.to}
          className={cn(
            'relative flex h-menu-item items-center text-sm font-semibold leading-12.5 text-sidebar-text transition-none',
            paddingLeft,
            'hover:bg-sidebar-item-hover',
            isSelected &&
              'bg-transparent text-sidebar-text-active before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-sidebar-item-active',
          )}
        >
          {item.icon && <span className="mr-4 text-base">{item.icon}</span>}
          <span>{item.label}</span>
        </Link>
      )}

      {hasChildren && !sidebarCollapsed && (
        <div
          className={cn(
            'overflow-hidden bg-sidebar-sub-bg transition-all duration-300 ease-in-out',
            isOpen ? 'opacity-100' : 'opacity-0',
          )}
          style={{
            maxHeight: isOpen ? `calc(var(--height-menu-item) * ${item.children!.length})` : '0px',
          }}
        >
          {item.children!.map(child => (
            <MenuItemComponent key={child.key} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </>
  )
}
