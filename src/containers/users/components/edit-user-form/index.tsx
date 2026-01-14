import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useUpdateUser } from '@/apis/user/hooks/use-update-user'
import { useUserById } from '@/apis/user/hooks/use-user-by-id'
import { UserEditFormData } from '@/commons/validates/user'
import { Spinner } from '@/components/atoms/spinner'

import { UserForm } from '../user-form'

export type EditUserFormProps = {
  userId: string
  onSuccess?: () => void
  onCancel: () => void
}

export const EditUserForm = ({ userId, onSuccess, onCancel }: EditUserFormProps) => {
  const { t } = useTranslation()
  const { data: userData, isLoading: isLoadingUser } = useUserById(userId)
  const { mutateAsync, isPending } = useUpdateUser()

  const handleSubmit = async (data: UserEditFormData) => {
    try {
      await mutateAsync({ id: userId, data })
      toast.success(t('users.edit_user.success_message'))
      onSuccess?.()
    } catch (error) {
      console.error('Failed to update user:', error)
      toast.error(t('common.error.something_went_wrong'))
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  // Convert User model to form data structure if needed
  // Assuming strict type compatibility for now, but explicit mapping is safer
  const initialData: Partial<UserEditFormData> | undefined = userData
    ? {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        avatar: userData.avatar,
        birthday: userData.birthday,
        gender: userData.gender,
      }
    : undefined

  return (
    <UserForm
      defaultValues={initialData}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isSubmitting={isPending}
    />
  )
}
