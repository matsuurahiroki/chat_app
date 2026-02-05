// src/app/api/bff/auth/signup/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const api = process.env.BACKEND_API_URL;
  if (!api)
    return NextResponse.json(
      { error: "API base URL undefined" },
      { status: 500 },
    );

  const raw = await req.json();

  const flat = {
    name: raw.name,
    email: raw.email,
    password: raw.password,
  };

  const r = await fetch(`${api}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flat),
  });

  const res = new NextResponse(await r.text(), { status: r.status });
  const setCookie = r.headers?.getSetCookie?.() ?? [];
  for (const c of setCookie) res.headers.append("Set-Cookie", c);
  return res;
}
