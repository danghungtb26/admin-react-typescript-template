import React from 'react'

import Avatar from '@/components/molecules/avatar'
import LanguageSwitcher from '@/components/molecules/language-switcher'
import { useAuthContext } from '@/contexts/auth/context'
import { useSetting } from '@/contexts/setting/context'

const UserProfile: React.FC = () => {
  const { user } = useAuthContext()
  const { sidebarCollapsed } = useSetting()

  if (sidebarCollapsed) {
    return (
      <div className="border-t border-sidebar-border p-4">
        <LanguageSwitcher />
      </div>
    )
  }

  return (
    <div className="border-t border-sidebar-border p-4">
      <div className="flex items-center gap-3 mb-3">
        <Avatar
          src={user.avatar || 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'}
          fallback={user.name || 'User'}
          size="sm"
          alt={user.name || 'User'}
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-sidebar-text truncate">
            {user.name || 'User Name'}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {user.email || 'user@example.com'}
          </div>
        </div>
      </div>

      <LanguageSwitcher variant="full" />
    </div>
  )
}

export default UserProfile
