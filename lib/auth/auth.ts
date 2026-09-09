import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const AUTH_COOKIE_NAME = 'miller_admin_token';
const SECRET_SALT = process.env.AUTH_SECRET || 'miller_group_secure_auth_secret_key_2026';

export interface SessionData {
  id: string;
  email: string;
  name: string;
  role: string;
  timestamp: number;
}

export function encodeSession(data: SessionData): string {
  const json = JSON.stringify(data);
  const base64 = Buffer.from(json).toString('base64url');
  // Simple HMAC-like signature
  const signature = Buffer.from(`${base64}:${SECRET_SALT}`).toString('base64url').substring(0, 32);
  return `${base64}.${signature}`;
}

export function decodeSession(token: string): SessionData | null {
  try {
    const [base64, signature] = token.split('.');
    if (!base64 || !signature) return null;
    const expectedSig = Buffer.from(`${base64}:${SECRET_SALT}`).toString('base64url').substring(0, 32);
    if (signature !== expectedSig) return null;
    const json = Buffer.from(base64, 'base64url').toString('utf8');
    const data = JSON.parse(json) as SessionData;
    // Expire session after 7 days
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - data.timestamp > SEVEN_DAYS) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function getServerAdminSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export function setAdminAuthCookie(res: NextResponse, data: SessionData) {
  const token = encodeSession(data);
  res.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  });
}

export function clearAdminAuthCookie(res: NextResponse) {
  res.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0
  });
}

export function checkAdminAuthRequest(req: NextRequest): SessionData | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return decodeSession(token);
}
