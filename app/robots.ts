import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        // /api/uploads/** serves admin-uploaded images, so keep it crawlable.
        allow: ['/', '/api/uploads/'],
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          // Reserved for future commerce routes - harmless while they don't exist.
          '/cart',
          '/checkout',
          '/account'
        ]
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
