import { NextRequest, NextResponse } from 'next/server';
import { getServices, createService } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';

export async function GET() {
  const services = await getServices();
  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, shortDescription, description, slug } = body;

    if (!name || !shortDescription || !description) {
      return NextResponse.json(
        { error: 'Name, shortDescription, and description are required' },
        { status: 400 }
      );
    }

    const calculatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newService = await createService({
      name,
      slug: calculatedSlug,
      shortDescription,
      description,
      divisionSlogan: body.divisionSlogan || '',
      heroImage: body.heroImage || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop',
      iconName: body.iconName || 'Wrench',
      accentColor: body.accentColor || '#C8973E',
      includedServices: body.includedServices || [],
      benefits: body.benefits || [],
      process: body.process || [],
      faq: body.faq || [],
      featured: body.featured ?? true,
      active: body.active ?? true,
      displayOrder: body.displayOrder || 10,
      seoTitle: body.seoTitle || `${name} | Miller Group of Company LLC`,
      seoDescription: body.seoDescription || shortDescription
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
