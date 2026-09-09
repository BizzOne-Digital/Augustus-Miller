import { NextRequest, NextResponse } from 'next/server';
import { updateBooking, deleteBooking } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = checkAdminAuthRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json();

  const updated = await updateBooking(id, body);
  if (!updated) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = checkAdminAuthRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const success = await deleteBooking(id);
  if (!success) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
