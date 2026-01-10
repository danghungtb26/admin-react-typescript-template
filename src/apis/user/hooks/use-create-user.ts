import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createUser } from '../cores/create-user'

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
