import { useNavigate, useSearch } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { Sheet } from '@/components/molecules/sheet'

import { CreateUserForm } from './components/create-user-form'
import { EditUserForm } from './components/edit-user-form'

export type UserEditSheetProps = {
  onSuccess?: () => void
}

export function UserEditSheet({ onSuccess }: UserEditSheetProps) {
  const { eUserId: userId, createUser: create, ...rest } = useSearch({ strict: false })

  const navigate = useNavigate()

  const { t } = useTranslation()

  const handleClose = () => {
    navigate({ search: { ...rest, eUserId: undefined, createUser: undefined } })
  }

  const handleSuccess = () => {
    handleClose()
    onSuccess?.()
  }

  const handleCancel = () => {
    handleClose()
  }

  const openState = Boolean(create || userId)

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
      onOpenAutoFocus={e => e.preventDefault()}
    >
      {userId ? (
        <EditUserForm userId={userId as string} onSuccess={handleSuccess} onCancel={handleCancel} />
      ) : (
        <CreateUserForm onSuccess={handleSuccess} onCancel={handleCancel} />
      )}
    </Sheet>
  )
}
