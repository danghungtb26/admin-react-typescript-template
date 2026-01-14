import { isNull, isUndefined } from 'lodash'
import clone from 'lodash/clone'

import dateTime from '@/commons/datetime'
import { HH_MM_SS_DD_MM_YYYY } from '@/commons/datetime/format'
import { field } from '@/decorators/field'
import { getAllKeys } from '@/decorators/model'

export abstract class Base {
  @field('created_at')
  createdAt?: string

  @field('deleted_at')
  deletedAt?: string

  @field('updated_at')
  updatedAt?: string

  @field()
  id?: string

  @field()
  order?: number

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(_json?: unknown) {}

  afterMounted() {}

  toJson() {
    const keys = getAllKeys(this)

    if (!Array.isArray(keys)) return {}

    const value = keys.reduce((a, key) => {
      if (!isUndefined(key) && !isNull(key)) {
        const { propertyKey, fieldName, fieldType: FieldType } = key

        // @ts-expect-error dynamic key
        let v = this[propertyKey]
        if (!isUndefined(v) && !isNull(v)) {
          if (Array.isArray(FieldType) && FieldType.length === 1) {
            if (Array.isArray(v)) {
              v = v.map(i => i.toJson())
              return { ...a, [fieldName]: v }
            }
          }

          if (FieldType) {
            v = v.toJson()

            return { ...a, [fieldName]: v }
          }
          return { ...a, [fieldName]: v }
        }
      }
      return a
    }, {})
    return value
  }

  createdAtFormatted = () => {
    if (!this.createdAt) return ''
    return dateTime(this.createdAt).format(HH_MM_SS_DD_MM_YYYY)
  }

  updatedAtFormatted = () => {
    if (!this.createdAt) return ''
    return dateTime(this.createdAt).format(HH_MM_SS_DD_MM_YYYY)
  }

  static fromJson<TCtor extends new (...args: unknown[]) => unknown>(
    this: TCtor,
    json?: unknown,
    ...rest: unknown[]
  ): InstanceType<TCtor> {
    return new this(json ?? {}, ...rest) as InstanceType<TCtor>
  }

  static clone<T>(d?: T) {
    // @ts-expect-error this is a generic type
    return d ? clone(d) : new this({})
  }
}
