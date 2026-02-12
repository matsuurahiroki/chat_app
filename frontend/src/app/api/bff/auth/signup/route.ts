// src/app/api/bff/auth/signup/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const api = process.env.BACKEND_API_URL;
    if (!api) {
      return NextResponse.json({ error: 'BACKEND_API_URL is undefined' }, { status: 500 });
    }

    const bodyText = await req.text();

    let raw
    try {
      raw = bodyText ? JSON.parse(bodyText) : {};
    } catch {
      return NextResponse.json({ error: 'Request body must be JSON' }, { status: 400 });
    }

    const payload = {
      name: raw?.name ?? '',
      email: raw?.email ?? '',
      password: raw?.password ?? '',
    };

    const upstream = await fetch(`${api}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const ct = upstream.headers.get('content-type') || '';
    const text = await upstream.text();

    // upstreamがJSONならそのまま返す（content-typeも付ける）
    if (ct.includes('application/json')) {
      const res = new NextResponse(text, {
        status: upstream.status,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      });

      const setCookies = (upstream.headers)?.getSetCookie?.() ?? [];
      for (const c of setCookies) res.headers.append('set-cookie', c);

      return res;
    }

    // JSONじゃない場合は必ずJSONに包む（クライアントが確実に読める）
    return NextResponse.json(
      {
        error: text || `Upstream returned non-JSON (status ${upstream.status})`,
        upstreamContentType: ct,
      },
      { status: upstream.status },
    );
  } catch (e) {
    console.error('[BFF signup] exception:', e);
    return NextResponse.json({ error: 'BFF internal error' }, { status: 500 });
  }
}
