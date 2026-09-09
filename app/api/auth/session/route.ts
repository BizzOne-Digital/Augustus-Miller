import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuthRequest } from '@/lib/auth/auth';

export async function GET(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      role: session.role
    }
  });
}
