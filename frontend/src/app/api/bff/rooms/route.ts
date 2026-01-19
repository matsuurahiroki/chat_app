// /src/app/api/bff/rooms/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth/auth";

const api = process.env.BACKEND_API_URL!;
const BFF_SHARED_TOKEN = process.env.BFF_SHARED_TOKEN!;

// ルーム一覧取得（ホーム画面用）
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const railsRes = await fetch(`${api}/api/rooms`, {
    headers: {
      "X-BFF-Token": BFF_SHARED_TOKEN,
    },
    cache: "no-store",
  });

  const json = await railsRes.json().catch(() => null);

  if (!railsRes.ok) {
    return NextResponse.json(json ?? { error: "rails_error" }, {
      status: railsRes.status,
    });
  }

  return NextResponse.json(json, { status: 200 });
}

// ルーム作成（投稿モーダルからのPOST）
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // jwt/session に userId を入れている想定
  const userId = session.userId;
  if (!userId) {
    return NextResponse.json({ error: "no_user_id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.title) {
    return NextResponse.json({ error: "missing_title" }, { status: 400 });
  }

  const railsRes = await fetch(`${api}/api/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-BFF-Token": BFF_SHARED_TOKEN,
    },
    body: JSON.stringify({
      title: body.title,
      user_id: userId,
    }),
  });

  const json = await railsRes.json().catch(() => null);

  if (!railsRes.ok) {
    return NextResponse.json(json ?? { error: "rails_error" }, {
      status: railsRes.status,
    });
  }

  return NextResponse.json(json, { status: 201 });
}
