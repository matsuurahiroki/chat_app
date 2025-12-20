// frontend/src/app/api/bff/messages/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth/auth";

const api = process.env.BACKEND_API_URL!;
const BFF_SHARED_TOKEN = process.env.BFF_SHARED_TOKEN!;

// GETメソッドのスコープ
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");
  if (!roomId) {
    return NextResponse.json({ error: "missing_room_id" }, { status: 400 });
  }

  const railsRes = await fetch(`${api}/api/rooms/${roomId}/messages`, {
    headers: {
      "X-BFF-Token": BFF_SHARED_TOKEN,
    },
    cache: "no-store",
  });

  const json = await railsRes.json().catch(() => null);

  if (!railsRes.ok) {
    return NextResponse.json(
      json ?? { error: "rails_error" },
      { status: railsRes.status }
    );
  }

  return NextResponse.json(json, { status: 200 });
}

// POSTメソッドのスコープ

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const userId = session.userId;
  if (!userId)
    return NextResponse.json({ error: "no_user_id" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body?.roomId)
    return NextResponse.json({ error: "missing_room_id" }, { status: 400 });
  if (!body?.body)
    return NextResponse.json({ error: "missing_body" }, { status: 400 });

  const room_id = body.roomId;

  // fetch(url, options) でHTTPリクエストを発行する API
  const railsRes = await fetch(`${api}/api/rooms/${room_id}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-BFF-Token": BFF_SHARED_TOKEN,
    },
    cache: "no-store",
    body: JSON.stringify({
      room_id: body.roomId,
      body: body.body,
      user_id: userId, // クライアントから渡させない
    }),
  });

  const json = await railsRes.json().catch(() => null);
  return NextResponse.json(json ?? { error: "rails_error" }, {
    status: railsRes.status,
  });
}

// getServerSession(authOptions) で NextAuthのJWT Cookieからセッションを復元
// t req.json() でリクエストボディをJSONとしてパース
// NextResponse.json() でJSONレスポンスを返す

// req が持っている代表プロパティ/メソッド
// req.method：HTTPメソッド（"POST" など）
// req.url：URL文字列
// req.headers：ヘッダー
// req.json()：ボディをJSONとして読む（パースしてJSオブジェクトにする）
// req.text()：ボディを文字列で読む
// req.formData()：フォームとして読む

// Requestはreqの型

// NextResponseはpage.tsxに返すレスポンスを作るためのヘルパー 中身の例↓
//  {
//   status: 401,
//   statusText: "Unauthorized",
//   headers: Headers(...),
//   body: ReadableStream(...),
// }
