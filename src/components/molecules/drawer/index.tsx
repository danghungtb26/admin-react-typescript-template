import * as React from 'react'

import { Button } from '@/components/atoms/button'
import {
  Drawer as DrawerPrimitive,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/atoms/drawer'

export type DrawerProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode | ((closeDrawer: () => void) => React.ReactNode)
  direction?: 'top' | 'bottom' | 'left' | 'right'
  showDefaultFooter?: boolean
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  confirmButtonProps?: React.ComponentProps<typeof Button>
  cancelButtonProps?: React.ComponentProps<typeof Button>
  className?: string
  contentClassName?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  direction = 'right',
  showDefaultFooter = false,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonProps,
  cancelButtonProps,
  className,
  contentClassName,
}) => {
  const closeDrawer = () => {
    onOpenChange?.(false)
  }

  const handleCancel = () => {
    onCancel?.()
    closeDrawer()
  }

  const handleConfirm = async () => {
    await onConfirm?.()
    closeDrawer()
  }

  const renderFooter = () => {
    if (footer) {
      return typeof footer === 'function' ? footer(closeDrawer) : footer
    }

    if (showDefaultFooter) {
      return (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel} {...cancelButtonProps}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} {...confirmButtonProps}>
            {confirmText}
          </Button>
        </div>
      )
    }

    return null
  }

  return (
    <DrawerPrimitive open={open} onOpenChange={onOpenChange} direction={direction}>
      <DrawerContent className={contentClassName}>
        {(title || description) && (
          <DrawerHeader>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
        )}
        <div className={className}>{children}</div>
        {(footer || showDefaultFooter) && <DrawerFooter>{renderFooter()}</DrawerFooter>}
      </DrawerContent>
    </DrawerPrimitive>
  )
}

export { DrawerClose }
