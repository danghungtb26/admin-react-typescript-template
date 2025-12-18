import { isEqual, isNull, isUndefined, reduce } from 'lodash'

export const isExist = (value: unknown) => {
  return !isNull(value) && !isUndefined(value) && value !== 'null' && value !== 'undefined'
}

export const findDifferent = (a: Record<string, unknown>, b: Record<string, unknown>) => {
  return reduce(
    a,
    (result, value, key) => {
      return isEqual(value, b[key]) ? result : result.concat(key)
    },
    [] as string[],
  )
}

export const removeIfNotExist: <T extends Record<string, unknown>>(value: T) => T = value => {
  Object.keys(value).forEach(key => (!isExist(value[key]) ? delete value[key] : {}))
  return value
}
