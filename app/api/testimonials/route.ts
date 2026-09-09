import { NextRequest, NextResponse } from 'next/server';
import { getTestimonials, createTestimonial } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';

export async function GET() {
  const testimonials = await getTestimonials();
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const newTestimonial = await createTestimonial({
      customerName: body.customerName,
      customerRole: body.customerRole || 'Client',
      company: body.company || '',
      content: body.content,
      rating: Number(body.rating) || 5,
      serviceCategory: body.serviceCategory || 'General',
      active: body.active ?? true,
      avatarUrl: body.avatarUrl || ''
    });
    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error('Create testimonial error:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
