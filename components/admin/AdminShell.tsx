'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminLayout from './AdminLayout';

/**
 * Applies the admin chrome from the route layout rather than from each page.
 *
 * Mounting AdminLayout here means it survives navigation between admin pages,
 * so the session check and sidebar render once instead of re-running (and
 * flashing the full-screen loader) on every link click.
 *
 * The login route is deliberately excluded - it must render without the
 * sidebar or the session guard that would redirect away from it.
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
