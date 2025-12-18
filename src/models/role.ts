import { Base } from './base'
import { Permission } from './permission'

import { field } from '@/decorators/field'
import { model } from '@/decorators/model'

@model()
export class Role extends Base {
  @field()
  name?: string

  @field()
  description?: string

  @field()
  scopes?: string[]

  @field('permissions', [Permission])
  permissions?: Permission[]

  static get default() {
    return this.fromJson({})
  }
}
