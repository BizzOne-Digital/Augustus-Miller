'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award,
  Handshake
} from 'lucide-react';
import MillerLogo from './MillerLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#061426] text-slate-300 border-t border-[#C8973E]/20">
      {/* Top Banner with Motto */}
      <div className="bg-[#0A2540] py-8 px-4 sm:px-6 lg:px-8 border-b border-[#C8973E]/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-[#DFC37C] text-xs font-bold tracking-[0.2em] uppercase block mb-1">
              The Miller Group Promise
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              One Group. Many Solutions. Endless Possibilities.
            </h3>
            <p className="text-slate-300 text-sm mt-1">
              Building Solutions. Delivering Value across Georgia & Nationwide.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/booking"
              className="px-6 py-3 rounded-xl bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-[0.08em] transition-all duration-200 shadow-md active:scale-[0.98]"
            >
              Book a Service
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-slate-500/70 hover:border-slate-300 font-bold text-xs uppercase tracking-[0.08em] transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <MillerLogo variant="full" size="sm" width={100} height={100} />
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-white text-lg tracking-wide">
                MILLER GROUP OF COMPANY LLC
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                A diversified service-oriented company established to provide practical, reliable, and innovative solutions that meet the evolving needs of individuals, businesses, property owners, and communities.
              </p>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C8973E]" />
                <span>Founder & CEO: <strong>Augustus Miller</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C8973E]" />
                <span>Operating across Metro Atlanta & Georgia</span>
              </div>
            </div>
          </div>

          {/* Col 2: The 7 Services */}
          <div className="space-y-3">
            <h5 className="font-serif text-white font-bold text-sm tracking-wider uppercase border-b border-[#C8973E]/30 pb-2">
              Our 7 Services
            </h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/services/financial-consulting" className="hover:text-[#DFC37C] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#C8973E]" />
                  <span>Financial Consultancy</span>
                </Link>
              </li>
              <li>
                <Link href="/services/property-management" className="hover:text-[#DFC37C] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#C8973E]" />
                  <span>Property Management</span>
                </Link>
              </li>
              <li>
                <Link href="/services/construction" className="hover:text-[#DFC37C] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#C8973E]" />
                  <span>General Construction</span>
                </Link>
              </li>
              <li>
                <Link href="/services/repairs-maintenance" className="hover:text-[#DFC37C] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#C8973E]" />
                  <span>Repairs & Maintenance</span>
                </Link>
              </li>
              <li>
                <Link href="/services/handyman" className="hover:text-[#DFC37C] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#C8973E]" />
                  <span>Handyman Services</span>
                </Link>
              </li>
              <li>
                <Link href="/services/transportation" className="hover:text-[#DFC37C] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#C8973E]" />
                  <span>Transportation Services</span>
                </Link>
              </li>
              <li>
                <Link href="/services/it-services" className="hover:text-[#DFC37C] transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-[#C8973E]" />
                  <span>IT & Tech Services</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company Links */}
          <div className="space-y-3">
            <h5 className="font-serif text-white font-bold text-sm tracking-wider uppercase border-b border-[#C8973E]/30 pb-2">
              Company
            </h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Miller Group</Link></li>
              <li><Link href="/team" className="hover:text-white transition-colors">Leadership & Team</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">All Divisions</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Products & Gear</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Articles & Insights</Link></li>
              <li><Link href="/testimonials" className="hover:text-white transition-colors">Client Testimonials</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Service Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Service Area */}
          <div className="space-y-3">
            <h5 className="font-serif text-white font-bold text-sm tracking-wider uppercase border-b border-[#C8973E]/30 pb-2">
              Get in Touch
            </h5>
            <div className="space-y-3 text-xs text-slate-300">
              <a href="tel:+17705722022" className="flex items-start gap-2.5 hover:text-[#DFC37C] transition-colors">
                <Phone className="w-4 h-4 text-[#C8973E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white text-sm">+1 (770) 572-2022</span>
                  <span className="text-slate-400">Mon - Sat: 8am - 6pm</span>
                </div>
              </a>

              <a href="mailto:sgustus76@gmail.com" className="flex items-start gap-2.5 hover:text-[#DFC37C] transition-colors">
                <Mail className="w-4 h-4 text-[#C8973E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-white">sgustus76@gmail.com</span>
                  <span className="text-slate-400">Direct Inquiries</span>
                </div>
              </a>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8973E] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Service Coverage:</span>
                  <span className="text-slate-400">Metro Atlanta, surrounding counties, and statewide Georgia</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C8973E] shrink-0 mt-0.5" />
                <span className="text-slate-400">Emergency repairs subject to availability</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Compliance Disclaimer */}
      <div className="border-t border-slate-800 bg-[#040D1A] py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} MILLER GROUP OF COMPANY LLC. All Rights Reserved. Professional Diversified Services.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-slate-300 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
