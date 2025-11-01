// app/api/bff/posts/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.userId) return new Response("Unauthorized", { status: 401 }); //セッションのないものは弾かれる
  //↓署名に必要な情報
  const ts = Math.floor(Date.now() / 1000).toString(); // ts = 現在のUNIX時間
  const body = ""; // GETは空
  const sig = crypto
    .createHmac("sha256", process.env.BFF_SHARED_SECRET!) // 密鍵 BFF_SHARED_SECRET を使った HMAC-SHA256署名
    .update(`${ts}.${body}`)
    .digest("hex"); //一般的に使われてる&HTTPヘッダーで使いやすい

  const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
    headers: {
      "X-User-Id": String(session.userId),
      "X-Timestamp": ts,
      "X-Signature": sig,
    }, //習慣としてX-としてハッシュにし、格納
    cache: "no-store",
  });

  return new Response(await r.text(), { status: r.status });
}
