import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const api = process.env.BACKEND_API_URL; // ← Nginxの公開URL
  if (!api) return NextResponse.json({ error: "API base URL undefined" }, { status: 500 });

  try {
    const body = await req.text();
    const r = await fetch(`${api}/api/auth/upsert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const text = await r.text();
    return new NextResponse(text || null, { status: r.status });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 });
  }
}
