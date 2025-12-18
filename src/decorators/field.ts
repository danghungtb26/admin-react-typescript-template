import { defaultFields, fieldsKey } from './constants'

export const field = (
  fieldName?: string,
  fieldType?: object | [object] | (() => object | [object]),
) => {
  return (target: object, propertyKey: string) => {
    if (fieldType && Array.isArray(fieldType) && fieldType.length !== 1) {
      throw new Error(
        `Chỉ nhận 1 kiểu dữ liệu. PropertyKey: ${propertyKey}, Contructor: ${target.constructor.name}`,
      )
    }
    let fields =
      Reflect.getMetadata(fieldsKey, target, target.constructor.name) ??
      (Reflect.getMetadata(fieldsKey, target, 'Base') || defaultFields)

    fields = fields.concat([{ fieldName: fieldName || propertyKey, propertyKey, fieldType }])
    Reflect.defineMetadata(fieldsKey, fields, target, target.constructor.name)
  }
}
