import type { MetadataRoute } from 'next';
import { getBlogPosts, getServices } from '@/lib/db/db';
import { absoluteUrl } from '@/lib/seo';

/** Static public routes. Admin, API, cart, checkout, and account are excluded. */
const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/services', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/products', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/pricing', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/booking', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/testimonials', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/team', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 }
];

function toDate(value?: string): Date {
  if (!value) return new Date();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));

  // Dynamic routes pulled from the datastore. Each source is guarded separately
  // so one unreachable collection cannot blank out the whole sitemap.
  try {
    const services = await getServices();
    for (const service of services) {
      if (service.active === false) continue;
      entries.push({
        url: absoluteUrl(`/services/${service.slug}`),
        lastModified: toDate(service.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.8
      });
    }
  } catch {
    // Services unavailable - skip that group.
  }

  // NOTE: there is no /products/[slug] route in this app - products are presented
  // entirely on the /products listing page. If per-product detail pages are added
  // later, enumerate them here with getProducts().

  try {
    const posts = await getBlogPosts();
    for (const post of posts) {
      if (post.status !== 'Published') continue;
      entries.push({
        url: absoluteUrl(`/blog/${post.slug}`),
        lastModified: toDate(post.updatedAt || post.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.6
      });
    }
  } catch {
    // Blog unavailable - skip that group.
  }

  return entries;
}
