import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : undefined

const keyFor = (endpoint: string) => `push:sub:${Buffer.from(endpoint).toString('base64url')}`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }
  try {
    if (!redis) return res.json({ endpoints: [], note: 'No Redis configured' })
    const endpoints = (await redis.smembers<string>('push:endpoints')) || []
    const items = [] as any[]
    for (const ep of endpoints) {
      const subJson = await redis.get<string>(keyFor(ep))
      items.push({ endpoint: ep, subscription: subJson ? JSON.parse(subJson) : null })
    }
    return res.json({ endpoints: items })
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) })
  }
}

