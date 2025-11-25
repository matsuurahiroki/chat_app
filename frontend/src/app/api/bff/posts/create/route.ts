import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.userId) return new Response("Unauthorized", { status: 401 });

  const raw = await req.text();
  const ts = Math.floor(Date.now() / 1000).toString();
  const sig = crypto
    .createHmac("sha256", process.env.BFF_SHARED_TOKEN!)
    .update(`${ts}.${raw}`)
    .digest("hex");

  const r = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": session.userId,
      "X-Timestamp": ts,
      "X-Signature": sig,
    },
    body: raw,
  });

  return new Response(await r.text(), { status: r.status });
}
