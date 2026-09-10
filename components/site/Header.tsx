'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Calendar,
  ArrowRight,
  Shield,
  TrendingUp,
  Building,
  HardHat,
  Wrench,
  Hammer,
  Truck,
  Monitor
} from 'lucide-react';
import MillerLogo from './MillerLogo';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  const serviceLinks = [
    { name: 'Financial & Business Consulting', href: '/services/financial-consulting', icon: TrendingUp },
    { name: 'Property Rental & Management', href: '/services/property-management', icon: Building },
    { name: 'General Construction', href: '/services/construction', icon: HardHat },
    { name: 'Repairs & Maintenance', href: '/services/repairs-maintenance', icon: Wrench },
    { name: 'Handyman Services', href: '/services/handyman', icon: Hammer },
    { name: 'Transportation Services', href: '/services/transportation', icon: Truck },
    { name: 'IT Services', href: '/services/it-services', icon: Monitor },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Corporate Contact Bar */}
      <div className="bg-[#0A2540]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#0A2540]/70 text-slate-200 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-[#C8973E]/25">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 tracking-wide">
            <a
              href="tel:+17705722022"
              className="flex items-center gap-2 hover:text-[#DFC37C] transition-colors duration-200"
            >
              <Phone className="w-3.5 h-3.5 text-[#C8973E]" />
              <span className="font-semibold text-white tracking-normal">+1 (770) 572-2022</span>
            </a>
            <a
              href="mailto:sgustus76@gmail.com"
              className="hidden sm:flex items-center gap-2 hover:text-[#DFC37C] transition-colors duration-200 text-slate-300"
            >
              <Mail className="w-3.5 h-3.5 text-[#C8973E]" />
              <span>sgustus76@gmail.com</span>
            </a>
            <div className="hidden md:flex items-center gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#C8973E]" />
              <span>Metro Atlanta & Statewide Georgia</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span className="hidden lg:inline text-[#DFC37C] font-serif italic tracking-wide">
              One Group. Many Solutions. Endless Possibilities.
            </span>
            <Link
              href="/admin/login"
              className="text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors duration-200 pl-3 border-l border-slate-700/80"
            >
              <Shield className="w-3 h-3 text-[#C8973E]" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/72 shadow-[0_8px_30px_-10px_rgba(10,37,64,0.18)] py-3 border-b border-[#C8973E]/25'
            : 'bg-white/80 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/65 py-3.5 border-b border-white/50 shadow-[0_2px_16px_-8px_rgba(10,37,64,0.12)]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8973E] rounded-lg">
            <MillerLogo variant="horizontal" size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0 xl:gap-0.5">
            {[
              { name: 'Home', href: '/' },
              { name: 'About', href: '/about' },
              { name: 'Pricing', href: '/pricing' },
            ].map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative whitespace-nowrap px-2 xl:px-3 py-2 rounded-lg text-[13px] xl:text-[13.5px] font-medium tracking-tight transition-all duration-200 ${
                    isActive
                      ? 'text-[#0A2540] font-semibold bg-[#0A2540]/5'
                      : 'text-slate-600 hover:text-[#0A2540] hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <span
                    className={`absolute bottom-1 left-2 right-2 xl:left-3 xl:right-3 h-[1.5px] rounded-full bg-[#C8973E] transition-all duration-200 ${
                      isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50 group-hover:opacity-60 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link
                href="/services"
                className={`group relative whitespace-nowrap px-2 xl:px-3 py-2 rounded-lg text-[13px] xl:text-[13.5px] font-medium tracking-tight inline-flex items-center gap-1 xl:gap-1.5 transition-all duration-200 ${
                  pathname.startsWith('/services')
                    ? 'text-[#0A2540] font-semibold bg-[#0A2540]/5'
                    : 'text-slate-600 hover:text-[#0A2540] hover:bg-slate-50'
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200" />
                <span
                  className={`absolute bottom-1 left-2 right-6 xl:left-3 xl:right-7 h-[1.5px] rounded-full bg-[#C8973E] transition-all duration-200 ${
                    pathname.startsWith('/services')
                      ? 'opacity-100 scale-x-100'
                      : 'opacity-0 scale-x-50 group-hover:opacity-60 group-hover:scale-x-100'
                  }`}
                />
              </Link>

              {/* Mega Dropdown Menu */}
              {servicesDropdownOpen && (
                <div className="absolute top-full left-0 w-84 bg-white/95 backdrop-blur-xl border border-slate-200/80 ring-1 ring-[#C8973E]/10 rounded-2xl shadow-[0_24px_56px_-12px_rgba(10,37,64,0.28)] p-2 z-50 animate-in fade-in slide-in-from-top-1.5 duration-150">
                  <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                      Core Business Divisions
                    </span>
                    <Link
                      href="/services"
                      className="text-[11px] font-bold text-[#C8973E] hover:text-[#0A2540] transition-colors"
                    >
                      View All 7 →
                    </Link>
                  </div>
                  <div className="py-1.5 space-y-0.5">
                    {serviceLinks.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-700 hover:bg-[#F9FAFC] hover:text-[#0A2540] transition-all duration-150 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#0A2540]/5 text-[#0A2540] group-hover:bg-[#0A2540] group-hover:text-[#DFC37C] flex items-center justify-center shrink-0 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-semibold text-slate-800 group-hover:text-[#0A2540] block truncate text-xs">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium block">
                              Division 0{idx + 1}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {[
              { name: 'Our Team', href: '/team' },
              { name: 'Products', href: '/products' },
              { name: 'Blog', href: '/blog' },
              { name: 'FAQ', href: '/faq' },
              { name: 'Contact', href: '/contact' },
            ].map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative whitespace-nowrap px-2 xl:px-3 py-2 rounded-lg text-[13px] xl:text-[13.5px] font-medium tracking-tight transition-all duration-200 ${
                    isActive
                      ? 'text-[#0A2540] font-semibold bg-[#0A2540]/5'
                      : 'text-slate-600 hover:text-[#0A2540] hover:bg-slate-50'
                  }`}
                >
                  <span>{link.name}</span>
                  <span
                    className={`absolute bottom-1 left-2 right-2 xl:left-3 xl:right-3 h-[1.5px] rounded-full bg-[#C8973E] transition-all duration-200 ${
                      isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50 group-hover:opacity-60 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-2.5">
            <Link
              href="/contact"
              className="whitespace-nowrap text-[11px] xl:text-[12px] font-bold text-[#0A2540] hover:text-[#0A2540] uppercase tracking-[0.06em] xl:tracking-[0.08em] py-2.5 px-3.5 border border-slate-200 rounded-xl hover:border-[#C8973E]/70 hover:bg-[#C8973E]/5 transition-all duration-200"
            >
              Request a Quote
            </Link>
            <Link
              href="/booking"
              className="group inline-flex items-center gap-2 whitespace-nowrap bg-[#0A2540] hover:bg-[#061426] text-white px-4 py-2.5 rounded-xl text-[11px] xl:text-[12px] font-bold tracking-[0.06em] xl:tracking-[0.08em] uppercase transition-all duration-200 shadow-sm hover:shadow-md border border-[#C8973E]/40 hover:border-[#C8973E] active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5 text-[#DFC37C] transition-transform duration-200 group-hover:scale-110" />
              <span>Book a Service</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-[#0A2540] hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-[#C8973E]/20 shadow-[0_24px_48px_rgba(10,37,64,0.15)] animate-in slide-in-from-top-2 duration-200">
            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto overscroll-contain px-4 pt-4 pb-7 space-y-1">
            <Link
              href="/"
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/' ? 'text-[#0A2540] bg-[#0A2540]/5' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/about' ? 'text-[#0A2540] bg-[#0A2540]/5' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              About
            </Link>

            {/* Services Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                aria-expanded={mobileServicesOpen}
                aria-controls="mobile-services-panel"
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  pathname.startsWith('/services')
                    ? 'text-[#0A2540] bg-[#0A2540]/5'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    mobileServicesOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {mobileServicesOpen && (
                <div
                  id="mobile-services-panel"
                  className="mt-1 ml-2 pl-2 border-l border-[#C8973E]/30 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <Link
                    href="/services"
                    className="block px-3.5 py-2 rounded-lg text-[11px] font-bold text-[#C8973E] uppercase tracking-[0.1em] hover:bg-slate-50 transition-colors"
                  >
                    All Services
                  </Link>
                  {serviceLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                          pathname === item.href
                            ? 'text-[#0A2540] bg-[#0A2540]/5'
                            : 'text-slate-600 hover:text-[#0A2540] hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0 text-[#0A2540]/70" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/team"
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/team' ? 'text-[#0A2540] bg-[#0A2540]/5' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Our Team
            </Link>
            <Link
              href="/products"
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname.startsWith('/products') ? 'text-[#0A2540] bg-[#0A2540]/5' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Products & Gear
            </Link>
            <Link
              href="/blog"
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname.startsWith('/blog') ? 'text-[#0A2540] bg-[#0A2540]/5' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Articles & Blog
            </Link>
            <Link
              href="/testimonials"
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/testimonials' ? 'text-[#0A2540] bg-[#0A2540]/5' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Testimonials
            </Link>
            <Link
              href="/faq"
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/faq' ? 'text-[#0A2540] bg-[#0A2540]/5' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              FAQ
            </Link>
            <Link
              href="/pricing"
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/pricing' ? 'text-[#0A2540] bg-[#0A2540]/5' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className={`block px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === '/contact' ? 'text-[#0A2540] bg-[#0A2540]/5' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Contact
            </Link>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                href="/booking"
                className="w-full text-center bg-[#0A2540] hover:bg-[#061426] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.08em] shadow-sm transition-all"
              >
                Book a Service
              </Link>
              <Link
                href="/contact"
                className="w-full text-center border border-slate-200 text-[#0A2540] hover:border-[#C8973E] py-3.5 rounded-xl font-bold text-xs uppercase tracking-[0.08em] transition-all bg-slate-50"
              >
                Request a Quote
              </Link>
            </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
