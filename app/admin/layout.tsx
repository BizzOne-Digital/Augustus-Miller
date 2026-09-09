import React from 'react';
import type { Metadata } from 'next';
import { noIndexMetadata } from '@/lib/seo';
import AdminShell from '@/components/admin/AdminShell';

/**
 * Admin is private: never index it, never follow links out of it.
 * Nested pages inherit this unless they override `robots` themselves.
 *
 * The same helper should be applied to /cart, /checkout, and /account/* route
 * layouts if those sections are added later; robots.ts already disallows them.
 */
export const metadata: Metadata = noIndexMetadata('Admin');

export default function AdminSegmentLayout({ children }: { children: React.ReactNode }) {
  // AdminShell mounts the sidebar + session guard once for the whole segment.
  return <AdminShell>{children}</AdminShell>;
}
