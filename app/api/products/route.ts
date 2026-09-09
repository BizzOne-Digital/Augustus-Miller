import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newProd = await createProduct({
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: body.shortDescription || '',
      description: body.description || '',
      price: Number(body.price) || 0,
      salePrice: body.salePrice ? Number(body.salePrice) : undefined,
      sku: body.sku || `SKU-${Date.now()}`,
      images: body.images || [],
      category: body.category || 'General',
      inventory: Number(body.inventory) || 0,
      featured: body.featured ?? false,
      active: body.active ?? true,
      comingSoon: body.comingSoon ?? true,
      seoTitle: body.seoTitle || body.name,
      seoDescription: body.seoDescription || body.shortDescription || ''
    });

    return NextResponse.json(newProd, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
