import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type Entry = { id: string; type: 'payment' | 'debit'; amount: number; note?: string; at: number }
type Customer = {
  id: string
  firstName: string
  lastName?: string
  phone?: string
  lat?: number
  lng?: number
  kind?: 'customer' | 'supplier'
  credit?: number
  debit?: number
  createdAt?: number
  entries?: Entry[]
}

const storageKey = 'customers'

export default function CustomerDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { t } = useTranslation('detail')
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    const list: Customer[] = JSON.parse(localStorage.getItem(storageKey) || '[]')
    const c = list.find(x => x.id === id!) || null
    setCustomer(c)
  }, [id])

  const totals = useMemo(() => {
    if (!customer) return { credit: 0, debit: 0, due: 0 }
    const credit = (customer.credit || 0) + (customer.entries || []).filter(e=>e.type==='payment').reduce((s,e)=>s+e.amount, 0)
    const debit = (customer.debit || 0) + (customer.entries || []).filter(e=>e.type==='debit').reduce((s,e)=>s+e.amount, 0)
    return { credit, debit, due: debit - credit }
  }, [customer])

  const saveEntry = (type: 'payment'|'debit') => {
    if (!customer) return
    const amt = Number(amount)
    if (!amt || amt <= 0) return
    const entry: Entry = { id: crypto.randomUUID?.() || String(Date.now()), type, amount: amt, note, at: Date.now() }
    const list: Customer[] = JSON.parse(localStorage.getItem(storageKey) || '[]')
    const idx = list.findIndex(x => x.id === customer.id)
    if (idx >= 0) {
      const c = { ...list[idx] }
      c.entries = [...(c.entries || []), entry]
      list[idx] = c
      localStorage.setItem(storageKey, JSON.stringify(list))
      setCustomer(c)
      setAmount(''); setNote('')
    }
  }

  if (!customer) return (
    <div className="min-h-screen bg-white w-full sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-200 p-6">
      <button onClick={()=>nav(-1)} className="text-sm underline">{t('back')}</button>
      <div className="mt-4 text-gray-600">{t('notFound')}</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white w-full sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-200">
      <header className="h-12 flex items-center gap-2 px-4 border-b">
        <button onClick={()=>nav(-1)} className="text-sm underline">{t('back')}</button>
        <div className="font-medium">{customer.firstName} {customer.lastName || ''}</div>
      </header>

      <main className="p-4 space-y-4">
        <div className="rounded-2xl border p-3 flex items-center justify-between">
          <div className="text-xs text-gray-500">{t('balance')}</div>
          <div className={`text-sm font-semibold ${totals.due>=0? 'text-red-700' : 'text-green-700'}`}>₹ {Math.abs(totals.due).toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-600">
            <span className="text-green-700">{t('credit')} ₹ {totals.credit.toLocaleString('en-IN')}</span>
            <span className="ml-3 text-red-700">{t('debit')} ₹ {totals.debit.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="rounded-2xl border p-3">
          <div className="text-sm font-medium mb-2">{t('addEntry')}</div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder={t('amount')!} value={amount} onChange={(e)=>setAmount(e.target.value)} className="h-11 rounded-xl border px-3" />
            <input type="text" placeholder={t('note')!} value={note} onChange={(e)=>setNote(e.target.value)} className="h-11 rounded-xl border px-3" />
          </div>
          <div className="flex gap-3 mt-3">
            <button onClick={()=>saveEntry('payment')} className="px-3 py-2 rounded-xl bg-green-600 text-white text-sm">{t('addPayment')}</button>
            <button onClick={()=>saveEntry('debit')} className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm">{t('addDebit')}</button>
          </div>
        </div>

        <div className="rounded-2xl border p-3">
          <div className="text-sm font-medium mb-2">{t('timeline')}</div>
          <div className="space-y-2">
            {(customer.entries || []).length === 0 && (
              <div className="text-sm text-gray-500">{t('noEntries')}</div>
            )}
            {(customer.entries || []).slice().reverse().map(e => (
              <div key={e.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="text-xs text-gray-600">{new Date(e.at).toLocaleString()}</div>
                <div className={`text-sm font-medium ${e.type==='payment' ? 'text-green-700' : 'text-red-700'}`}>{e.type==='payment'? '+' : '+' /* show amount added to side */}₹ {e.amount.toLocaleString('en-IN')}</div>
                <div className="text-xs text-gray-500 max-w-[40%] truncate">{e.note || ''}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

