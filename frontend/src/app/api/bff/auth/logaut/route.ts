// src/app/api/bff/auth/logout/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth/auth"; // あなたの置き場所に合わせる

export async function DELETE() {
  const session = await getServerSession(authOptions);
  const userId = session?.userId;
  const api = process.env.BACKEND_API_URL;

  if (!api)
    return NextResponse.json(
      { error: "API base URL undefined" },
      { status: 500 }
    );

  if (!userId) {
    return new NextResponse(null, { status: 204 });
  }

  await fetch(`${api}/api/auth/logout`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-BFF-Token": process.env.BFF_SHARED_TOKEN!,
    },
    body: JSON.stringify({ user_id: userId }),
  });

  // そのまま TEXTではなくJSON を返す
  return new NextResponse(null, { status: 204 });
}
