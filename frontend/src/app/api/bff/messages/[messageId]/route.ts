// src/app/api/bff/messages/[messageId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth/auth";

const api = process.env.BACKEND_API_URL!;
const BFF_SHARED_TOKEN = process.env.BFF_SHARED_TOKEN!;

export async function PATCH(
  req: Request,
  context: { params: { messageId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const userId = session.userId;
  if (!userId)
    return NextResponse.json({ error: "no_user_id" }, { status: 400 });

  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  const body = await req.json().catch(() => null);
  if (!body?.body)
    return NextResponse.json({ error: "missing_body" }, { status: 400 });

  const { messageId } = await context.params;

  const railsRes = await fetch(
    `${api}/api/rooms/${roomId}/messages/${messageId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-BFF-Token": BFF_SHARED_TOKEN,
        "X-User-Id": String(userId),
      },
      body: JSON.stringify({
        body: body.body,
        user_id: userId, // ← セキュリティ観点でクライアントからではなくセッションから取得
      }),
    }
  );

  const json = await railsRes.json().catch(() => null);
  return NextResponse.json(json ?? { error: "rails_error" }, {
    status: railsRes.status,
  });
}

export async function DELETE(
  req: Request,
  context: { params: { roomId: string; messageId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const userId = session.userId;
  if (!userId)
    return NextResponse.json({ error: "no_user_id" }, { status: 400 });

  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  const { messageId } = await context.params;

  const railsRes = await fetch(
    `${api}/api/rooms/${roomId}/messages/${messageId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-BFF-Token": BFF_SHARED_TOKEN,
        "X-User-Id": String(userId),
      },
      cache: "no-store",
    }
  );

  const json = await railsRes.json().catch(() => null);

  if (!railsRes.ok) {
    return NextResponse.json(json ?? { error: "rails_error" }, {
      status: railsRes.status,
    });
  }

  // ここでいるparamsはアクセスしたroom、そのidを取得している
  // Railsのrequest.headers['X-User-Id']はTSのX-User-Idのこと

  return NextResponse.json(json ?? { ok: true }, { status: 200 });
}
