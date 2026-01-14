import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const hasChildren = item.children && item.children.length > 0
  const [isOpen, setIsOpen] = useState(() => {
    return hasChildren && openKeys.includes(item.key)
  })

  const isSelected = selectedKeys.includes(item.key)

  const displayLabel = item.labelKey ? t(item.labelKey) : item.label

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
          'relative flex h-menu-item w-full items-center justify-center text-base text-sidebar-foreground transition-none',
          'hover:bg-sidebar-accent',
          (isSelected || hasSelectedChild) &&
            'bg-transparent text-sidebar-primary before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-sidebar-primary before:content-[""]',
        )}
      >
        {item.icon}
      </div>
    )

    // If has children, show popover with submenu
    if (hasChildren) {
      const popoverContent = (closePopover: () => void) => (
        <>
          <div className="px-4 py-3 text-sidebar-foreground border-b border-sidebar-border">
            {displayLabel}
          </div>
          <div>
            {item.children!.map(child => {
              const isChildSelected = selectedKeys.includes(child.key)
              const childLabel = child.labelKey ? t(child.labelKey) : child.label
              return (
                <Link
                  key={child.key}
                  to={child.to}
                  onClick={closePopover}
                  className={cn(
                    'flex items-center px-4 py-3 text-sm text-sidebar-foreground transition-colors',
                    'hover:bg-sidebar-accent',
                    isChildSelected && 'text-sidebar-primary',
                  )}
                >
                  {child.icon && <span className="mr-3 text-base">{child.icon}</span>}
                  <span className="truncate">{childLabel}</span>
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
          contentClassName="min-w-50 w-auto border-sidebar-border bg-sidebar p-0 shadow-lg"
        />
      )
    }

    // Regular item: show tooltip with label
    return (
      <Tooltip content={displayLabel} side="right" align="center">
        <Link to={item.to} onClick={handleClick}>
          {iconContent}
        </Link>
      </Tooltip>
    )
  }

  return (
    <>
      {hasChildren ? (
        <div
          className={cn(
            'flex h-menu-item cursor-pointer items-center text-sm leading-12.5 text-sidebar-foreground transition-none relative',
            paddingLeft,
            'hover:bg-sidebar-accent',
          )}
          onClick={handleClick}
        >
          {item.icon && <span className="mr-4 text-base">{item.icon}</span>}
          <span className="flex-1 truncate">{displayLabel}</span>
          <ChevronDown
            className={cn(
              'mr-4 text-xs transition-transform duration-200 size-4',
              isOpen && 'rotate-180',
            )}
          />
        </div>
      ) : (
        <Link
          to={item.to}
          className={cn(
            'relative flex h-menu-item items-center text-sm leading-12.5 text-sidebar-foreground transition-none',
            paddingLeft,
            'hover:bg-sidebar-accent',
            isSelected &&
              'bg-transparent text-sidebar-primary before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-sidebar-primary',
          )}
        >
          {item.icon && <span className="mr-4 text-base">{item.icon}</span>}
          <span className="truncate">{displayLabel}</span>
        </Link>
      )}

      {hasChildren && !sidebarCollapsed && (
        <div
          className={cn(
            'overflow-hidden bg-sidebar-accent/50 transition-all duration-300 ease-in-out',
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
