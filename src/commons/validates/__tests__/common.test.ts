import {
  emailSchema,
  nameSchema,
  phoneSchema,
  avatarSchema,
  birthdaySchema,
  genderSchema,
} from '../common'

describe('emailSchema', () => {
  test('accepts valid email', () => {
    expect(emailSchema.safeParse('test@example.com').success).toBe(true)
  })

  test('rejects invalid email', () => {
    expect(emailSchema.safeParse('invalid').success).toBe(false)
    expect(emailSchema.safeParse('').success).toBe(false)
  })
})

describe('nameSchema', () => {
  test('accepts non-empty string', () => {
    expect(nameSchema.safeParse('John').success).toBe(true)
  })

  test('rejects empty string', () => {
    expect(nameSchema.safeParse('').success).toBe(false)
  })
})

describe('phoneSchema', () => {
  test('accepts string', () => {
    expect(phoneSchema.safeParse('0123456789').success).toBe(true)
  })

  test('accepts undefined', () => {
    expect(phoneSchema.safeParse(undefined).success).toBe(true)
  })
})

describe('avatarSchema', () => {
  test('accepts optional string', () => {
    expect(avatarSchema.safeParse('https://example.com/avatar.png').success).toBe(true)
    expect(avatarSchema.safeParse(undefined).success).toBe(true)
  })
})

describe('birthdaySchema', () => {
  test('accepts optional string', () => {
    expect(birthdaySchema.safeParse('1990-01-15').success).toBe(true)
  })
})

describe('genderSchema', () => {
  test('accepts male, female, other', () => {
    expect(genderSchema.safeParse('male').success).toBe(true)
    expect(genderSchema.safeParse('female').success).toBe(true)
    expect(genderSchema.safeParse('other').success).toBe(true)
  })

  test('rejects invalid gender', () => {
    expect(genderSchema.safeParse('invalid').success).toBe(false)
  })
})
