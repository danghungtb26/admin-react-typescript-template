import { field } from '@decorators/field'
import { model } from '@decorators/model'

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
  gender?: number

  @field()
  name?: string

  @field()
  phone?: string

  public toAddJson() {
    return {
      ...this.toJson(),
    }
  }
}
