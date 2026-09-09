'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Calendar,
  MessageSquare,
  Wrench,
  ShoppingBag,
  BookOpen,
  Settings,
  LogOut,
  Shield,
  Home,
  Users,
  Star,
  Upload,
  Menu,
  X,
  HelpCircle
} from 'lucide-react';
import MillerLogo from '@/components/site/MillerLogo';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    // Check session
    fetch('/api/auth/session')
      .then((res) => {
        if (!res.ok) {
          router.replace('/admin/login');
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.authenticated) {
          setUser(data.user);
          setLoading(false);
        } else {
          router.replace('/admin/login');
        }
      })
      .catch(() => {
        router.replace('/admin/login');
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', href: '/admin', icon: Home },
    { name: 'Service Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Inquiries & Messages', href: '/admin/messages', icon: MessageSquare },
    { name: '7 Service Divisions', href: '/admin/services', icon: Wrench },
    { name: 'Products & Gear', href: '/admin/products', icon: ShoppingBag },
    { name: 'Blog & Articles', href: '/admin/blog', icon: BookOpen },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
    { name: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
    { name: 'Team Leadership', href: '/admin/team', icon: Users },
    { name: 'Uploads & Settings', href: '/admin/settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#061426] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#C8973E] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-300">Loading Miller Group Admin Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F4F6F9] text-slate-800">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 bg-[#0A2540] text-white border-r border-[#C8973E]/20 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-slate-700/60 flex items-center gap-3">
          <MillerLogo variant="mark" size="sm" width={40} height={40} />
          <div>
            <span className="font-serif font-bold text-sm tracking-wide block text-white">
              MILLER GROUP
            </span>
            <span className="text-[10px] text-[#DFC37C] tracking-widest uppercase font-semibold">
              Management Portal
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="px-6 py-4 border-b border-slate-700/40 bg-[#071D33] flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">Logged in as:</span>
            <span className="font-bold text-white">{user?.name || 'Administrator'}</span>
            <span className="text-[#DFC37C] block text-[10px]">Role: {user?.role || 'CEO'}</span>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#C8973E] text-[#0A2540] shadow-md shadow-[#C8973E]/20'
                    : 'text-slate-300 hover:bg-[#103459] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Public Link */}
        <div className="p-4 border-t border-slate-700/60">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <span>View Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-[#0A2540] text-white p-4 flex items-center justify-between border-b border-[#C8973E]/20">
          <div className="flex items-center gap-2">
            <MillerLogo variant="mark" size="sm" width={32} height={32} />
            <span className="font-serif font-bold text-sm">Miller Admin</span>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-md hover:bg-slate-800"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden sticky top-[64px] z-30 bg-[#0A2540] text-white p-4 space-y-1 border-b border-slate-700 max-h-[calc(100vh-64px)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-[#C8973E] text-[#0A2540]' : 'text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-xs">
              <Link href="/" target="_blank" className="text-[#DFC37C]">View Site</Link>
              <button onClick={handleLogout} className="text-red-400">Log Out</button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
