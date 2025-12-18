import 'reflect-metadata'
import { isNull } from 'lodash'
import forEach from 'lodash/forEach'
import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'

import { fieldsKey } from './constants'

const getFieldType = (fieldType: unknown) => {
  if (typeof fieldType === 'function') {
    try {
      return fieldType()
    } catch {
      return fieldType
    }
  }

  return fieldType
}

export const model = () => {
  return <T extends { new (...args: unknown[]): object }>(constructor: T) => {
    // @ts-expect-error - Complex generic type inheritance
    return class extends constructor {
      base_name = constructor.name

      constructor(json: Record<string, unknown>) {
        super(json)
        const keys = getAllKeys(this)
        forEach(keys, key => {
          if (!isUndefined(key) && !isNull(key)) {
            const { propertyKey, fieldName, fieldType } = key
            const FieldType = getFieldType(fieldType)
            const value = get(json, fieldName)
            if (!isUndefined(value) && !isNull(value)) {
              if (FieldType) {
                if (Array.isArray(FieldType) && FieldType.length === 1) {
                  if (Array.isArray(value)) {
                    // @ts-expect-error - Dynamic key assignment
                    this[propertyKey] = value.map(i => new FieldType[0](i))
                    return
                  }
                  throw new Error(
                    `Không thể convert dữ liệu JSON sang dạng mảng được. PropertyKey: ${propertyKey}, Contructor: ${this.base_name}`,
                  )
                }
                // @ts-expect-error - Dynamic key assignment
                this[propertyKey] = new FieldType(value)
                return
              }

              // @ts-expect-error - Dynamic key assignment
              this[propertyKey] = value
            }
          }
        })
        // @ts-expect-error - Dynamic method call
        this.afterMounted?.(json)
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getField = (target: any, key: string) => {
  const fields =
    Reflect.getMetadata(fieldsKey, target, target.base_name || target.constructor.name) || []

  const fieldData = fields.find((field: { propertyKey: string }) => field.propertyKey === key)
  return fieldData?.fieldName
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAllKeys = (target: any) => {
  return Reflect.getMetadata(fieldsKey, target, target.base_name)
}
