'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  TrendingUp,
  Building,
  HardHat,
  Wrench,
  Hammer,
  Truck,
  Monitor,
  ShieldCheck,
  Handshake,
  Award,
  Users,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import MillerLogo from './MillerLogo';
import { resolveImageSrc } from '@/lib/images';

interface DivisionInfo {
  id: string;
  slug: string;
  name: string;
  slogan: string;
  icon: React.ElementType;
  badgeBg: string;
  color: string;
  tagline: string;
  image: string;
  highlights: string[];
}

export const servicesData: DivisionInfo[] = [
  {
    id: 'srv-1',
    slug: 'financial-consulting',
    name: 'Financial & Small Business Consultancy',
    slogan: 'Smart Advice. Stronger Business.',
    icon: TrendingUp,
    badgeBg: 'bg-[#0A2540]',
    color: '#C8973E',
    tagline: 'Strategic budgeting, capital planning, and growth roadmaps.',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1000&auto=format&fit=crop',
    highlights: ['Business Planning & Structuring', 'Financial Budgeting & Cash Flow', 'Tax Preparation Support', 'Feasibility & Growth Roadmaps']
  },
  {
    id: 'srv-2',
    slug: 'property-management',
    name: 'Property Rental & Management',
    slogan: 'Quality Properties. Trusted Service.',
    icon: Building,
    badgeBg: 'bg-[#C8973E]',
    color: '#0A2540',
    tagline: 'Complete tenant placement, lease management, and asset care.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
    highlights: ['Tenant Screening & Placement', 'Lease Administration & Escrow', '24/7 Property Oversight', 'Preventative Asset Preservation']
  },
  {
    id: 'srv-3',
    slug: 'construction',
    name: 'General Construction',
    slogan: 'Building Dreams. Creating Legacies.',
    icon: HardHat,
    badgeBg: 'bg-[#0A2540]',
    color: '#C8973E',
    tagline: 'Residential builds, commercial remodeling, and structural additions.',
    image: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=1000&auto=format&fit=crop',
    highlights: ['Residential & Commercial Builds', 'Interior & Exterior Remodeling', 'Site Grading & Foundations', 'Permitting & Project Oversight']
  },
  {
    id: 'srv-4',
    slug: 'repairs-maintenance',
    name: 'Repairs & Maintenance',
    slogan: 'Fixing Today. Securing Tomorrow.',
    icon: Wrench,
    badgeBg: 'bg-[#C8973E]',
    color: '#0A2540',
    tagline: 'Plumbing, electrical, drywall, and structural maintenance.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000&auto=format&fit=crop',
    highlights: ['Plumbing & Leak Diagnoses', 'Electrical Diagnostics & Fixtures', 'Drywall & Interior Painting', 'Preventative Facility Contracts']
  },
  {
    id: 'srv-5',
    slug: 'handyman',
    name: 'Handyman Services',
    slogan: 'No Job Too Small. We Do It All.',
    icon: Hammer,
    badgeBg: 'bg-[#0A2540]',
    color: '#C8973E',
    tagline: 'TV mounting, furniture assembly, lighting, and home punch-lists.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
    highlights: ['Flat-pack & Furniture Assembly', 'TV Mounting & Cable Routing', 'Fixture Installation & Swaps', 'Pressure Washing & Gutters']
  },
  {
    id: 'srv-6',
    slug: 'transportation',
    name: 'Transportation Services',
    slogan: 'Safe. Reliable. On Time. Every Time.',
    icon: Truck,
    badgeBg: 'bg-[#C8973E]',
    color: '#0A2540',
    tagline: 'Cargo delivery, equipment transport, and moving assistance.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
    highlights: ['Local & Regional Cargo Dispatch', 'Commercial Material Transport', 'Moving Assistance & Delivery', 'Punctual Dispatch Windows']
  },
  {
    id: 'srv-7',
    slug: 'it-services',
    name: 'IT Services',
    slogan: 'Smart Technology. Stronger Connections. Better Business.',
    icon: Monitor,
    badgeBg: 'bg-[#0A2540]',
    color: '#C8973E',
    tagline: 'Network setup, cybersecurity, custom websites, and tech support.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1000&auto=format&fit=crop',
    highlights: ['Office Network Architecture', 'Cybersecurity & Data Backups', 'Business Websites & Apps', 'Workstation Troubleshooting']
  }
];

export const InteractiveServicesWheel: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeService = servicesData[activeIdx];
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="w-full bg-[#061426] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-y border-[#C8973E]/20">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#C8973E]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#0A2540]/80 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8973E]/15 border border-[#C8973E]/30 text-[#DFC37C] text-[11px] font-bold tracking-[0.12em] uppercase mb-4">
            Official 7 Business Divisions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white mb-4">
            One Group. <span className="text-[#DFC37C]">Seven Core Services.</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            From strategic business consulting and modern IT infrastructure to general construction, property management, and prompt repairs — Miller Group delivers excellence under one dependable roof.
          </p>
        </div>

        {/* The 7 Division Interactive Tabs / Wheel Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-10">
          {servicesData.map((svc, idx) => {
            const Icon = svc.icon;
            const isSelected = idx === activeIdx;
            return (
              <button
                key={svc.id}
                onClick={() => setActiveIdx(idx)}
                className={`flex flex-col items-center text-center p-3.5 sm:p-4 rounded-xl transition-all duration-200 relative border cursor-pointer ${
                  isSelected
                    ? 'bg-[#0E2F56] border-[#DFC37C] text-white shadow-xl shadow-black/30 ring-1 ring-[#DFC37C]/40'
                    : 'bg-[#0A1D33]/90 border-slate-800 text-slate-300 hover:bg-[#0E2849] hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 transition-colors duration-200 ${
                    isSelected ? 'bg-[#C8973E] text-[#0A2540]' : 'bg-[#0A2540] text-[#DFC37C]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold leading-snug line-clamp-2">
                  {svc.name}
                </span>
                <span className={`text-[10px] font-bold mt-1.5 ${isSelected ? 'text-[#DFC37C]' : 'text-slate-400'}`}>
                  0{idx + 1}
                </span>
                {isSelected && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#DFC37C] rotate-45" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Division Feature Showcase with AnimatePresence */}
        <div className="bg-[#081B30] border border-[#C8973E]/25 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden min-h-[480px] flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center w-full"
            >
              {/* Left: Division Details & Included Services */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#C8973E] text-[#0A2540] flex items-center justify-center shadow-md shrink-0">
                    <activeService.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-[#DFC37C] tracking-[0.14em] uppercase block">
                      Division 0{activeIdx + 1} of 07
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
                      {activeService.name}
                    </h3>
                  </div>
                </div>

                {/* Division Motto */}
                <div className="inline-block px-4 py-2.5 rounded-lg bg-[#C8973E]/10 border-l-4 border-[#C8973E]">
                  <p className="text-[#DFC37C] font-serif italic text-base sm:text-lg font-medium">
                    &ldquo;{activeService.slogan}&rdquo;
                  </p>
                </div>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {activeService.tagline}
                </p>

                {/* Highlights Checklist */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-3">
                    Key Capabilities Included:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeService.highlights.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-[#DFC37C] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons with arrow slide micro-interaction */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={`/services/${activeService.slug}`}
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-[0.08em] transition-all duration-200 shadow-md shadow-[#C8973E]/20 active:scale-[0.98]"
                  >
                    <span>Explore Division Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href={`/booking?service=${encodeURIComponent(activeService.name)}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-transparent hover:bg-white/10 text-white border border-slate-600 font-bold text-xs uppercase tracking-[0.08em] transition-colors active:scale-[0.98]"
                  >
                    <span>Book This Service</span>
                  </Link>
                </div>
              </div>

              {/* Right: Service Photography + Badge */}
              <div className="lg:col-span-5 relative">
                <div className="relative h-72 sm:h-84 lg:h-96 w-full rounded-xl overflow-hidden border border-[#C8973E]/30 shadow-2xl group">
                  <Image
                    src={resolveImageSrc(activeService.image)}
                    alt={activeService.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061426]/90 via-[#061426]/20 to-transparent" />
                  
                  {/* Embedded Seal Stamp */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-2 rounded-full shadow-2xl border border-[#C8973E]">
                    <MillerLogo variant="mark" size="sm" width={52} height={52} />
                  </div>

                  <div className="absolute bottom-4 left-4 max-w-[70%]">
                    <span className="text-[10px] font-bold text-[#DFC37C] uppercase tracking-[0.1em] block">
                      Georgia & Nationwide
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-white line-clamp-1">
                      {activeService.slogan}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Bar: 4 Core Values */}
        <div className="mt-14 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-8">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#0A2540] border border-[#C8973E]/40 text-[#DFC37C] flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-[0.12em] text-white uppercase">INTEGRITY</span>
              <p className="text-xs text-slate-400 mt-1 max-w-[180px]">Honest, ethical, and transparent service.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#0A2540] border border-[#C8973E]/40 text-[#DFC37C] flex items-center justify-center mb-2.5">
                <Handshake className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-[0.12em] text-white uppercase">RELIABILITY</span>
              <p className="text-xs text-slate-400 mt-1 max-w-[180px]">Consistent, dependable, and timely delivery.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#0A2540] border border-[#C8973E]/40 text-[#DFC37C] flex items-center justify-center mb-2.5">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-[0.12em] text-white uppercase">QUALITY</span>
              <p className="text-xs text-slate-400 mt-1 max-w-[180px]">High standards in every project.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#0A2540] border border-[#C8973E]/40 text-[#DFC37C] flex items-center justify-center mb-2.5">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold tracking-[0.12em] text-white uppercase">COMMITMENT</span>
              <p className="text-xs text-slate-400 mt-1 max-w-[180px]">Dedicated to customer satisfaction and long-term relationships.</p>
            </div>
          </div>

          {/* Central Corporate Banner */}
          <div className="bg-[#051121] py-3.5 px-6 rounded-xl border border-[#C8973E]/30 text-center">
            <p className="font-serif tracking-[0.2em] text-[#DFC37C] font-bold text-xs sm:text-sm md:text-base uppercase">
              ONE GROUP. MANY SOLUTIONS. ENDLESS POSSIBILITIES.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveServicesWheel;
