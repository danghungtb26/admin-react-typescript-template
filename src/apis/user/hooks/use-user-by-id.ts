import { useQuery } from '@tanstack/react-query'

import { getUserById } from '../cores/get-user-by-id'

export const useUserById = (userId?: string) => {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  })
}
