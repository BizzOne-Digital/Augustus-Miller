import React from 'react';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, generatePageMetadata } from '@/lib/seo';

/**
 * `app/booking/page.tsx` is a client component, so it cannot export
 * generateMetadata. The route-segment layout carries the metadata instead.
 */
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('booking', DEFAULT_LOCALE, '/booking');
}

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
