import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Coords = { lat: number; lng: number }

export default function AddCustomer() {
  const nav = useNavigate()
  const { state } = useLocation() as { state?: { coords?: Coords } }
  const draftKey = 'draft:addCustomer'
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone1, setPhone1] = useState('')
  const [phone2, setPhone2] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [email, setEmail] = useState('')
  const [house, setHouse] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pin, setPin] = useState('')
  const [stateName, setStateName] = useState('')
  const [coords, setCoords] = useState<Coords | undefined>()
  const [errors, setErrors] = useState<Record<string,string>>({})
  const { t } = useTranslation('customer')
  const [kind, setKind] = useState<'customer'|'supplier'>('customer')
  const [credit, setCredit] = useState('')
  const [debit, setDebit] = useState('')

  // Hydrate from draft on first mount
  useEffect(() => {
    try {
      const draft = JSON.parse(sessionStorage.getItem(draftKey) || 'null')
      if (draft) {
        setFirstName(draft.firstName || '')
        setLastName(draft.lastName || '')
        setPhone1(draft.phone1 || '')
        setPhone2(draft.phone2 || '')
        setWhatsapp(draft.whatsapp || '')
        setEmail(draft.email || '')
        setHouse(draft.house || '')
        setAddress(draft.address || '')
        setCity(draft.city || '')
        setPin(draft.pin || '')
        setStateName(draft.stateName || '')
        setKind(draft.kind || 'customer')
        setCredit(draft.credit || '')
        setDebit(draft.debit || '')
        if (draft.coords) setCoords(draft.coords)
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply coords coming back from map
  useEffect(() => { if (state?.coords) setCoords(state.coords) }, [state])

  // Persist draft whenever fields change
  useEffect(() => {
    const draft = { firstName, lastName, phone1, phone2, whatsapp, email, house, address, city, pin, stateName, kind, credit, debit, coords }
    try { sessionStorage.setItem(draftKey, JSON.stringify(draft)) } catch {}
  }, [firstName, lastName, phone1, phone2, whatsapp, email, house, address, city, pin, stateName, kind, credit, debit, coords])

  const pickOnMap = () => {
    // Ensure current draft is saved before navigation
    try {
      const draft = { firstName, lastName, phone1, phone2, whatsapp, email, house, address, city, pin, stateName, kind, credit, debit, coords }
      sessionStorage.setItem(draftKey, JSON.stringify(draft))
    } catch {}
    nav('/map-picker', { state: { current: coords } })
  }

  const validate = useMemo(() => ({
    firstName: () => firstName.trim() ? '' : t('err.required'),
    phone1: () => {
      if (!phone1) return ''
      const d = phone1.replace(/\D/g,'')
      if (d.length !== 10) return t('err.phoneLen')
      if (!/^[6-9]/.test(d)) return t('err.phoneStart')
      return ''
    },
    pin: () => (pin && !/^\d{6}$/.test(pin)) ? t('err.pin') : '' ,
    email: () => (email && !/^\S+@\S+\.\S+$/.test(email)) ? t('err.email') : ''
  }), [email, firstName, phone1, pin, t])

  const runValidation = () => {
    const e: Record<string,string> = {}
    const checks = ['firstName','phone1','pin','email'] as const
    checks.forEach((k)=>{ const msg = (validate as any)[k](); if (msg) e[k]=msg })
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const save = () => {
    if (!runValidation()) return
    const id = crypto.randomUUID?.() || String(Date.now())
    const customers = JSON.parse(localStorage.getItem('customers') || '[]')
    customers.push({ id, firstName, lastName, phone: phone1 || whatsapp, lat: coords?.lat, lng: coords?.lng, kind, credit: Number(credit)||0, debit: Number(debit)||0, createdAt: Date.now() })
    localStorage.setItem('customers', JSON.stringify(customers))
    try { sessionStorage.removeItem(draftKey) } catch {}
    nav('/home', { replace: true })
  }

  return (
    <div className="min-h-screen bg-white w-full sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-200">
      <header className="h-12 flex items-center gap-2 px-4 border-b">
        <button onClick={() => nav(-1)} className="text-sm underline">{t('back')}</button>
        <div className="font-medium">{t('title')}</div>
      </header>

      <main className="p-4 space-y-3">
        <Input label={t('firstName')} value={firstName} onChange={setFirstName} error={errors.firstName} />
        <Input label={t('surname')} value={lastName} onChange={setLastName} />
        <Input label={t('phone1')} value={phone1} onChange={setPhone1} type="tel" error={errors.phone1} />
        <Input label={t('phone2')} value={phone2} onChange={setPhone2} type="tel" />
        <Input label={t('whatsapp')} value={whatsapp} onChange={setWhatsapp} type="tel" />
        <Input label={t('email')} value={email} onChange={setEmail} type="email" error={errors.email} />

        {/* Type & opening balances */}
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="text-xs text-gray-600 mb-1">{t('type')}</div>
            <select value={kind} onChange={(e)=>setKind(e.target.value as any)} className="w-full h-11 rounded-xl border-2 border-green-300 px-3">
              <option value="customer">{t('typeCustomer')}</option>
              <option value="supplier">{t('typeSupplier')}</option>
            </select>
          </label>
          <div></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label={t('openingCredit')} value={credit} onChange={setCredit} type="number" />
          <Input label={t('openingDebit')} value={debit} onChange={setDebit} type="number" />
        </div>
        <Input label={t('house')} value={house} onChange={setHouse} />
        <Input label={t('address')} value={address} onChange={setAddress} />
        <div className="grid grid-cols-2 gap-3">
          <Input label={t('city')} value={city} onChange={setCity} />
          <Input label={t('pin')} value={pin} onChange={setPin} error={errors.pin} />
        </div>
        <Input label={t('state')} value={stateName} onChange={setStateName} />

        <div className="p-3 rounded-xl border">
          <div className="font-medium mb-2">{t('gps')}</div>
          <div className="text-sm text-gray-600">{t('lat')}: {coords?.lat?.toFixed(6) || '-'} | {t('lng')}: {coords?.lng?.toFixed(6) || '-'}</div>
          <div className="mt-3 flex gap-3">
            <button onClick={pickOnMap} className="px-3 py-2 rounded-lg bg-green-600 text-white text-sm">{t('pickOnMap')}</button>
            <button onClick={() => setCoords(undefined)} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm">{t('clear')}</button>
          </div>
        </div>

        <button onClick={save} className="w-full h-12 rounded-2xl bg-green-700 text-white font-medium mt-4">{t('save')}</button>
      </main>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text', error }:{ label: string, value: string, onChange: (v:string)=>void, type?: string, error?: string }){
  return (
    <label className="block">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} className={`w-full h-11 rounded-xl border-2 px-3 outline-none focus:border-green-600 ${error ? 'border-red-500' : 'border-green-300'}`} />
      {error && <div className="text-xs text-red-600 mt-1">{error}</div>}
    </label>
  )
}
