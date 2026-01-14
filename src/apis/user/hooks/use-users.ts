import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getUsers, ListUsersParams } from '../cores/get-users'

export const useUsers = (params?: ListUsersParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params || {}),
    placeholderData: keepPreviousData,
  })
}
