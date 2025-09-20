import { ShieldCheck, Lock, Key } from 'lucide-react'
import { EcosafeLogo } from './EcosafeLogo'
import i18n from 'i18next'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Splash() {
  const nav = useNavigate()
  const { t } = useTranslation('splash')
  useEffect(() => {
    // Ensure i18n uses stored language
    const storedLang = localStorage.getItem('lang')
    if (storedLang) i18n.changeLanguage(storedLang)
    const t = setTimeout(() => {
      const phone = localStorage.getItem('phone')
      const lang = localStorage.getItem('lang')
      // If phone exists -> home, else if language chosen -> login, else -> language select
      nav(phone ? '/home' : (lang ? '/login' : '/language'), { replace: true })
    }, 1800)
    return () => clearTimeout(t)
  }, [nav])

  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center">
      <div className="scale-150 mb-4">
        <EcosafeLogo />
      </div>
      <p className="text-gray-700 mb-6 text-sm">{t('trusted')}</p>

      <div className="flex gap-6 mb-10">
        <div className="flex flex-col items-center text-xs text-gray-600">
          <ShieldCheck size={20} /> {t('secured')}
        </div>
        <div className="flex flex-col items-center text-xs text-gray-600">
          <Lock size={20} /> {t('safeTrusted')}
        </div>
        <div className="flex flex-col items-center text-xs text-gray-600">
          <Key size={20} /> {t('private')}
        </div>
      </div>

      <div className="text-xs text-gray-400">{t('madeInIndia')}</div>
    </div>
  )
}
