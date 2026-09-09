import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts, createBlogPost } from '@/lib/db/db';
import { checkAdminAuthRequest } from '@/lib/auth/auth';

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = checkAdminAuthRequest(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newPost = await createBlogPost({
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: body.excerpt || '',
      content: body.content || '',
      coverImage: body.coverImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
      author: body.author || 'Augustus Miller',
      category: body.category || 'Insights',
      tags: body.tags || [],
      status: body.status || 'Published',
      publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
      readTime: body.readTime || '4 min read',
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || body.excerpt || ''
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Create blog post error:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
