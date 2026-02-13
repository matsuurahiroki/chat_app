/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/bff/auth/signup/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const api = process.env.BACKEND_API_URL;
    if (!api) return NextResponse.json({ error: 'BACKEND_API_URL undefined' }, { status: 500 });

    const bodyText = await req.text();
    let raw;
    try {
      raw = bodyText ? JSON.parse(bodyText) : {};
    } catch (e) {
      console.error('[BFF signup] bad json body:', bodyText.slice(0, 200));
      return NextResponse.json({ error: 'Request body must be JSON' }, { status: 400 });
    }

    const payload = { name: raw?.name, email: raw?.email, password: raw?.password };

    const r = await fetch(`${api}/api/auth/signup`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'manual',
    });

    const ct = r.headers.get('content-type') || '';
    const loc = r.headers.get('location') || '';
    const text = await r.text();

    console.error('[BFF signup] upstream status:', r.status, 'ct:', ct, 'loc:', loc);
    console.error('[BFF signup] upstream body(head):', text.slice(0, 300));

    if (ct.includes('application/json')) {
      return new NextResponse(text, {
        status: r.status,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });
    }

    return NextResponse.json(
      { error: text || 'Upstream returned non-JSON', upstreamStatus: r.status, upstreamContentType: ct, location: loc },
      { status: r.status },
    );
  } catch (e) {
    console.error('[BFF signup] exception:', e);
    return NextResponse.json({ error: 'BFF internal error' }, { status: 500 });
  }
}
