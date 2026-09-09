import { NextRequest, NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';

export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const updated = await updateSiteSettings(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
