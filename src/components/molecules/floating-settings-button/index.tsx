import { Settings } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/atoms/button'
import { SettingsPanel } from '@/components/molecules/settings-panel'
import { cn } from '@/lib/utils'

export interface FloatingSettingsButtonProps {
  /**
   * Custom className
   */
  className?: string
}

/**
 * FloatingSettingsButton component - a fixed floating action button for opening settings
 *
 * @example
 * ```tsx
 * <FloatingSettingsButton />
 * ```
 */
export function FloatingSettingsButton({ className }: FloatingSettingsButtonProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button
        size="icon"
        className={cn(
          'fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg',
          'hover:shadow-xl transition-shadow',
          className,
        )}
        onClick={() => setOpen(true)}
        aria-label="Open settings"
      >
        <Settings className="h-5 w-5" />
      </Button>
      <SettingsPanel open={open} onOpenChange={setOpen} />
    </>
  )
}
