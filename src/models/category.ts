import { field } from '@/decorators/field'
import { model } from '@/decorators/model'

import { Base } from './base'

@model()
export class Category extends Base {
  @field()
  name!: string

  @field()
  description?: string
}
