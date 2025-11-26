// src/app/api/bff/profile/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth/auth";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !(session).userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { name, email } = (await req.json()) as {
    name?: string;
    email?: string;
  };

  const api = process.env.BACKEND_API_URL;
  if (!api) {
    return NextResponse.json(
      { error: "API base URL undefined" },
      { status: 500 },
    );
  }

  const userId = (session).userId;

  const r = await fetch(`${api}/api/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-BFF-Token": process.env.BFF_SHARED_TOKEN ?? "",
    },
    body: JSON.stringify({ name, email }),
  });

  const text = await r.text();
  return new NextResponse(text, { status: r.status });
}
