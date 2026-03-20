import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth/auth';

export async function DELETE(req: Request) {
  const api = process.env.BACKEND_API_URL;

  if (!api) {
    return NextResponse.json(
      { error: 'BACKEND_API_URL undefined' },
      { status: 500 },
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.userId) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const currentPassword = body?.current_password;

  if (!currentPassword) {
    return NextResponse.json(
      { error: 'missing_current_password' },
      { status: 400 },
    );
  }

  const railsResponse = await fetch(`${api.replace(/\/$/, '')}/api/user`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-BFF-Token': process.env.BFF_SHARED_TOKEN ?? '',
      'X-User-Id': String(session.userId),
    },
    body: JSON.stringify({
      current_password: currentPassword,
    }),
  });

  const responseText = await railsResponse.text();

  return new NextResponse(responseText, {
    status: railsResponse.status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}