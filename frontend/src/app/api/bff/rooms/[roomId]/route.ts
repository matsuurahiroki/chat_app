// /src/app/api/bff/rooms/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth/auth";

const api = process.env.BACKEND_API_URL!;
const BFF_SHARED_TOKEN = process.env.BFF_SHARED_TOKEN!;

// ルーム一覧取得（ホーム画面用）
export async function GET(_req: Request, context: { params: { roomId: string } }) {

  const { roomId } = context.params;
  const railsRes = await fetch(`${api}/api/rooms/${roomId}`, {
    headers: {
      "X-BFF-Token": BFF_SHARED_TOKEN,
    },
    cache: "no-store",
  });

  // railsRes.status … HTTPステータスコード（200, 400, 500 など）
  // railsRes.ok … status が 200〜299 なら true
  // railsRes.headers … Content-Type などのレスポンスヘッダ
  // railsRes.body … 生のレスポンスボディ（ストリーム）
  // railsRes.json() … その body を JSON として読む関数
  //上の時点でrailsと通信、その結果をrailsResに格納、下のコードに進む

  const json = await railsRes.json().catch(() => null);

  // tryはそのまま結果を格納、catch 文でjsonのパースに失敗した場合に備える

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
