import * as React from 'react'

import {
  DropdownMenu as DropdownMenuPrimitive,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'

type DropdownMenuItemType =
  | {
      type: 'item'
      key: string
      label: React.ReactNode
      onClick?: () => void
      disabled?: boolean
      shortcut?: string
      variant?: 'default' | 'destructive'
    }
  | {
      type: 'label'
      key: string
      label: React.ReactNode
    }
  | {
      type: 'separator'
      key: string
    }
  | {
      type: 'group'
      key: string
      items: DropdownMenuItemType[]
    }
  | {
      type: 'sub'
      key: string
      label: React.ReactNode
      items: DropdownMenuItemType[]
    }

type DropdownMenuProps = {
  trigger: React.ReactNode
  items: DropdownMenuItemType[]
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  contentClassName?: string
}

const renderMenuItem = (item: DropdownMenuItemType): React.ReactNode => {
  switch (item.type) {
    case 'item':
      return (
        <DropdownMenuItem
          key={item.key}
          onClick={item.onClick}
          disabled={item.disabled}
          variant={item.variant}
        >
          {item.label}
          {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
        </DropdownMenuItem>
      )

    case 'label':
      return <DropdownMenuLabel key={item.key}>{item.label}</DropdownMenuLabel>

    case 'separator':
      return <DropdownMenuSeparator key={item.key} />

    case 'group':
      return (
        <DropdownMenuGroup key={item.key}>
          {item.items.map(subItem => renderMenuItem(subItem))}
        </DropdownMenuGroup>
      )

    case 'sub':
      return (
        <DropdownMenuSub key={item.key}>
          <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {item.items.map(subItem => renderMenuItem(subItem))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      )

    default:
      return null
  }
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'end',
  side = 'bottom',
  contentClassName,
}) => {
  const [open, setOpen] = React.useState(false)
  return (
    <DropdownMenuPrimitive open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className={contentClassName}>
        {items.map(item => renderMenuItem(item))}
      </DropdownMenuContent>
    </DropdownMenuPrimitive>
  )
}
