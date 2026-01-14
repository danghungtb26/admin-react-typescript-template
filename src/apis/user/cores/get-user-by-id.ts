import { User } from '@/models/user'

import { MOCK_USERS } from '../mock-data'

import { delay } from './helpers'

export const getUserById = async (userId: string): Promise<User> => {
  await delay(1000)
  console.log(`API: Fetching user ${userId}`)

  const user = MOCK_USERS.find(u => u.id === userId)

  if (!user) {
    throw new Error('User not found')
  }

  return User.fromJson(user)
}
