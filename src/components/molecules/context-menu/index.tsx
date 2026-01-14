import * as React from 'react'

import {
  ContextMenu as ContextMenuRoot,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/atoms/context-menu'

export type ContextMenuItemType =
  | {
      type: 'item'
      label: React.ReactNode
      onClick?: () => void
      disabled?: boolean
      inset?: boolean
      shortcut?: string
      icon?: React.ReactNode
    }
  | {
      type: 'checkbox'
      label: React.ReactNode
      checked?: boolean
      onCheckedChange?: (checked: boolean) => void
      disabled?: boolean
      shortcut?: string
    }
  | {
      type: 'radio'
      label: React.ReactNode
      value: string
      disabled?: boolean
    }
  | {
      type: 'separator'
    }
  | {
      type: 'label'
      label: React.ReactNode
      inset?: boolean
    }
  | {
      type: 'group'
      label?: React.ReactNode
      items: ContextMenuItemType[]
    }
  | {
      type: 'sub'
      label: React.ReactNode
      items: ContextMenuItemType[]
      inset?: boolean
      icon?: React.ReactNode
    }

export interface ContextMenuProps {
  children: React.ReactNode
  items: ContextMenuItemType[]
  radioValue?: string
  onRadioValueChange?: (value: string) => void
}

const renderMenuItem = (
  item: ContextMenuItemType,
  index: number,
  radioValue?: string,
  onRadioValueChange?: (value: string) => void,
): React.ReactNode => {
  const key = `menu-item-${index}`

  switch (item.type) {
    case 'item':
      return (
        <ContextMenuItem
          key={key}
          onClick={item.onClick}
          disabled={item.disabled}
          inset={item.inset}
          className="cursor-pointer px-3 py-1.5 hover:bg-context-menu-hover focus:bg-context-menu-hover"
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
          {item.shortcut && <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>}
        </ContextMenuItem>
      )

    case 'checkbox':
      return (
        <ContextMenuCheckboxItem
          key={key}
          checked={item.checked}
          onCheckedChange={item.onCheckedChange}
          disabled={item.disabled}
          className="cursor-pointer px-3 hover:bg-context-menu-hover focus:bg-context-menu-hover"
        >
          {item.label}
          {item.shortcut && <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>}
        </ContextMenuCheckboxItem>
      )

    case 'radio':
      return (
        <ContextMenuRadioItem
          key={key}
          value={item.value}
          disabled={item.disabled}
          className="cursor-pointer px-3 hover:bg-context-menu-hover focus:bg-context-menu-hover"
        >
          {item.label}
        </ContextMenuRadioItem>
      )

    case 'separator':
      return <ContextMenuSeparator key={key} />

    case 'label':
      return (
        <ContextMenuLabel
          key={key}
          inset={item.inset}
          className="px-3 text-context-menu-label font-normal"
        >
          {item.label}
        </ContextMenuLabel>
      )

    case 'group':
      return (
        <ContextMenuGroup key={key}>
          {item.label && <ContextMenuLabel>{item.label}</ContextMenuLabel>}
          {item.items.map((subItem, subIndex) =>
            renderMenuItem(subItem, subIndex, radioValue, onRadioValueChange),
          )}
        </ContextMenuGroup>
      )

    case 'sub':
      return (
        <ContextMenuSub key={key}>
          <ContextMenuSubTrigger
            inset={item.inset}
            className="cursor-pointer px-3 hover:bg-context-menu-hover focus:bg-context-menu-hover"
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            {item.label}
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="min-w-48 rounded-md border border-context-menu-border bg-context-menu-bg p-1 text-context-menu-text shadow-[2px_2px_8px_0_rgba(0,0,0,0.15)]">
            {item.items.map((subItem, subIndex) =>
              renderMenuItem(subItem, subIndex, radioValue, onRadioValueChange),
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>
      )

    default:
      return null
  }
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  items,
  radioValue,
  onRadioValueChange,
}) => {
  const hasRadioItems = items.some(item => item.type === 'radio')

  const content = items.map((item, index) =>
    renderMenuItem(item, index, radioValue, onRadioValueChange),
  )

  return (
    <ContextMenuRoot>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="min-w-48 rounded-md border border-context-menu-border bg-context-menu-bg p-1 text-context-menu-text shadow-[2px_2px_8px_0_rgba(0,0,0,0.15)]">
        {hasRadioItems && radioValue !== undefined && onRadioValueChange ? (
          <ContextMenuRadioGroup value={radioValue} onValueChange={onRadioValueChange}>
            {content}
          </ContextMenuRadioGroup>
        ) : (
          content
        )}
      </ContextMenuContent>
    </ContextMenuRoot>
  )
}
