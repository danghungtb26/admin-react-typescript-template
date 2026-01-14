import { Category } from '@/models/category'

import { mockCategories } from '../mock-data'

export type GetCategoriesParams = {
  search?: string
  limit?: number
}

export type GetCategoriesResponse = {
  data: Category[]
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const getCategories = async (
  params: GetCategoriesParams = {},
): Promise<GetCategoriesResponse> => {
  await delay(800)

  let filteredCategories = [...mockCategories]

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    filteredCategories = filteredCategories.filter(
      cat =>
        cat.name.toLowerCase().includes(searchLower) ||
        cat.description?.toLowerCase().includes(searchLower),
    )
  }

  // Apply limit
  if (params.limit) {
    filteredCategories = filteredCategories.slice(0, params.limit)
  }

  return {
    data: filteredCategories.map(cat => new Category(cat)),
  }
}
