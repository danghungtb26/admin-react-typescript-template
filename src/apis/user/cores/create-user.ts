import { UserEditFormData } from '@/commons/validates/user'
import { User } from '@/models/user'

import { MOCK_USERS } from '../mock-data'

import { delay } from './helpers'

export const createUser = async (data: UserEditFormData): Promise<User> => {
  await delay(1000)
  console.log('API: Creating user', data)

  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    ...data,
    company: { name: 'Unknown', logo: '' },
    location: 'Unknown',
    status: 'Offline' as const,
  }

  // @ts-expect-error - MOCK_USERS type inference might miss some optional fields
  MOCK_USERS.unshift(newUser)

  return User.fromJson(newUser)
}
