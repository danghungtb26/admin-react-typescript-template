import * as React from 'react'

import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/atoms/tooltip'
import { cn } from '@/lib/utils'

type TooltipProps = {
  children: React.ReactNode
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  className?: string
  contentClassName?: string
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  side = 'right',
  align = 'center',
  className,
  contentClassName,
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <TooltipPrimitive>
        <TooltipTrigger asChild>
          <div className={className}>{children}</div>
        </TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn('bg-tooltip-bg/90 text-tooltip-text', contentClassName)}
        >
          {content}
        </TooltipContent>
      </TooltipPrimitive>
    </TooltipProvider>
  )
}
