import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useCategories } from '@/apis/category/hooks/use-categories'
import { Button } from '@/components/atoms/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/atoms/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/popover'
import { Skeleton } from '@/components/atoms/skeleton'
import { cn } from '@/lib/utils'
import { Category } from '@/models/category'

export interface CategorySelectProps {
  /**
   * The selected category ID
   */
  value?: string
  /**
   * Callback when category changes
   */
  onChange?: (value: string) => void
  /**
   * Placeholder text when no category is selected
   */
  placeholder?: string
  /**
   * Custom className
   */
  className?: string
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Enable search functionality
   * @default true
   */
  searchable?: boolean
}

/**
 * CategorySelect component for selecting a category
 * Fetches data from API with TanStack Query and supports search
 *
 * @example
 * ```tsx
 * <CategorySelect
 *   value={categoryId}
 *   onChange={setCategoryId}
 *   searchable
 * />
 * ```
 */
export function CategorySelect({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  searchable = true,
}: CategorySelectProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)

  const { data, isLoading, isError, refetch } = useCategories({
    search: searchable ? search : undefined,
  })

  const categories = data?.data || []

  // Update selected category when value changes or data loads
  React.useEffect(() => {
    if (!value) {
      setSelectedCategory(null)
      return
    }

    if (value && categories.length > 0) {
      const found = categories.find(cat => cat.id === value)
      if (found) {
        setSelectedCategory(found)
      }
    }
  }, [value, categories])

  // Reset search when popover closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearch('')
    }
  }

  const handleSelect = (currentValue: string) => {
    if (currentValue === value) {
      onChange?.('')
    } else {
      onChange?.(currentValue)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled}
        >
          {selectedCategory ? (
            <span className="truncate">{selectedCategory.name}</span>
          ) : (
            <span className="text-muted-foreground">
              {placeholder || t('selectors.category.placeholder')}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command shouldFilter={!searchable}>
          {searchable && (
            <CommandInput
              placeholder={t('selectors.category.search_placeholder')}
              value={search}
              onValueChange={setSearch}
            />
          )}
          <CommandList>
            {isLoading ? (
              <div className="p-4 flex justify-center">
                <Skeleton className="h-8 w-full" />
              </div>
            ) : isError ? (
              <div className="p-4 flex flex-col items-center gap-2">
                <span className="text-sm text-destructive">
                  {t('common.error.something_went_wrong')}
                </span>
                <Button variant="link" size="sm" onClick={() => refetch()}>
                  {t('common.retry')}
                </Button>
              </div>
            ) : (
              <>
                <CommandEmpty>{t('data_table.no_results')}</CommandEmpty>
                <CommandGroup>
                  {categories.map(category => (
                    <CommandItem key={category.id} value={category.id} onSelect={handleSelect}>
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === category.id ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <div className="flex flex-col flex-1 overflow-hidden">
                        <span className="truncate">{category.name}</span>
                        {category.description && (
                          <span className="text-xs text-muted-foreground truncate">
                            {category.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
