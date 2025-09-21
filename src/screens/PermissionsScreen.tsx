import { Bell, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function PermissionsScreen() {
  const nav = useNavigate()
  const { t } = useTranslation('permissions')
  const [notifStatus, setNotifStatus] = useState<NotificationPermission | 'unsupported'>(Notification ? Notification.permission : 'unsupported')
  const isAdmin = (import.meta.env.VITE_PUSH_ADMIN === '1') || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('admin') === '1')

  useEffect(() => {
    // Normalize unsupported
    if (typeof Notification === 'undefined') setNotifStatus('unsupported')
  }, [])

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
    return outputArray
  }

  const subscribePush = async () => {
    try {
      const reg = await navigator.serviceWorker.ready
      const vapid = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'REPLACE_WITH_YOUR_PUBLIC_VAPID_KEY'
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapid)
      })
      localStorage.setItem('push-subscription', JSON.stringify(sub))
      // Send to backend (dev server via Vite proxy or Vercel API in prod)
      try {
        await fetch('/api/subscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(sub) })
      } catch { /* ignore offline */ }
      return sub
    } catch (e) {
      // Ignore failures (user can enable later)
    }
  }

  const requestNotifications = async () => {
    try {
      if (typeof Notification === 'undefined') {
        setNotifStatus('unsupported')
        finish()
        return
      }
      const res = await Notification.requestPermission()
      setNotifStatus(res)
      if (res === 'granted') {
        localStorage.setItem('notifications', 'granted')
        await subscribePush()
      }
      finish()
    } catch {
      finish()
    }
  }

  const finish = () => nav('/home', { replace: true })

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 w-full sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-200">
      <div className="w-full">
        {/* Modal-like card */}
        <div className="mx-auto max-w-md rounded-3xl border border-gray-200 shadow-lg p-6">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-6 h-6 text-gray-700" />
          </div>
          <h2 className="text-center text-lg font-semibold text-gray-800 mb-2">
            {t('notifPrompt', { app: 'EcoSafe' })}
          </h2>
          <p className="text-center text-sm text-gray-500 mb-5">{t('notifDesc')}</p>
          <div className="flex flex-col gap-3">
            <button onClick={requestNotifications} className="h-12 rounded-2xl bg-blue-600 text-white font-medium active:scale-95 transition">
              {t('allow')}
            </button>
            <button onClick={finish} className="h-12 rounded-2xl bg-gray-100 text-gray-700 font-medium active:scale-95 transition">
              {t('deny')}
            </button>
          </div>
          {notifStatus === 'denied' && (
            <p className="text-xs text-center text-amber-700 mt-3">{t('notifDeniedHint')}</p>
          )}
          {notifStatus === 'granted' && (
            <div className="flex justify-center mt-3">
              <button
                onClick={async () => {
                  const reg = await navigator.serviceWorker.ready
                  reg.showNotification('EcoSafe', { body: t('testBody') })
                }}
                className="text-xs underline text-gray-600"
              >
                {t('sendTest')}
              </button>
              <span className="mx-2 text-gray-400">•</span>
              <button
                onClick={async () => {
                  try {
                    const sub = JSON.parse(localStorage.getItem('push-subscription') || 'null') || await subscribePush()
                    if (!sub) return
                    await fetch('/api/push-test', {
                      method: 'POST',
                      headers: { 'content-type': 'application/json' },
                      body: JSON.stringify({ subscription: sub })
                    })
                  } catch {}
                }}
                className="text-xs underline text-gray-600"
              >
                {t('sendServerTest')}
              </button>
              {isAdmin && (
                <>
                  <span className="mx-2 text-gray-400">•</span>
                  <button
                    onClick={async () => {
                      try {
                        await fetch('/api/push-test', {
                          method: 'POST',
                          headers: { 'content-type': 'application/json' },
                          body: JSON.stringify({ broadcast: true })
                        })
                      } catch {}
                    }}
                    className="text-xs underline text-red-600"
                  >
                    {t('sendBroadcast')}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Secondary info card for calls/SMS */}
        <div className="mx-auto max-w-md rounded-3xl border border-gray-200 p-5 mt-6">
          <div className="flex items-center gap-3 mb-2">
            <Phone className="w-5 h-5 text-green-700" />
            <div className="font-medium text-gray-800">{t('phoneTitle')}</div>
          </div>
          <p className="text-sm text-gray-500">{t('phoneDesc')}</p>
        </div>
      </div>
    </div>
  )
}
