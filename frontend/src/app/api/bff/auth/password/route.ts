// src/app/api/bff/user/password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/nextauth/auth';

const api = process.env.BACKEND_API_URL!;
const BFF_SHARED_TOKEN = process.env.BFF_SHARED_TOKEN!;

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const userId = session.userId;

    if (!userId) {
      return NextResponse.json({ error: 'no_user_id' }, { status: 400 });
    }

    const body = await request.json().catch(() => null);

    const currentPassword = body?.current_password;
    const password = body?.password;
    const passwordConfirmation = body?.password_confirmation;

    if (!currentPassword) {
      return NextResponse.json(
        { error: 'missing_current_password' },
        { status: 400 },
      );
    }

    if (!password) {
      return NextResponse.json(
        { error: 'missing_password' },
        { status: 400 },
      );
    }

    if (!passwordConfirmation) {
      return NextResponse.json(
        { error: 'missing_password_confirmation' },
        { status: 400 },
      );
    }

    const railsResponse = await fetch(`${api}/api/user/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-BFF-Token': BFF_SHARED_TOKEN,
      },
      cache: 'no-store',
      body: JSON.stringify({
        user_id: userId,
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      }),
    });

    const responseData = await railsResponse.json().catch(() => null);

    if (!railsResponse.ok) {
      return NextResponse.json(
        responseData ?? { error: 'password_update_failed' },
        { status: railsResponse.status },
      );
    }

    return NextResponse.json(
      responseData ?? { message: 'password_updated' },
      { status: 200 },
    );
  } catch (error) {
    console.error('[BFF password update] exception:', error);
    return NextResponse.json(
      { error: 'BFF internal error' },
      { status: 500 },
    );
  }
}