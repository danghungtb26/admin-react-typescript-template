export const getFieldType = (fieldType: unknown) => {
  if (typeof fieldType === 'function') {
    try {
      return fieldType()
    } catch {
      return fieldType
    }
  }

  return fieldType
}
