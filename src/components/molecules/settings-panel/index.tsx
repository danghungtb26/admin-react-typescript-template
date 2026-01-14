import { useTranslation } from 'react-i18next'

import { Label } from '@/components/atoms/label'
import { Separator } from '@/components/atoms/separator'
import { Switch } from '@/components/atoms/switch'
import { Sheet } from '@/components/molecules/sheet'
import { ThemeSwitcher } from '@/components/molecules/theme-switcher'
import { useSetting } from '@/contexts/setting/context'

export interface SettingsPanelProps {
  /**
   * Control the open state
   */
  open: boolean
  /**
   * Callback when open state changes
   */
  onOpenChange: (open: boolean) => void
}

/**
 * SettingsPanel component for theme and layout customization
 *
 * @example
 * ```tsx
 * <SettingsPanel open={isOpen} onOpenChange={setIsOpen} />
 * ```
 */
export function SettingsPanel({ open, onOpenChange }: SettingsPanelProps) {
  const { t } = useTranslation()
  const {
    fixedHeader,
    toggleFixedHeader,
    showTagView,
    toggleShowTagView,
    sidebarCollapsed,
    toggleSidebarCollapsed,
  } = useSetting()

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={t('settings.title')}
      side="right"
      contentClassName="w-100 sm:w-135"
    >
      <div className="space-y-6">
        {/* Theme Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">{t('settings.sections.appearance')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('settings.sections.appearance_description')}
            </p>
          </div>
          <ThemeSwitcher />
        </div>

        <Separator />

        {/* Layout Section */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">{t('settings.sections.layout')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('settings.sections.layout_description')}
            </p>
          </div>

          <div className="space-y-4">
            {/* Fixed Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="fixed-header" className="cursor-pointer">
                  {t('settings.layout.fixed_header')}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t('settings.layout.fixed_header_description')}
                </p>
              </div>
              <Switch id="fixed-header" checked={fixedHeader} onCheckedChange={toggleFixedHeader} />
            </div>

            {/* Show Tag View */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-tagview" className="cursor-pointer">
                  {t('settings.layout.show_tagview')}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t('settings.layout.show_tagview_description')}
                </p>
              </div>
              <Switch id="show-tagview" checked={showTagView} onCheckedChange={toggleShowTagView} />
            </div>

            {/* Collapsed Sidebar */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="collapsed-sidebar" className="cursor-pointer">
                  {t('settings.layout.collapsed_sidebar')}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t('settings.layout.collapsed_sidebar_description')}
                </p>
              </div>
              <Switch
                id="collapsed-sidebar"
                checked={sidebarCollapsed}
                onCheckedChange={toggleSidebarCollapsed}
              />
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  )
}
