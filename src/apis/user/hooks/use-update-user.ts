import { useMutation, useQueryClient } from '@tanstack/react-query'

import { UserEditFormData } from '@/commons/validates/user'

import { updateUser } from '../cores/update-user'

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserEditFormData }) => updateUser(id, data),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['users', data.id] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
