// src/app/api/bff/messages/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth/auth";

const api = process.env.BACKEND_API_URL!;
const BFF_SHARED_TOKEN = process.env.BFF_SHARED_TOKEN!;

export async function GET(req: NextRequest) {
  const roomId = req.nextUrl.searchParams.get("roomId");
  if (!roomId)
    return NextResponse.json({ error: "missing_room_id" }, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.userId;

  const railsRes = await fetch(`${api}/api/rooms/${roomId}/messages`, {
    method: "GET",
    headers: {
      "X-BFF-Token": BFF_SHARED_TOKEN,
      "X-User-Id": String(userId),
    },
    cache: "no-store",
  });

  const json = await railsRes.json().catch(() => null);
  return NextResponse.json(json ?? { error: "rails_error" }, {
    status: railsRes.status,
  });
}

export async function POST(req: NextRequest) {
  const roomId = req.nextUrl.searchParams.get("roomId");
  if (!roomId)
    return NextResponse.json({ error: "missing_room_id" }, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const userId = session.userId;
  if (!userId)
    return NextResponse.json({ error: "no_user_id" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body?.body)
    return NextResponse.json({ error: "missing_body" }, { status: 400 });

  const railsRes = await fetch(`${api}/api/rooms/${roomId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-BFF-Token": BFF_SHARED_TOKEN,
      "X-User-Id": String(userId),
    },
    body: JSON.stringify({ body: body.body, user_id: userId }),
  });

  const json = await railsRes.json().catch(() => null);
  return NextResponse.json(json ?? { error: "rails_error" }, {
    status: railsRes.status,
  });
}
