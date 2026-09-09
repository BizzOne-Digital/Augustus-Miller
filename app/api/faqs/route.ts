import { NextRequest, NextResponse } from 'next/server';
import { getFAQs, createFAQ } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';

export async function GET() {
  const faqs = await getFAQs();
  return NextResponse.json(faqs);
}

export async function POST(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const newFAQ = await createFAQ({
      question: body.question,
      answer: body.answer,
      category: body.category || 'General',
      displayOrder: Number(body.displayOrder) || 1,
      active: body.active ?? true
    });
    return NextResponse.json(newFAQ, { status: 201 });
  } catch (error) {
    console.error('Create FAQ error:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}
