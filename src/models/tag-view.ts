import { generateRandomId } from '@/commons/id'
import { field } from '@/decorators/field'
import { model } from '@/decorators/model'

import { Base } from './base'

@model()
export class TagViewModel extends Base {
  @field()
  override id: string = generateRandomId()

  @field()
  title?: string

  @field('title_key')
  titleKey?: string

  @field()
  path?: string

  @field()
  params?: unknown

  @field()
  deletable: boolean = true

  static _dashboard: TagViewModel

  static get dashboard() {
    if (!this._dashboard) {
      const tagView = TagViewModel.fromJson({
        title: 'Dashboard',
        path: '/dashboard',
        deletable: false,
      })
      this._dashboard = tagView
    }
    return this._dashboard
  }
}
