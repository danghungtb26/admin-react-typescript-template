import { RouterProvider, createRouter } from '@tanstack/react-router'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { initReactI18next } from 'react-i18next'
import { setupI18n } from 'vite-plugin-i18n-detector/client'

import vi from './locales/messages/vi.json'
import { routeTree } from './routeTree.gen'

const root = ReactDOM.createRoot(document.getElementById('root')!)

// Create TanStack Router instance
const router = createRouter({ routeTree })

// const { locale, messages } = await getInitialLocale()
const lookupTarget = 'lang'
const fallbackLng = 'vi'

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

const { loadResourceByLang } = setupI18n({
  language: i18next.language,
  onInited() {
    root.render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>,
    )
  },
  onResourceLoaded: (langs, currentLang) => {
    // Once the resource is loaded, add it to i18next
    Object.keys(langs).forEach(ns => {
      i18next.addResourceBundle(currentLang, ns, langs[ns])
    })
  },
  fallbackLng,
  cache: {
    // querystring: lookupTarget,
    htmlTag: true,
  },
})

const _changeLanguage = i18next.changeLanguage
i18next.changeLanguage = async (lang: string, ...args) => {
  // Load resources before language change
  await loadResourceByLang(lang)
  return _changeLanguage(lang, ...args)
}
