// src/app/api/bff/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const api = process.env.BACKEND_API_URL;
  if (!api)
    return NextResponse.json({ error: "API base URL undefined" }, { status: 500 });

  const raw = await req.json();
  const flat = {
    email: raw.email,
    password: raw.password,
  };

  const r = await fetch(`${api}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flat),
  });

  const data = await r.json().catch(() => null);

  // そのまま TEXTではなくJSON を返す
  return NextResponse.json(data, { status: r.status });
}
