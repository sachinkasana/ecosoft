import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type SubItem = { endpoint: string, subscription: any }

export default function AdminPush() {
  const [items, setItems] = useState<SubItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()
  const isAdmin = (import.meta.env.VITE_PUSH_ADMIN === '1') || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('admin') === '1')

  useEffect(() => {
    if (!isAdmin) { nav('/', { replace: true }); return }
    const run = async () => {
      try {
        const res = await fetch('/api/subscriptions')
        const data = await res.json()
        setItems(data.endpoints || [])
      } catch (e: any) {
        setError(String(e?.message || e))
      } finally { setLoading(false) }
    }
    run()
  }, [isAdmin, nav])

  const pushOne = async (endpoint: string) => {
    await fetch('/api/push-test', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ endpoint }) })
  }

  const broadcast = async () => {
    await fetch('/api/push-test', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ broadcast: true }) })
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6 w-full sm:max-w-xl sm:mx-auto sm:border-x sm:border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Push Admin</h1>
        <button onClick={broadcast} className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm">Broadcast</button>
      </div>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="space-y-3 mt-2">
        {items.map((it) => (
          <div key={it.endpoint} className="p-3 rounded-xl border flex items-center justify-between">
            <div className="text-xs break-all pr-3">{it.endpoint}</div>
            <button onClick={() => pushOne(it.endpoint)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs">Push</button>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <div className="text-sm text-gray-500">No subscriptions stored.</div>
        )}
      </div>
    </div>
  )
}

