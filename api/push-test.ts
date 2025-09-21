import type { VercelRequest, VercelResponse } from '@vercel/node'
import webpush from 'web-push'
import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : undefined

const keyFor = (endpoint: string) => `push:sub:${Buffer.from(endpoint).toString('base64url')}`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  const { VAPID_PUBLIC_KEY = '', VAPID_PRIVATE_KEY = '', VAPID_SUBJECT = 'mailto:admin@example.com' } = process.env
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return res.status(400).json({ error: 'Server VAPID keys missing' })
  }
  try {
    const { subscription, notification, broadcast, endpoint } = req.body || {}
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

    const payload = notification || {
      title: 'EcoSafe',
      body: 'Hello from server push',
      data: { url: '/home' },
    }
    // If broadcast flag and Redis configured, send to all stored
    if (broadcast && redis) {
      const endpoints = (await redis.smembers<string>('push:endpoints')) || []
      const results: any[] = []
      for (const ep of endpoints) {
        const subJson = await redis.get<string>(keyFor(ep))
        if (!subJson) continue
        const sub = JSON.parse(subJson)
        try {
          await webpush.sendNotification(sub, JSON.stringify(payload))
          results.push({ endpoint: ep, ok: true })
        } catch (e) {
          results.push({ endpoint: ep, ok: false, error: String(e) })
        }
      }
      return res.status(200).json({ ok: true, broadcast: results.length, results })
    }
    // Else, send to provided subscription or by endpoint lookup
    let target = subscription
    if (!target && endpoint && redis) {
      const subJson = await redis.get<string>(keyFor(endpoint))
      if (subJson) target = JSON.parse(subJson)
    }
    if (!target || !target.endpoint) {
      return res.status(400).json({ error: 'Missing subscription' })
    }
    await webpush.sendNotification(target, JSON.stringify(payload))
    return res.status(200).json({ ok: true, broadcast: 0 })
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}
