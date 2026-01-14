import { model } from '@/decorators/model'

import { Base } from './base'

@model()
export class Address extends Base {
  detail: string = ''

  lat: number = 0

  lng: number = 0

  url: string = ''

  country?: string

  province?: string

  district?: string

  ward?: string
}
