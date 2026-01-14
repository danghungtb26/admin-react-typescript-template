import { useQuery } from '@tanstack/react-query'

import { getCategories, GetCategoriesParams } from '../cores/get-categories'

export const useCategories = (params?: GetCategoriesParams) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params || {}),
  })
}
