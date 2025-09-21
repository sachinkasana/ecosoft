import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

const initialLng = (typeof window !== 'undefined' && localStorage.getItem('lang')) || 'en'

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: initialLng,
    fallbackLng: 'en',
    ns: ['splash', 'language', 'login', 'otp', 'permissions', 'home', 'customer', 'detail'],
    defaultNS: 'splash',
    debug: false,
    interpolation: { escapeValue: false },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    load: 'currentOnly',
  })

export default i18n
