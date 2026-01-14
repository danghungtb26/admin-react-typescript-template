import * as React from 'react'

import { Button } from '@/components/atoms/button'
import {
  Dialog as DialogPrimitive,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'

export type DialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode | ((closeDialog: () => void) => React.ReactNode)
  showDefaultFooter?: boolean
  showCloseButton?: boolean
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  confirmButtonProps?: React.ComponentProps<typeof Button>
  cancelButtonProps?: React.ComponentProps<typeof Button>
  className?: string
  contentClassName?: string
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  showDefaultFooter = false,
  showCloseButton = true,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonProps,
  cancelButtonProps,
  className,
  contentClassName,
}) => {
  const closeDialog = () => {
    onOpenChange?.(false)
  }

  const handleCancel = () => {
    onCancel?.()
    closeDialog()
  }

  const handleConfirm = async () => {
    await onConfirm?.()
    closeDialog()
  }

  const renderFooter = () => {
    if (footer) {
      return typeof footer === 'function' ? footer(closeDialog) : footer
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
    <DialogPrimitive open={open} onOpenChange={onOpenChange}>
      <DialogContent className={contentClassName} showCloseButton={showCloseButton}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        <div className={className}>{children}</div>
        {(footer || showDefaultFooter) && <DialogFooter>{renderFooter()}</DialogFooter>}
      </DialogContent>
    </DialogPrimitive>
  )
}
