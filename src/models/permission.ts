import { field } from '@decorators/field'
import { model } from '@decorators/model'

import { Base } from './base'

@model()
export class Permission extends Base {
  @field()
  declare id?: string

  @field()
  name?: string

  @field()
  scope?: string

  @field()
  description?: string

  @field()
  scopes?: string[]

  static get default() {
    return this.fromJson({})
  }
}

export const getScopesOfPermissions = (permissions: Permission[]) => {
  return permissions.reduce<string[]>((a, b) => {
    return a.concat(b.scopes ?? [])
  }, [])
}
