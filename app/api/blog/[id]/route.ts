import { NextRequest, NextResponse } from 'next/server';
import { updateBlogPost, deleteBlogPost } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = checkAdminAuthRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  const body = await req.json();
  const updated = await updateBlogPost(id, body);
  if (!updated) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = checkAdminAuthRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  const success = await deleteBlogPost(id);
  if (!success) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
