import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: Request) {
  const api = process.env.BACKEND_API_URL;
  if (!api) return NextResponse.json({ error: "BACKEND_API_URL undefined" }, { status: 500 });

  const cookie = req.headers.get("cookie") ?? "";
  const session = await getServerSession(authOptions);

  const r = await fetch(`${api.replace(/\/$/, "")}/api/user`, {
    method: "DELETE",
    headers: {
      "X-BFF-Token": process.env.BFF_SHARED_TOKEN ?? "",
      ...(session?.userId ? { "X-User-Id": String(session.userId) } : {}),
      ...(cookie ? { cookie } : {}),
    },
  });

  return new NextResponse(await r.text(), { status: r.status });
}
