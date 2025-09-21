import type { VercelRequest, VercelResponse } from '@vercel/node'
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
  try {
    const subscription = req.body
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription' })
    }
    if (!redis) return res.status(201).json({ ok: true, note: 'No Redis configured' })
    const endpoint: string = subscription.endpoint
    await redis.sadd('push:endpoints', endpoint)
    await redis.set(keyFor(endpoint), JSON.stringify(subscription))
    return res.status(201).json({ ok: true })
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}
