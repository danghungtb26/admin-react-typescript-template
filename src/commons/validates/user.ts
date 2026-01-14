import { z } from 'zod/v4'

import {
  avatarSchema,
  birthdaySchema,
  emailSchema,
  genderSchema,
  nameSchema,
  phoneSchema,
} from './common'

export const userEditSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  avatar: avatarSchema,
  birthday: birthdaySchema,
  gender: genderSchema,
})

export type UserEditFormData = z.infer<typeof userEditSchema>
