import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useCreateUser } from '@/apis/user/hooks/use-create-user'
import { UserEditFormData } from '@/commons/validates/user'

import { UserForm } from '../user-form'

export type CreateUserFormProps = {
  onSuccess?: () => void
  onCancel: () => void
}

export const CreateUserForm = ({ onSuccess, onCancel }: CreateUserFormProps) => {
  const { t } = useTranslation()
  const { mutateAsync, isPending } = useCreateUser()

  const handleSubmit = async (data: UserEditFormData) => {
    try {
      await mutateAsync(data)
      toast.success(t('users.create_user.success_message'))
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create user:', error)
      toast.error(t('common.error.something_went_wrong'))
    }
  }

  return <UserForm onSubmit={handleSubmit} onCancel={onCancel} isSubmitting={isPending} />
}
