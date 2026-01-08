import { NextResponse } from "next/server";

const api = process.env.BACKEND_API_URL!;
const BFF_SHARED_TOKEN = process.env.BFF_SHARED_TOKEN!;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 400 });
  }

  const railsRes = await fetch(
    `${api}/api/confirm?token=${encodeURIComponent(token)}`,
    {
      headers: { "X-BFF-Token": BFF_SHARED_TOKEN },
      cache: "no-store",
    }
  );

  const json = await railsRes.json().catch(() => null);
  return NextResponse.json(json ?? { error: "rails_error" }, { status: railsRes.status });
}
