import { field } from '@/decorators/field'
import { model } from '@/decorators/model'

import { Base } from './base'
import { User } from './user'

@model()
export class Account extends Base {
  @field()
  delete?: boolean

  @field()
  email?: string

  @field()
  status?: number

  @field('user_id')
  userId?: string

  @field('username')
  username?: string

  password?: string

  avatar?: string = ''

  name?: string = ''

  phone?: string = ''

  birthday?: string = ''

  gender?: string = ''

  note?: string = ''

  @field('confirm_password')
  confirmPassword?: string = ''

  facebook?: string = ''

  @field('user', User)
  user?: User

  public toAddJson() {
    return {
      ...this.toJson(),
    }
  }
}
