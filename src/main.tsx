import { RouterProvider, createRouter } from '@tanstack/react-router'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { initReactI18next } from 'react-i18next'
import { I18nAllyClient } from 'vite-plugin-i18n-ally/client'

import vi from './locales/messages/vi.json'
import { routeTree } from './routeTree.gen'

const root = ReactDOM.createRoot(document.getElementById('root')!)

// Create TanStack Router instance
const router = createRouter({ routeTree })

// const { locale, messages } = await getInitialLocale()
const lookupTarget = 'lang'
const fallbackLng = 'vi'

const i18nAlly = new I18nAllyClient({
  onBeforeInit() {
    i18next
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        returnNull: false,
        react: {
          useSuspense: true,
        },
        resources: {
          vi: {
            translation: vi,
          },
        }, // !!! important: No resources are added at initialization, otherwise what's lazy loading :)
        nsSeparator: '.',
        fallbackLng,
        keySeparator: '.',
        interpolation: {
          escapeValue: false,
        },
        lowerCaseLng: true,
        detection: {
          order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator'],
          caches: ['localStorage', 'sessionStorage', 'cookie'],
          lookupQuerystring: lookupTarget,
          lookupLocalStorage: lookupTarget,
          lookupSessionStorage: lookupTarget,
          lookupCookie: lookupTarget,
          // ... For more configurations, please refer to `i18next-browser-languagedetector`
        },
      })
  },
  onInited() {
    root.render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>,
    )
  },
  onResourceLoaded: (resources, { lng }) => {
    // @ts-expect-error options maybe undefined
    i18next.addResourceBundle(lng, i18next.options?.defaultNS?.[0], resources)
  },
  fallbackLng,
  detection: [
    {
      detect: 'querystring',
      lookup: 'lang',
    },
    {
      detect: 'cookie',
      lookup: 'cookie-name',
      cache: true,
    },
    {
      detect: 'htmlTag',
      cache: true,
    },
  ],
})

const i18nextChangeLanguage = i18next.changeLanguage
i18next.changeLanguage = async (lng: string, ...args) => {
  // Load resources before switching languages
  await i18nAlly.asyncLoadResource(lng)
  return i18nextChangeLanguage(lng, ...args)
}
