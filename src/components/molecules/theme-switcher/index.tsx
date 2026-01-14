import { Monitor, Moon, Sun } from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Theme } from '@/commons/cookies'
import { Label } from '@/components/atoms/label'
import { RadioGroup, RadioGroupItem } from '@/components/atoms/radio-group'
import { useSetting } from '@/contexts/setting/context'

export interface ThemeSwitcherProps {
  /**
   * Custom className
   */
  className?: string
  /**
   * Show labels for each option
   * @default true
   */
  showLabels?: boolean
}

/**
 * ThemeSwitcher component for switching between light, dark, and system themes
 *
 * @example
 * ```tsx
 * <ThemeSwitcher />
 * ```
 */
export function ThemeSwitcher({ className, showLabels = true }: ThemeSwitcherProps) {
  const { theme, setTheme } = useSetting()
  const { t } = useTranslation()

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: t('settings.theme.light'),
      icon: <Sun className="h-4 w-4" />,
    },
    {
      value: 'dark',
      label: t('settings.theme.dark'),
      icon: <Moon className="h-4 w-4" />,
    },
    {
      value: 'system',
      label: t('settings.theme.system'),
      icon: <Monitor className="h-4 w-4" />,
    },
  ]

  return (
    <RadioGroup
      value={theme}
      onValueChange={value => setTheme(value as Theme)}
      className={className}
    >
      {themes.map(({ value, label, icon }) => (
        <div key={value} className="flex items-center space-x-2">
          <RadioGroupItem value={value} id={`theme-${value}`} />
          <Label
            htmlFor={`theme-${value}`}
            className="flex items-center gap-2 cursor-pointer font-normal"
          >
            {icon}
            {showLabels && <span>{label}</span>}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
