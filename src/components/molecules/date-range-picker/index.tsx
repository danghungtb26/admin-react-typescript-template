import { parseDate } from 'chrono-node'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/atoms/button'
import { Calendar } from '@/components/atoms/calendar'
import { Input } from '@/components/atoms/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/atoms/popover'
import { cn } from '@/lib/utils'

export interface DateRangePickerProps {
  /**
   * The selected date range
   */
  value?: DateRange
  /**
   * Callback when date range changes
   */
  onChange?: (dateRange: DateRange | undefined) => void
  /**
   * Placeholder text when no range is selected
   * @default "Pick a date range"
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
   * @default "MMM DD, YYYY"
   */
  dateFormat?: string
  /**
   * Number of months to display
   * @default 2
   */
  numberOfMonths?: number
  /**
   * Mode: 'select' for button trigger or 'input' for text input with natural language support
   * @default "select"
   */
  mode?: 'select' | 'input'
}

function formatDateRange(value: DateRange | undefined, dateFormat: string) {
  if (!value?.from) {
    return ''
  }
  if (value.to) {
    return `${dayjs(value.from).format(dateFormat)} - ${dayjs(value.to).format(dateFormat)}`
  }
  return dayjs(value.from).format(dateFormat)
}

/**
 * DateRangePicker component for selecting a date range
 * Supports two modes: select (button) and input (natural language)
 *
 * @example
 * ```tsx
 * <DateRangePicker
 *   value={dateRange}
 *   onChange={setDateRange}
 *   placeholder="Select date range"
 *   mode="select"
 * />
 * ```
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date range',
  disabled,
  className,
  dateFormat = 'MMM DD, YYYY',
  numberOfMonths = 2,
  mode = 'select',
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<DateRange | undefined>(value)
  const [month, setMonth] = React.useState<Date | undefined>(value?.from)

  // Sync internal state when prop changes
  React.useEffect(() => {
    setInternalValue(value)
    setMonth(value?.from)
  }, [value])

  const formattedDateRangeText = React.useMemo(
    () => formatDateRange(internalValue, dateFormat),
    [internalValue, dateFormat],
  )

  const formattedDateRange = React.useMemo(() => {
    if (!internalValue?.from) return null
    if (internalValue.to) {
      return (
        <>
          {dayjs(internalValue.from).format(dateFormat)} -{' '}
          {dayjs(internalValue.to).format(dateFormat)}
        </>
      )
    }
    return dayjs(internalValue.from).format(dateFormat)
  }, [internalValue, dateFormat])

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    setInternalValue(dateRange)
    onChange?.(dateRange)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Try to parse as date range (e.g., "Jan 1 - Jan 7", "next week")
    const parts = e.target.value.split('-').map(s => s.trim())

    if (parts.length === 2) {
      const fromDate = parseDate(parts[0])
      const toDate = parseDate(parts[1])

      if (fromDate && toDate) {
        const dateRange = { from: fromDate, to: toDate }
        setInternalValue(dateRange)
        setMonth(fromDate)
        onChange?.(dateRange)
      }
    } else {
      // Try single date or natural language
      const parsedDate = parseDate(e.target.value)
      if (parsedDate) {
        const dateRange = { from: parsedDate, to: undefined }
        setInternalValue(dateRange)
        setMonth(parsedDate)
        onChange?.(dateRange)
      }
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
    }
  }

  const handleCalendarSelect = (dateRange: DateRange | undefined) => {
    handleDateRangeChange(dateRange)
    if (dateRange?.from && dateRange?.to) {
      setOpen(false)
    }
  }

  if (mode === 'input') {
    return (
      <div className={cn('relative flex gap-2', className)}>
        <Input
          value={formattedDateRangeText}
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
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={internalValue?.from}
              selected={internalValue}
              month={month}
              onMonthChange={setMonth}
              onSelect={handleCalendarSelect}
              numberOfMonths={numberOfMonths}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !internalValue && 'text-muted-foreground',
            )}
            disabled={typeof disabled === 'boolean' ? disabled : false}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formattedDateRange || <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={internalValue?.from}
            selected={internalValue}
            onSelect={handleDateRangeChange}
            numberOfMonths={numberOfMonths}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
