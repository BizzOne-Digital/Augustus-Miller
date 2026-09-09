'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Calendar,
  ShieldCheck,
  MapPin,
  Handshake,
  Sparkles,
  Phone
} from 'lucide-react';
import { RotatingTagline } from './ScrollReveal';

export const HeroMotion: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const divisionPromises = [
    'Strategic Business Consulting & Capital Planning',
    'Full-Service Property Rental & Asset Management',
    'General Construction & Facility Remodeling',
    'Urgent Plumbing, Electrical & Maintenance Repairs',
    'Precision Residential & Commercial Handyman Services',
    'Statewide Cargo Transportation & Dedicated Logistics',
    'Enterprise IT Infrastructure & Modern Web Systems',
  ];

  // Motion variants with cinematic easing curve
  const easeCurve = [0.16, 1, 0.3, 1] as const;

  return (
    <section className="relative bg-[#061426] text-white pt-14 pb-20 lg:pt-20 lg:pb-28 overflow-hidden border-b border-[#C8973E]/20">
      {/* Hero Background Image with Cinematic Reveal and Subtle Brand Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={shouldReduceMotion ? { scale: 1, opacity: 0.8 } : { scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Miller Group Corporate Architecture"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        {/* Lightened brand scrim: architecture stays visible, headline stays crisp */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#061426]/88 via-[#061426]/55 to-[#061426]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061426]/92 via-transparent to-[#061426]/45" />
      </div>

      {/* Subtle architectural grid / ambient glow */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#DFC37C_1px,transparent_1px)] [background-size:24px_24px] z-0" />
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#C8973E]/12 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0A2540]/55 rounded-full blur-3xl pointer-events-none z-0" />
      {/* Gold hairline at the hero base */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8973E]/50 to-transparent pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col">
          {/* Value Proposition & Staggered Motion */}
          <div className="w-full max-w-4xl space-y-6 text-center lg:text-left">
            {/* 01. Motto Eyebrow Pill - gentle slide down */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeCurve }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#C8973E]/12 border border-[#C8973E]/35 text-[#DFC37C] text-[11px] font-bold tracking-[0.12em] uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-[#C8973E] animate-pulse" />
              <span>One Group. Many Solutions. Endless Possibilities.</span>
            </motion.div>

            {/* 02. Headline - subtle upward text reveal */}
            <motion.h1
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: easeCurve }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-serif font-bold tracking-tight text-white leading-[1.12]"
            >
              Delivering Innovative, Reliable, and <span className="text-[#DFC37C]">High-Quality</span> Professional Services That Create Lasting Value.
            </motion.h1>

            {/* 03. Editorial Rotating Division Focus */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: easeCurve }}
              className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-300"
            >
              <span className="flex items-center gap-1.5 text-[#DFC37C] uppercase tracking-wider text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#C8973E]" />
                <span>Division Focus:</span>
              </span>
              <RotatingTagline
                messages={divisionPromises}
                intervalMs={4000}
                className="text-white font-medium text-xs sm:text-[13px] border-b border-[#C8973E]/40 pb-0.5"
              />
            </motion.div>

            {/* 04. Supporting paragraph - upward fade */}
            <motion.p
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: easeCurve }}
              className="text-slate-300 text-base sm:text-lg lg:text-[17px] font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              A diversified service company providing trusted solutions in business consultancy, construction, property management, repairs, transportation, and IT services.
            </motion.p>

            {/* 05. Dual Action Buttons - staggered entrance with hover micro-interaction */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42, ease: easeCurve }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <Link
                href="/contact"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-[0.08em] transition-all duration-200 shadow-md shadow-[#C8973E]/20 active:scale-[0.98]"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/booking"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-slate-500/70 hover:border-slate-300 font-bold text-xs uppercase tracking-[0.08em] transition-all duration-200 backdrop-blur-sm active:scale-[0.98]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#DFC37C]" />
                <span className="group-hover:text-[#DFC37C] transition-colors">Book a Service</span>
              </Link>

              <Link
                href="/contact"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white border border-[#C8973E]/50 hover:border-[#C8973E] hover:bg-[#C8973E]/10 font-bold text-xs uppercase tracking-[0.08em] transition-all duration-200 active:scale-[0.98]"
              >
                <Phone className="w-3.5 h-3.5 text-[#DFC37C]" />
                <span className="group-hover:text-[#DFC37C] transition-colors">Contact Us Today</span>
              </Link>
            </motion.div>

            {/* 06. Micro Trust Indicators - staggered slide-up */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.54, ease: easeCurve }}
              className="pt-7 border-t border-slate-800/90 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C8973E] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">7 Divisions</p>
                  <p className="text-[11px] text-slate-400">Under One Group</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#C8973E] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Georgia & Beyond</p>
                  <p className="text-[11px] text-slate-400">Metro Atlanta Hub</p>
                </div>
              </div>

              <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
                <Handshake className="w-5 h-5 text-[#C8973E] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">Direct Leadership</p>
                  <p className="text-[11px] text-slate-400">CEO Augustus Miller</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroMotion;
