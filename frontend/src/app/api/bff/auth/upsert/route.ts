import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const api = process.env.BACKEND_API_URL;
  const shared = process.env.BFF_SHARED_TOKEN;

  if (!api) {
    return NextResponse.json(
      { error: "BACKEND_API_URL undefined" },
      { status: 500 }
    );
  }

  if (!shared) {
    return NextResponse.json(
      { error: "BFF_SHARED_TOKEN undefined" },
      { status: 500 }
    );
  }

  try {
    // NextAuth → BFF へ JSON が送られるので JSON として取得
    const json = await req.json();

    // Rails にそのまま転送
    const r = await fetch(`${api}/api/auth/upsert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-BFF-Token": shared,
      },
      body: JSON.stringify(json),
    });

    const text = await r.text();
    return new NextResponse(text || null, { status: r.status });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    );
  }
}
