import { isExist } from '@/commons/object'

export const getEnv = (key: string) => {
  if (isExist(import.meta.env[key])) {
    return import.meta.env[key]
  }

  return ''
}

const ENV = {
  get AUTHENTICATOR_SUFFIX() {
    return import.meta.env.VITE_PUBLIC_AUTHENTICATOR_SUFFIX ?? ''
  },
  get AUTHENTICATOR_ADMIN_SUFFIX() {
    return import.meta.env.VITE_PUBLIC_AUTHENTICATOR_ADMIN_SUFFIX ?? ''
  },

  get AUTHENTICATOR_USER_SUFFIX() {
    return import.meta.env.VITE_PUBLIC_AUTHENTICATOR_USER_SUFFIX ?? ''
  },
  get API_URL() {
    return import.meta.env.VITE_PUBLIC_API_URL ?? ''
  },
}

export default ENV
