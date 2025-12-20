// src/app/api/bff/messages/[messageId]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth/auth";

const api = process.env.BACKEND_API_URL!;
const BFF_SHARED_TOKEN = process.env.BFF_SHARED_TOKEN!;

export async function PATCH(req: Request, context: { params: { meesageId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const userId = (session).userId;
  if (!userId) return NextResponse.json({ error: "no_user_id" }, { status: 400 });

  const body = await req.json().catch(() => null);
  if (!body?.body) return NextResponse.json({ error: "missing_body" }, { status: 400 });

  const railsRes = await fetch(`${api}/api/messages/${context.params.meesageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-BFF-Token": BFF_SHARED_TOKEN,
    },
    body: JSON.stringify({
      body: body.body,
      user_id: userId, // ← セキュリティ観点でクライアントからではなくセッションから取得
    }),
  });

  const json = await railsRes.json().catch(() => null);
  return NextResponse.json(json ?? { error: "rails_error" }, { status: railsRes.status });
}
