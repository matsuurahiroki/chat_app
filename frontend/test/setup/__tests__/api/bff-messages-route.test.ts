/** @jest-environment node */

import { NextRequest } from 'next/server'

const mockGetServerSession = jest.fn()

jest.mock('next-auth', () => ({
  getServerSession: () => mockGetServerSession(),
}))

describe('POST /api/bff/messages', () => {
  let POST: typeof import('@/app/api/bff/messages/route').POST

  beforeEach(async () => {
    jest.resetModules()

    process.env.BACKEND_API_URL = 'http://rails.test'
    process.env.BFF_SHARED_TOKEN = 'test-token'

    mockGetServerSession.mockReset()
    globalThis.fetch = jest.fn() as unknown as typeof fetch

    ;({ POST } = await import('@/app/api/bff/messages/route'))
  })

  it('returns 400 when roomId missing', async () => {
    mockGetServerSession.mockResolvedValue({ userId: 1 })

    const req = new NextRequest('http://localhost/api/bff/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'hi' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: 'missing_room_id' })
  })

  it('returns 401 when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null)

    const req = new NextRequest('http://localhost/api/bff/messages?roomId=10', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'hi' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual({ error: 'unauthorized' })
  })

  it('proxies to rails when ok', async () => {
    mockGetServerSession.mockResolvedValue({ userId: 10 })

    ;(globalThis.fetch as unknown as jest.Mock).mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 999 }),
      text: async () => JSON.stringify({ id: 999 }),
    })

    const req = new NextRequest('http://localhost/api/bff/messages?roomId=7', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: 'hello' }),
    })

    const res = await POST(req)
    expect(res.status).toBe(201)
    await expect(res.json()).resolves.toEqual({ id: 999 })
  })
})
