import { field } from '@/decorators/field'
import { model } from '@/decorators/model'

import { Address } from './address'
import { Base } from './base'

@model()
export class User extends Base {
  @field('address', Address)
  address?: Address

  @field()
  avatar?: string

  @field()
  birthday?: string

  @field()
  gender?: 'male' | 'female' | 'other'

  @field()
  name?: string

  @field()
  email?: string

  @field()
  phone?: string

  @field()
  location?: string

  @field()
  company?: { name: string; logo: string }

  @field()
  status?: 'Online' | 'Offline'

  public toAddJson() {
    return {
      ...this.toJson(),
    }
  }
}
