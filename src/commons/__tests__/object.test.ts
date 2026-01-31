import { isExist, findDifferent, removeIfNotExist } from '../object'

describe('isExist', () => {
  test('returns true for defined values', () => {
    expect(isExist(0)).toBe(true)
    expect(isExist('')).toBe(true)
    expect(isExist(false)).toBe(true)
    expect(isExist(1)).toBe(true)
    expect(isExist('hello')).toBe(true)
  })

  test('returns false for null and undefined', () => {
    expect(isExist(null)).toBe(false)
    expect(isExist(undefined)).toBe(false)
  })

  test('returns false for string "null" and "undefined"', () => {
    expect(isExist('null')).toBe(false)
    expect(isExist('undefined')).toBe(false)
  })
})

describe('findDifferent', () => {
  test('returns empty array when objects are equal', () => {
    expect(findDifferent({ a: 1, b: 2 }, { a: 1, b: 2 })).toEqual([])
  })

  test('returns keys that differ between objects', () => {
    expect(findDifferent({ a: 1, b: 2 }, { a: 1, b: 3 })).toEqual(['b'])
    expect(findDifferent({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 4 })).toEqual(['c'])
  })

  test('returns multiple keys when multiple values differ', () => {
    expect(findDifferent({ a: 1, b: 2 }, { a: 10, b: 20 })).toEqual(['a', 'b'])
  })

  test('compares based on first object keys', () => {
    expect(findDifferent({ a: 1 }, { a: 1, b: 2 })).toEqual([])
  })
})

describe('removeIfNotExist', () => {
  test('removes null and undefined values', () => {
    const obj = { a: 1, b: null, c: undefined, d: 2 }
    expect(removeIfNotExist(obj)).toEqual({ a: 1, d: 2 })
  })

  test('removes string "null" and "undefined"', () => {
    const obj = { a: 'null', b: 'undefined', c: 'valid' }
    expect(removeIfNotExist(obj)).toEqual({ c: 'valid' })
  })

  test('keeps falsy but existing values like 0 and false', () => {
    const obj = { a: 0, b: false, c: '' }
    expect(removeIfNotExist(obj)).toEqual({ a: 0, b: false, c: '' })
  })
})
