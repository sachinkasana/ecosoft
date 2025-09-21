import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import webpush from 'web-push'

const PORT = process.env.PORT || 4000
const app = express()
app.use(express.json())

const DATA_FILE = path.resolve('./subscriptions.json')
const readSubs = () => {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')) } catch { return [] }
}
const writeSubs = (subs) => fs.writeFileSync(DATA_FILE, JSON.stringify(subs, null, 2))

// Configure VAPID (set these before sending)
const {
  VAPID_PUBLIC_KEY = '',
  VAPID_PRIVATE_KEY = '',
  VAPID_SUBJECT = 'mailto:admin@example.com'
} = process.env

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

app.post('/api/subscribe', (req, res) => {
  const sub = req.body
  if (!sub || !sub.endpoint) return res.status(400).json({ error: 'Invalid subscription' })
  const subs = readSubs()
  if (!subs.find((s) => s.endpoint === sub.endpoint)) {
    subs.push(sub)
    writeSubs(subs)
  }
  res.status(201).json({ ok: true })
})

app.post('/api/push-test', async (req, res) => {
  const payload = req.body && Object.keys(req.body).length ? req.body : {
    title: 'EcoSafe',
    body: 'Hello from server push',
    data: { url: '/home' }
  }
  const subs = readSubs()
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return res.status(400).json({ error: 'VAPID keys not configured on server' })
  }
  const results = []
  for (const s of subs) {
    try {
      await webpush.sendNotification(s, JSON.stringify(payload))
      results.push({ endpoint: s.endpoint, ok: true })
    } catch (e) {
      results.push({ endpoint: s.endpoint, ok: false, error: String(e) })
    }
  }
  res.json({ sent: results.length, results })
})

app.listen(PORT, () => {
  console.log(`Push server listening on http://localhost:${PORT}`)
})

