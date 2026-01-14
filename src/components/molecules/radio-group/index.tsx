import { Label } from '@/components/atoms/label'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/radio-group'
import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupFieldProps {
  /**
   * Array of radio options
   */
  options: RadioOption[]
  /**
   * The selected value
   */
  value?: string
  /**
   * Callback when value changes
   */
  onValueChange?: (value: string) => void
  /**
   * Custom className for the container
   */
  className?: string
  /**
   * Disabled state for all options
   */
  disabled?: boolean
  /**
   * Layout orientation
   * @default "vertical"
   */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * RadioGroupField molecule component for selecting one option from a list
 *
 * @example
 * ```tsx
 * <RadioGroupField
 *   options={[
 *     { value: 'male', label: 'Male' },
 *     { value: 'female', label: 'Female' },
 *     { value: 'other', label: 'Other' }
 *   ]}
 *   value={gender}
 *   onValueChange={setGender}
 * />
 * ```
 */
export function RadioGroupField({
  options,
  value,
  onValueChange,
  className,
  disabled,
  orientation = 'vertical',
}: RadioGroupFieldProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className={cn(
        orientation === 'horizontal' && 'flex flex-wrap gap-4',
        orientation === 'vertical' && 'space-y-2',
        className,
      )}
      disabled={disabled}
    >
      {options.map(option => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.value}
            id={option.value}
            disabled={option.disabled || disabled}
          />
          <Label htmlFor={option.value} className={option.disabled ? 'opacity-50' : ''}>
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
