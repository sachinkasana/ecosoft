import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function VerificationSuccess() {
  const nav = useNavigate()
  const { state } = useLocation() as any
  const { t } = useTranslation('otp')

  useEffect(() => {
    // Persist the phone only after verification
    const phone = state?.phone
    if (phone) localStorage.setItem('phone', phone)
    const id = setTimeout(() => nav('/permissions', { replace: true }), 1000)
    return () => clearTimeout(id)
  }, [nav, state])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center w-full sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-200">
      <div className="flex flex-col items-center">
        <div className="w-44 h-44 rounded-full border-4 border-green-600 flex items-center justify-center">
          <Check className="w-24 h-24 text-green-600" />
        </div>
        <div className="mt-8 text-xl text-gray-700 font-medium">{t('verificationSuccessful')}</div>
      </div>
    </div>
  )
}
