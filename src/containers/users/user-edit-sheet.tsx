import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { UserEditFormData } from '@/commons/validates/user'
import { Sheet } from '@/components/molecules/sheet'

import { UserEditForm } from './components/user-edit-form'

export type UserEditSheetProps = {
  userId?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: () => void
}

export function UserEditSheet({ userId, open, onOpenChange, onSuccess }: UserEditSheetProps) {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: UserEditFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement API call to update user
      console.log('Submitting user data:', data)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock API call

      // Close drawer and notify success
      onOpenChange?.(false)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to update user:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange?.(false)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={userId ? t('users.edit_user.title') : t('users.create_user.title')}
      description={userId ? t('users.edit_user.description') : t('users.create_user.description')}
      side="right"
      contentClassName="sm:max-w-2xl"
      className="overflow-y-auto px-4 pb-4"
    >
      <UserEditForm
        userId={userId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </Sheet>
  )
}
