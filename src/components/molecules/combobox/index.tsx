import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

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
import { cn } from '@/lib/utils'

export interface ComboboxOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface ComboboxProps {
  /**
   * Array of options
   */
  options: ComboboxOption[]
  /**
   * The selected value
   */
  value?: string
  /**
   * Callback when value changes
   */
  onValueChange?: (value: string) => void
  /**
   * Placeholder text when no value is selected
   */
  placeholder?: string
  /**
   * Search input placeholder
   */
  searchPlaceholder?: string
  /**
   * Empty state text
   */
  emptyText?: string
  /**
   * Custom className for the trigger button
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
  /**
   * Allow clearing the selection
   * @default true
   */
  clearable?: boolean
  /**
   * Loading state
   */
  loading?: boolean
}

/**
 * Combobox molecule component for searchable select with command palette
 *
 * @example
 * ```tsx
 * <Combobox
 *   options={[
 *     { value: '1', label: 'Option 1', description: 'Description 1' },
 *     { value: '2', label: 'Option 2' }
 *   ]}
 *   value={value}
 *   onValueChange={setValue}
 *   searchable
 * />
 * ```
 */
export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  className,
  disabled,
  searchable = true,
  clearable = true,
  loading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const selectedOption = options.find(option => option.value === value)

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !search) return options

    const searchLower = search.toLowerCase()
    return options.filter(
      option =>
        option.label.toLowerCase().includes(searchLower) ||
        option.description?.toLowerCase().includes(searchLower),
    )
  }, [options, search, searchable])

  const handleSelect = (selectedValue: string) => {
    if (clearable && selectedValue === value) {
      onValueChange?.('')
    } else {
      onValueChange?.(selectedValue)
    }
    setOpen(false)
    setSearch('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
          disabled={disabled || loading}
        >
          {selectedOption ? (
            <span className="truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={!searchable}>
          {searchable && (
            <CommandInput
              placeholder={searchPlaceholder}
              value={search}
              onValueChange={setSearch}
            />
          )}
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  disabled={option.disabled}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="truncate">{option.label}</span>
                    {option.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        {option.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
