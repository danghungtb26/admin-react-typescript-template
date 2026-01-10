import { UserEditFormData } from '@/commons/validates/user'
import { User } from '@/models/user'

import { MOCK_USERS } from '../mock-data'

import { delay } from './helpers'

export const updateUser = async (userId: string, data: UserEditFormData): Promise<User> => {
  await delay(1000)
  console.log(`API: Updating user ${userId}`, data)

  const index = MOCK_USERS.findIndex(u => u.id === userId)
  if (index !== -1) {
    const updated = {
      ...MOCK_USERS[index],
      ...data,
    }
    MOCK_USERS[index] = updated
    return User.fromJson(updated)
  }

  throw new Error('User not found')
}
