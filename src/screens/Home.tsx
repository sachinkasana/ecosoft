import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
}

const storageKey = 'customers'

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'emi'|'balance'|'supplier'>(() => (localStorage.getItem('ui.home.tab') as any) || 'emi')
  const [pill, setPill] = useState<'all'|'due'|'overdue'>(() => (localStorage.getItem('ui.home.pill') as any) || 'all')
  const [sortKey, setSortKey] = useState<'due'|'recent'|'name'>(() => (localStorage.getItem('ui.home.sort') as any) || 'due')
  const nav = useNavigate()
  const { t } = useTranslation('home')

  useEffect(() => {
    try { setCustomers(JSON.parse(localStorage.getItem(storageKey) || '[]')) } catch { setCustomers([]) }
  }, [])
  useEffect(() => { localStorage.setItem('ui.home.tab', tab) }, [tab])
  useEffect(() => { localStorage.setItem('ui.home.pill', pill) }, [pill])
  useEffect(() => { localStorage.setItem('ui.home.sort', sortKey) }, [sortKey])

  const withDerived = useMemo(() => {
    const now = Date.now()
    return customers.map(c => {
      const due = (c.debit || 0) - (c.credit || 0)
      const days = c.createdAt ? Math.max(0, Math.floor((now - c.createdAt) / (24*3600*1000))) : 0
      return { ...c, _due: due, _days: days }
    })
  }, [customers])

  const counts = useMemo(() => {
    const all = withDerived.length
    const due = withDerived.filter(c => c._due > 0).length
    const overdue = withDerived.filter(c => c._due > 0 && c._days >= 3).length
    return { all, due, overdue }
  }, [withDerived])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = withDerived
    if (tab === 'supplier') list = list.filter(c => (c.kind || 'customer') === 'supplier')
    // For now EMI and Balance show non-suppliers
    if (tab !== 'supplier') list = list.filter(c => (c.kind || 'customer') !== 'supplier')
    if (pill === 'due') list = list.filter(c => c._due > 0)
    if (pill === 'overdue') list = list.filter(c => c._due > 0 && c._days >= 3)
    // search filter
    if (q) list = list.filter(c =>
      (c.firstName + ' ' + (c.lastName || '')).toLowerCase().includes(q) ||
      (c.phone || '').includes(q)
    )
    // sorting
    const byName = (a: any, b: any) => (a.firstName + ' ' + (a.lastName||'')).localeCompare(b.firstName + ' ' + (b.lastName||''), undefined, { sensitivity: 'base' })
    if (sortKey === 'due') list = [...list].sort((a,b)=> (b._due||0) - (a._due||0))
    else if (sortKey === 'recent') list = [...list].sort((a,b)=> (b.createdAt||0) - (a.createdAt||0))
    else if (sortKey === 'name') list = [...list].sort(byName)
    return list
  }, [withDerived, query, tab, pill, sortKey])

  const totals = useMemo(() => {
    const credit = customers.reduce((s,c)=> s + (c.credit||0), 0)
    const debit = customers.reduce((s,c)=> s + (c.debit||0), 0)
    return { credit, debit, net: credit - debit }
  }, [customers])

  return (
    <div className="min-h-screen bg-white w-full sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-200">
      <header className="h-14 flex items-center justify-between px-4 border-b">
        <div className="font-semibold">EcoSafe</div>
        <Link to="/permissions" className="text-sm underline">{t('permissions')}</Link>
      </header>

      <main className="p-4">
        <div className="mb-3">
          <div className="inline-flex bg-gray-100 rounded-full p-1 shadow-inner">
            <TabButton active={tab==='emi'} onClick={()=>setTab('emi')}>{t('tabEmiDue')}</TabButton>
            <TabButton active={tab==='balance'} onClick={()=>setTab('balance')}>{t('tabBalanceDue')}</TabButton>
            <TabButton active={tab==='supplier'} onClick={()=>setTab('supplier')}>{t('tabSupplier')}</TabButton>
          </div>
        </div>

        {/* Net balance strip */}
        <div className="rounded-2xl border p-3 mb-4 bg-white flex items-center justify-between">
          <div className="text-xs text-gray-500">{t('netBalance')}</div>
          <div className={`text-sm font-semibold ${totals.net>=0? 'text-green-700' : 'text-red-700'}`}>₹ {Math.abs(totals.net).toLocaleString('en-IN')}</div>
          <div className="text-xs text-gray-600">
            <span className="text-green-700">{t('credit')} ₹ {totals.credit.toLocaleString('en-IN')}</span>{' '}
            <span className="ml-3 text-red-700">{t('debit')} ₹ {totals.debit.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex gap-2 mb-3">
            <PillButton active={pill==='all'} onClick={()=>setPill('all')}>{t('pillAll')} ({counts.all})</PillButton>
            <PillButton active={pill==='due'} onClick={()=>setPill('due')}>{t('pillDue')} ({counts.due})</PillButton>
            <PillButton active={pill==='overdue'} onClick={()=>setPill('overdue')}>{t('pillOverdue')} ({counts.overdue})</PillButton>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <select value={sortKey} onChange={(e)=>setSortKey(e.target.value as any)} className="h-10 rounded-xl border px-3 bg-white text-sm">
              <option value="due">{t('sortDue')}</option>
              <option value="recent">{t('sortRecent')}</option>
              <option value="name">{t('sortName')}</option>
            </select>
            <div className="flex-1" />
          </div>
          <input
            type="search"
            placeholder={t('searchPlaceholder')}
            className="w-full h-11 rounded-2xl border px-4 bg-gray-50"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
          />
        </div>
        <div className="space-y-3">
          {filtered.map(c => (
            <SwipeRow key={c.id} actionsWidth={220} rightActions={
              <div className="h-full flex items-center gap-2 pr-2">
                {c.phone && (
                  <a href={`tel:${c.phone}`} className="px-3 py-1.5 rounded-lg bg-white border text-sm">{t('actionCall')}</a>
                )}
                {c.phone && (
                  <a href={`https://wa.me/91${(c.phone||'').replace(/\D/g,'')}`} target="_blank" className="px-3 py-1.5 rounded-lg bg-white border text-sm">{t('actionWhatsapp')}</a>
                )}
                {(c.lat && c.lng) && (
                  <a href={`https://www.google.com/maps?q=${c.lat},${c.lng}`} target="_blank" className="px-3 py-1.5 rounded-lg bg-white border text-sm">{t('actionMap')}</a>
                )}
                <button onClick={()=>nav(`/customers/${c.id}`)} className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm">{t('actionDetails')}</button>
              </div>
            }>
            <div className="p-3 rounded-xl border flex items-center justify-between bg-white">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-medium">
                  {(c.firstName || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{c.firstName} {c.lastName || ''}</div>
                  <div className="text-xs text-gray-500">{c.phone || ''}</div>
                  {c._due > 0 && (
                    <div className={`text-xs ${c._days >= 3 ? 'text-red-700' : (c._days >= 1 ? 'text-amber-700' : 'text-amber-600')}`}>{t('pendingSince', { count: c._days })}</div>
                  )}
                  {(c.lat && c.lng) && (
                    <div className="text-xs text-gray-500">{c.lat.toFixed(5)}, {c.lng.toFixed(5)}</div>
                  )}
                </div>
              </div>
              <div className="text-right">
                {c._due > 0 ? (
                  <>
                    <div className="text-red-700 font-semibold">₹ {c._due.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-red-700 uppercase tracking-wide">{t('labelDue')}</div>
                  </>
                ) : c._due < 0 ? (
                  <>
                    <div className="text-green-700 font-semibold">₹ {(Math.abs(c._due)).toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-green-700 uppercase tracking-wide">{t('labelAdvance')}</div>
                  </>
                ) : (
                  <>
                    <div className="text-green-700 font-semibold">₹ 0</div>
                    <div className="text-[10px] text-green-700 uppercase tracking-wide">{t('labelPaid')}</div>
                  </>
                )}
                <button onClick={()=>nav(`/customers/${c.id}`)} className="text-blue-600 text-xs underline">{t('actionDetails')}</button>
              </div>
            </div>
            </SwipeRow>
          ))}
          {filtered.length === 0 && (
            <div className="text-sm text-gray-500">{t('empty')}</div>
          )}
        </div>
      </main>

      {/* FAB */}
      <button
        aria-label={t('addCustomer')}
        onClick={() => nav('/customers/add')}
        className="fixed bottom-6 right-6 sm:right-[calc(50%-22rem)] w-14 h-14 rounded-full bg-green-600 text-white text-2xl shadow-lg active:scale-95"
      >
        +
      </button>
    </div>
  )}

function TabButton({ active, onClick, children }:{ active:boolean; onClick:()=>void; children:any }){
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-medium transition ${active? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>
      {children}
    </button>
  )
}

function PillButton({ active, onClick, children }:{ active:boolean; onClick:()=>void; children:any }){
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-xs border ${active? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300'}`}>
      {children}
    </button>
  )
}

function SwipeRow({ children, rightActions, actionsWidth = 200 }:{ children: any; rightActions: any; actionsWidth?: number }){
  const [open, setOpen] = useState(false)
  const [startX, setStartX] = useState<number | null>(null)
  const [dx, setDx] = useState(0)
  const onStart = (x:number) => { setStartX(x); setDx(0) }
  const onMove = (x:number) => { if (startX===null) return; setDx(Math.min(0, x - startX)) }
  const onEnd = () => { if (Math.abs(dx) > 40) setOpen(true); else if (Math.abs(dx) < 10) setOpen(false); setStartX(null); setDx(0) }
  return (
    <div className="relative overflow-hidden touch-pan-x select-none">
      <div className="absolute right-0 top-0 bottom-0 bg-gray-100" style={{ width: actionsWidth }}>{rightActions}</div>
      <div
        className="relative"
        style={{ transform: `translateX(${open ? -actionsWidth : 0}px)` }}
        onTouchStart={(e)=>onStart(e.touches[0].clientX)}
        onTouchMove={(e)=>onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={(e)=>onStart(e.clientX)}
        onMouseMove={(e)=>{ if (startX!==null) onMove(e.clientX) }}
        onMouseUp={onEnd}
        onMouseLeave={()=> startX!==null && onEnd()}
      >
        {children}
      </div>
    </div>
  )
}
