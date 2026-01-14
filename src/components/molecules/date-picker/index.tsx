import { parseDate } from 'chrono-node'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/atoms/button'
import { Calendar } from '@/components/atoms/calendar'
import { Input } from '@/components/atoms/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/popover'
import { cn } from '@/lib/utils'

export interface DatePickerProps {
  /**
   * The selected date
   */
  value?: Date
  /**
   * Callback when date changes
   */
  onChange?: (date: Date | undefined) => void
  /**
   * Placeholder text when no date is selected
   * @default "Pick a date"
   */
  placeholder?: string
  /**
   * Disabled dates
   */
  disabled?: boolean | ((date: Date) => boolean)
  /**
   * Custom className for the trigger button or input
   */
  className?: string
  /**
   * Date format string (using dayjs format)
   * @default "MMMM DD, YYYY"
   */
  dateFormat?: string
  /**
   * Mode: 'select' for button trigger or 'input' for text input with natural language support
   * @default "select"
   */
  mode?: 'select' | 'input'
}

/**
 * DatePicker component that combines Calendar with Popover
 * Supports two modes: select (button) and input (natural language)
 *
 * @example
 * ```tsx
 * <DatePicker
 *   value={date}
 *   onChange={setDate}
 *   placeholder="Select date"
 *   mode="select"
 * />
 * ```
 */
export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled,
  className,
  dateFormat = 'MMMM DD, YYYY',
  mode = 'select',
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<Date | undefined>(value)
  const [month, setMonth] = React.useState<Date | undefined>(value)

  // Sync internal state when prop changes
  React.useEffect(() => {
    setInternalValue(value)
    setMonth(value)
  }, [value])

  const formattedDate = React.useMemo(
    () => (internalValue ? dayjs(internalValue).format(dateFormat) : ''),
    [internalValue, dateFormat],
  )

  const handleDateChange = (date: Date | undefined) => {
    setInternalValue(date)
    onChange?.(date)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedDate = parseDate(e.target.value)
    if (parsedDate) {
      setInternalValue(parsedDate)
      setMonth(parsedDate)
      onChange?.(parsedDate)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
    }
  }

  const handleCalendarSelect = (date: Date | undefined) => {
    handleDateChange(date)
    setOpen(false)
  }

  if (mode === 'input') {
    return (
      <div className={cn('relative flex gap-2', className)}>
        <Input
          value={formattedDate}
          placeholder={placeholder}
          className="bg-background pr-10"
          disabled={typeof disabled === 'boolean' ? disabled : false}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
              disabled={typeof disabled === 'boolean' ? disabled : false}
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">{placeholder}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end" alignOffset={-8} sideOffset={10}>
            <Calendar
              mode="single"
              selected={internalValue}
              month={month}
              onMonthChange={setMonth}
              onSelect={handleCalendarSelect}
              disabled={disabled}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !internalValue && 'text-muted-foreground',
            className,
          )}
          disabled={typeof disabled === 'boolean' ? disabled : false}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedDate ? formattedDate : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={internalValue}
          onSelect={handleDateChange}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
