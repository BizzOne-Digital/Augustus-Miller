import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials } from '@/lib/db/db';
import { setAdminAuthCookie, encodeSession } from '@/lib/auth/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await verifyAdminCredentials(email, password);

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please verify your email and password.' },
        { status: 401 }
      );
    }

    const sessionData = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      timestamp: Date.now()
    };

    const res = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });

    setAdminAuthCookie(res, sessionData);
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login' },
      { status: 500 }
    );
  }
}
