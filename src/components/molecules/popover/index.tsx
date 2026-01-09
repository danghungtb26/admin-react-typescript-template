import * as React from 'react'

import {
  Popover as PopoverPrimitive,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/popover'

type PopoverProps = {
  trigger?: React.ReactNode
  content: React.ReactNode | ((closePopover: () => void) => React.ReactNode)
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  triggerMode?: 'click' | 'hover'
  className?: string
  contentClassName?: string
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  side = 'right',
  align = 'start',
  triggerMode = 'click',
  className,
  contentClassName,
}) => {
  const [open, setOpen] = React.useState(false)

  const handleMouseEnter = () => {
    if (triggerMode === 'hover') {
      setOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (triggerMode === 'hover') {
      setOpen(false)
    }
  }

  const closePopover = () => {
    setOpen(false)
  }

  // Clone trigger element and add mouse event handlers
  const triggerWithEvents = React.isValidElement(trigger)
    ? React.cloneElement(trigger as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      })
    : trigger

  const renderedContent = typeof content === 'function' ? content(closePopover) : content

  return (
    <PopoverPrimitive open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={className}>{triggerWithEvents}</div>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className={contentClassName}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderedContent}
      </PopoverContent>
    </PopoverPrimitive>
  )
}
