import React from 'react';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, generatePageMetadata } from '@/lib/seo';

/**
 * `app/contact/page.tsx` is a client component, so it cannot export
 * generateMetadata. The route-segment layout carries the metadata instead.
 */
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('contact', DEFAULT_LOCALE, '/contact');
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
