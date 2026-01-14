import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Select } from '@/components/molecules/select'

export type Gender = 'male' | 'female' | 'other'

export interface GenderSelectProps {
  /**
   * The selected gender value
   */
  value?: Gender
  /**
   * Callback when gender changes
   */
  onChange?: (value: Gender) => void
  /**
   * Placeholder text when no gender is selected
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
}

/**
 * GenderSelect component for selecting gender
 * Uses hardcoded options with i18n support
 *
 * @example
 * ```tsx
 * <GenderSelect
 *   value={gender}
 *   onChange={setGender}
 *   placeholder="Select gender"
 * />
 * ```
 */
export function GenderSelect({
  value,
  onChange,
  placeholder,
  className,
  disabled,
}: GenderSelectProps) {
  const { t } = useTranslation()

  const options = React.useMemo(
    () => [
      {
        value: 'male' as Gender,
        label: t('template.form.options.gender.male'),
      },
      {
        value: 'female' as Gender,
        label: t('template.form.options.gender.female'),
      },
      {
        value: 'other' as Gender,
        label: t('template.form.options.gender.other'),
      },
    ],
    [t],
  )

  return (
    <Select
      value={value}
      onValueChange={value => onChange?.(value as Gender)}
      options={options}
      placeholder={placeholder || t('template.form.placeholders.select_gender')}
      className={className}
      disabled={disabled}
    />
  )
}
