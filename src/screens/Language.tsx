import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import i18n from 'i18next'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', color: 'bg-rose-100' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', color: 'bg-sky-100' }
]

export default function Language() {
  const [selected, setSelected] = useState(localStorage.getItem('lang') || '')
  const nav = useNavigate()
  const { t } = useTranslation('language')

  const choose = (code: string) => {
    setSelected(code)
    localStorage.setItem('lang', code)
    i18n.changeLanguage(code)
    // After a short feedback delay, go to login
    setTimeout(() => nav('/login', { replace: true }), 350)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <h1 className="text-xl font-semibold text-center mt-10 mb-6">{t('selectTitle')}</h1>
      <div className="grid grid-cols-2 gap-4 px-5">
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            onClick={() => choose(l.code)}
            className={`p-5 rounded-2xl ${l.color} relative transition`}
          >
            <div className="text-lg font-medium">{l.native}</div>
            <div className="text-xs opacity-70">{l.name}</div>
            {selected === l.code && (
              <div className="absolute top-2 right-2 text-green-600 text-sm">✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
