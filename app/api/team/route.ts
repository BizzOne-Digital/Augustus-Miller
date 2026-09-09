import { NextRequest, NextResponse } from 'next/server';
import { getTeam, createTeamMember } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';

export async function GET() {
  const team = await getTeam();
  return NextResponse.json(team);
}

export async function POST(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const newMember = await createTeamMember({
      name: body.name,
      position: body.position,
      bio: body.bio,
      photo: body.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
      email: body.email || '',
      phone: body.phone || '',
      linkedin: body.linkedin || '',
      displayOrder: Number(body.displayOrder) || 1,
      active: body.active ?? true
    });
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Create team member error:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}
