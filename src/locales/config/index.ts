import { LOCALE_KEY } from '@constants/key'
import Cookies from 'js-cookie'

export const support_locales = ['vi', 'en']

export const default_locale = 'vi'

export const isSupportLocale = (locale: string) => {
  return support_locales.includes(locale)
}
export const getInitialLocale = async () => {
  let locale = Cookies.get(LOCALE_KEY)
  if (!isSupportLocale(locale ?? '')) {
    locale = default_locale
  }

  let messages = {}
  try {
    messages = (await import(`../messages/${locale}.json`)).default
  } catch {
    messages = {}
  }

  return {
    locale: locale!,
    messages,
  }
}
