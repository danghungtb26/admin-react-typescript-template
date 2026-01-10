import * as React from 'react'

import { Button } from '@/components/atoms/button'
import {
  Sheet as SheetPrimitive,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/atoms/sheet'

export type SheetProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode | ((closeSheet: () => void) => React.ReactNode)
  side?: 'top' | 'bottom' | 'left' | 'right'
  showDefaultFooter?: boolean
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  confirmButtonProps?: React.ComponentProps<typeof Button>
  cancelButtonProps?: React.ComponentProps<typeof Button>
  className?: string
  contentClassName?: string
  onClose?: () => void
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = 'right',
  showDefaultFooter = false,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonProps,
  cancelButtonProps,
  className,
  contentClassName,
  onClose,
}) => {
  const closeSheet = () => {
    onOpenChange?.(false)
    onClose?.()
  }

  const handleCancel = () => {
    onCancel?.()
    closeSheet()
  }

  const handleConfirm = async () => {
    await onConfirm?.()
    closeSheet()
  }

  const renderFooter = () => {
    if (footer) {
      return typeof footer === 'function' ? footer(closeSheet) : footer
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
    <SheetPrimitive open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className={contentClassName} aria-describedby={undefined}>
        {(title || description) && (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        <div className={className}>{children}</div>
        {(footer || showDefaultFooter) && <SheetFooter>{renderFooter()}</SheetFooter>}
      </SheetContent>
    </SheetPrimitive>
  )
}

export { SheetClose }
