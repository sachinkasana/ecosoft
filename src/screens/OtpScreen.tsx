import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type LocationState = { phone?: string; country?: 'IN' | 'US' }

export default function OtpScreen() {
  const { state } = useLocation()
  const nav = useNavigate()
  const { t } = useTranslation('otp')
  const { phone, country } = (state || {}) as LocationState

  const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
  const [timeLeft, setTimeLeft] = useState(30)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const code = useMemo(() => digits.join(''), [digits])

  useEffect(() => {
    const id = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (code.length === 6) {
      // Simulate verification and continue
      setTimeout(() => nav('/verified', { replace: true, state: { phone, country } }), 400)
    }
  }, [code, country, nav, phone])

  const setAt = (idx: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(0, 1)
    setDigits((d) => {
      const next = [...d]
      next[idx] = v
      return next
    })
    if (v && idx < 5) inputsRef.current[idx + 1]?.focus()
  }

  const onKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        setAt(idx, '')
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus()
        setAt(idx - 1, '')
      }
    }
  }

  const resend = () => {
    setDigits(Array(6).fill(''))
    setTimeLeft(30)
    inputsRef.current[0]?.focus()
  }

  const formattedPhone = useMemo(() => {
    if (!phone) return ''
    // Display as +CC 99999 99999 for IN, or (XXX) XXX-XXXX for US
    const p = phone.replace(/\D/g, '')
    if (country === 'US') return `+1 (${p.slice(0, 3)}) ${p.slice(3, 6)}-${p.slice(6)}`
    return `+91 ${p.slice(0, 5)} ${p.slice(5)}`
  }, [country, phone])

  return (
    <div className="min-h-screen bg-white flex flex-col w-full sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-200">
      <div className="flex items-start justify-between px-6 pt-6">
        <h1 className="text-xl font-semibold text-gray-800">
          {t('enterOtp', { phone: formattedPhone })}
        </h1>
        <div className="w-8 h-8 rounded-full border border-green-600 text-green-700 flex items-center justify-center text-sm">
          {timeLeft}
        </div>
      </div>

      <div className="px-6 mt-2">
        <button className="text-sm text-blue-600 underline" onClick={() => nav('/login', { replace: true })}>
          {t('wrongNumber')}
        </button>
      </div>

      <div className="px-6 mt-6">
        <div className="flex gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              className={`w-12 h-14 rounded-xl border-2 text-center text-xl font-medium ${d ? 'border-green-500' : 'border-gray-300'}`}
              value={d}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
            />
          ))}
        </div>
      </div>

      <div className="px-6 mt-6">
        <button
          onClick={resend}
          disabled={timeLeft > 0}
          className={`text-sm font-medium underline ${timeLeft > 0 ? 'text-gray-400' : 'text-green-700'}`}
        >
          {t('resend')}
        </button>
      </div>
    </div>
  )
}

