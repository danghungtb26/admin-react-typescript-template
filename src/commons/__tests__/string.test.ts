import { slugify } from '../string'

describe('slugify', () => {
  test('converts Vietnamese text to slug', () => {
    expect(slugify('Tiếng Việt')).toBe('tieng-viet')
    expect(slugify('Việt Nam')).toBe('viet-nam')
  })

  test('converts Vietnamese diacritics to ASCII', () => {
    expect(slugify('àáạảã')).toBe('aaaaa')
    expect(slugify('đ')).toBe('d')
    expect(slugify('Đ')).toBe('d')
  })

  test('trims and lowercases', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world')
  })

  test('replaces spaces and underscores with hyphens', () => {
    expect(slugify('hello_world test')).toBe('hello-world-test')
  })

  test('removes non-word characters', () => {
    expect(slugify('hello@world!')).toBe('helloworld')
  })

  test('removes leading and trailing hyphens', () => {
    expect(slugify('-hello-')).toBe('hello')
  })
})
