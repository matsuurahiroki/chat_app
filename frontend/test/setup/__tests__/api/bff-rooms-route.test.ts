/** @jest-environment node */// test/__tests__/api/bff-rooms-route.test.ts
/** @jest-environment node */

import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/bff/rooms/route'

const mockGetServerSession = jest.fn()

jest.mock('next-auth', () => ({
  getServerSession: () => mockGetServerSession(),
}))

describe('/api/bff/rooms route', () => {
  beforeEach(() => {
    process.env.BACKEND_API_URL = 'http://rails.test'
    process.env.BFF_SHARED_TOKEN = 'test-token'

    mockGetServerSession.mockReset()
    globalThis.fetch = jest.fn() as unknown as typeof fetch
  })

  describe('GET /api/bff/rooms', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const res = await GET()
      expect(res.status).toBe(401)
      await expect(res.json()).resolves.toEqual({ error: 'unauthorized' })
    })

    it('proxies to rails when ok', async () => {
      mockGetServerSession.mockResolvedValue({ userId: 10 })

      ;(globalThis.fetch as unknown as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          rooms: [
            { id: 1, title: 'room1' },
            { id: 2, title: 'room2' },
          ],
        }),
        text: async () =>
          JSON.stringify({
            rooms: [
              { id: 1, title: 'room1' },
              { id: 2, title: 'room2' },
            ],
          }),
      })


      const res = await GET()
      expect(res.status).toBe(200)
      await expect(res.json()).resolves.toEqual({
        rooms: [
          { id: 1, title: 'room1' },
          { id: 2, title: 'room2' },
        ],
      })
    })
  })

  describe('POST /api/bff/rooms', () => {
    it('returns 401 when unauthenticated', async () => {
      mockGetServerSession.mockResolvedValue(null)

      const req = new NextRequest('http://localhost/api/bff/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'new room' }),
      })

      const res = await POST(req)
      expect(res.status).toBe(401)
      await expect(res.json()).resolves.toEqual({ error: 'unauthorized' })
    })

    it('returns 400 when title missing', async () => {
      mockGetServerSession.mockResolvedValue({ userId: 10 })

      const req = new NextRequest('http://localhost/api/bff/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const res = await POST(req)
      expect(res.status).toBe(400)
      await expect(res.json()).resolves.toEqual({ error: 'missing_title' })
    })

    it('proxies to rails when ok', async () => {
      mockGetServerSession.mockResolvedValue({ userId: 10 })

      ;(globalThis.fetch as unknown as jest.Mock).mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ id: 123, title: 'new room' }),
        text: async () => JSON.stringify({ id: 123, title: 'new room' }),
      })

      const req = new NextRequest('http://localhost/api/bff/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'new room' }),
      })

      const res = await POST(req)
      expect(res.status).toBe(201)
      await expect(res.json()).resolves.toEqual({ id: 123, title: 'new room' })
    })
  })
})
