import { Languages } from 'lucide-react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/atoms/button'
import { DropdownMenu } from '@/components/molecules/dropdown-menu'
import { cn } from '@/lib/utils'

type LanguageSwitcherProps = {
  className?: string
  variant?: 'icon' | 'full'
}

type LanguageOption = {
  code: string
  name: string
  flag: string
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'vi',
    name: 'Tiếng Việt',
    flag: '🇻🇳',
  },
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
]

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className, variant = 'icon' }) => {
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language || 'vi'
  const currentLanguageData = LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[0]

  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode)
  }

  const languageItems = [
    {
      type: 'label' as const,
      key: 'language-label',
      label: 'Select Language',
    },
    ...LANGUAGES.map(lang => ({
      type: 'item' as const,
      key: lang.code,
      label: (
        <div className="flex items-center gap-2">
          <span>{lang.flag}</span>
          <span>{lang.name}</span>
          {currentLanguage === lang.code && <span className="ml-auto text-primary">✓</span>}
        </div>
      ),
      onClick: () => handleLanguageChange(lang.code),
    })),
  ]

  return (
    <DropdownMenu
      trigger={
        <Button
          variant={variant === 'full' ? 'outline' : 'ghost'}
          size={variant === 'full' ? undefined : 'icon'}
          className={cn(variant === 'icon' && 'h-9 w-9', className)}
        >
          <Languages className="h-5 w-5" />
          <span className={cn(variant === 'icon' && 'sr-only')}>
            {currentLanguageData.name ?? 'Change language'}
          </span>
        </Button>
      }
      items={languageItems}
    />
  )
}

export default LanguageSwitcher
