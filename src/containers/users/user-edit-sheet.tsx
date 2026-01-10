import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Sheet } from '@/components/molecules/sheet'

import { UserEditForm } from './components/user-edit-form'

export type UserEditSheetProps = {
  onSuccess?: () => void
}

export function UserEditSheet({ onSuccess }: UserEditSheetProps) {
  const { eUserId: userId, ...rest } = useSearch({ strict: false })

  const navigate = useNavigate()

  const { t } = useTranslation()

  const handleClose = () => {
    navigate({ search: { ...rest, userId: undefined } })
  }

  const handleSuccess = () => {
    handleClose()
    onSuccess?.()
  }

  const handleCancel = () => {
    handleClose()
  }

  const openState = Boolean(userId)

  return (
    <Sheet
      open={openState}
      onOpenChange={open => {
        if (!open) {
          handleClose()
        }
      }}
      onClose={handleClose}
      title={userId ? t('users.edit_user.title') : t('users.create_user.title')}
      description={userId ? t('users.edit_user.description') : t('users.create_user.description')}
      side="right"
      contentClassName="sm:max-w-2xl"
      className="overflow-y-auto px-4 pb-4"
    >
      <UserEditForm userId={userId} onSuccess={handleSuccess} onCancel={handleCancel} />
    </Sheet>
  )
}
