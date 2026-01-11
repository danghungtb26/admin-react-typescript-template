import React from 'react'

import { cn } from '@/lib/utils'

interface PageLayoutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'default' | 'dashboard'
  spacing?: 'sm' | 'md' | 'lg'
  fullHeight?: boolean
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  breadcrumb?: React.ReactNode
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  (
    {
      children,
      variant = 'default',
      spacing = 'md',
      fullHeight = false,
      title,
      description,
      actions,
      breadcrumb,
      className,
      ...props
    },
    ref,
  ) => {
    const spacingClasses = {
      sm: 'space-y-4',
      md: 'space-y-6',
      lg: 'space-y-8',
    }

    const variantClasses = {
      default: 'bg-background',
      dashboard: 'bg-gray-50/50',
    }

    const hasHeader = title || description || actions || breadcrumb

    return (
      <div
        ref={ref}
        className={cn(
          'relative p-6 md:p-8',
          variantClasses[variant],
          spacingClasses[spacing],
          fullHeight && 'h-full flex-1 flex-col md:flex',
          className,
        )}
        {...props}
      >
        {hasHeader && (
          <div className="space-y-4">
            {breadcrumb && <div>{breadcrumb}</div>}
            <div className="flex items-center justify-between space-y-2 flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                {title && <h2 className="text-2xl font-bold tracking-tight truncate">{title}</h2>}
                {description && <p className="text-muted-foreground mt-1">{description}</p>}
              </div>
              {actions && <div className="flex items-center space-x-2 shrink-0">{actions}</div>}
            </div>
          </div>
        )}
        {children}
      </div>
    )
  },
)

PageLayout.displayName = 'PageLayout'
