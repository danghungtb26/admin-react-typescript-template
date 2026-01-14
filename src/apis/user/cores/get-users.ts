import { Pagination } from '@/models/pagination'
import { User } from '@/models/user'

import { MOCK_USERS } from '../mock-data'

import { delay } from './helpers'

export type ListUsersParams = {
  page?: number
  pageSize?: number
  sorting?: { id: string; desc: boolean }[]
  filters?: { id: string; value: unknown }[]
}

export type ListUsersResponse = {
  data: User[]
  meta: Pagination
}

export const getUsers = async (params: ListUsersParams): Promise<ListUsersResponse> => {
  await delay(1000)

  let result = [...MOCK_USERS]

  if (params.filters?.length) {
    params.filters.forEach(filter => {
      if (filter.value !== undefined && filter.value !== null && filter.value !== '') {
        result = result.filter(user => {
          const value = user[filter.id as keyof typeof user]
          if (typeof value === 'string' && typeof filter.value === 'string') {
            return value.toLowerCase().includes(filter.value.toLowerCase())
          }
          return value === filter.value
        })
      }
    })
  }

  if (params.sorting?.length) {
    const sort = params.sorting[0]
    result.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valA = (a as any)[sort.id]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const valB = (b as any)[sort.id]
      if (valA < valB) return sort.desc ? 1 : -1
      if (valA > valB) return sort.desc ? -1 : 1
      return 0
    })
  }

  const page = params.page || 1
  const pageSize = params.pageSize || 10
  const total = result.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = result.slice(start, end).map(u => User.fromJson(u))

  return {
    data,
    meta: Pagination.fromJson({
      current_page: page,
      total_page: Math.ceil(total / pageSize),
      count: data.length,
      total,
      limit: pageSize,
    }),
  }
}
