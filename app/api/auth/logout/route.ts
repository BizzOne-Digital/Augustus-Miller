import { NextResponse } from 'next/server';
import { clearAdminAuthCookie } from '@/lib/auth/auth';

export async function POST() {
  const res = NextResponse.json({ success: true, message: 'Logged out successfully' });
  clearAdminAuthCookie(res);
  return res;
}
