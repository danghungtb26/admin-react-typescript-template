import { z } from 'zod/v4'

export const emailSchema = z.string().email({ message: 'Invalid email address' })

export const nameSchema = z.string().min(1, { message: 'Name is required' })

export const phoneSchema = z.string().optional()

export const avatarSchema = z.string().optional()

export const birthdaySchema = z.string().optional()

export const genderSchema = z.enum(['male', 'female', 'other']).optional()
