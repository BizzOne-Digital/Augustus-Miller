import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  Phone,
  ShieldCheck,
  TrendingUp,
  Building,
  HardHat,
  Wrench,
  Hammer,
  Truck,
  Monitor
} from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import HeroBackground from '@/components/site/HeroBackground';
import { getServices } from '@/lib/db/db';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, generatePageMetadata } from '@/lib/seo';
import { resolveImageSrc } from '@/lib/images';


// Admin edits must show up on the public site immediately, so this route is
// rendered per request instead of being cached at build time.
export const dynamic = 'force-dynamic';

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Building,
  HardHat,
  Wrench,
  Hammer,
  Truck,
  Monitor
};

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('services', DEFAULT_LOCALE, '/services');
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      <Header />

      <main className="flex-1">
        {/* Page Hero */}
        <section className="bg-[#0A2540] text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[#C8973E]/20">
          <HeroBackground
            src="https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?q=80&w=2070&auto=format&fit=crop"
            alt="Miller Group 7 Dedicated Service Divisions"
            theme="dark-navy"
          />
          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#DFC37C] uppercase">
              Our Comprehensive Capabilities
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white">
              7 Dedicated Service Divisions. <br className="hidden sm:inline" />
              <span className="text-[#DFC37C]">One Accountable Partner.</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              We eliminate the complexity of working with separate vendors. Whether managing property, renovating commercial facilities, or establishing IT infrastructure, Miller Group delivers end-to-end craftsmanship.
            </p>
          </div>
        </section>

        {/* 7 Services Detailed List */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            {services.map((svc, idx) => {
              const Icon = iconMap[svc.iconName] || Wrench;
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={svc.id}
                  id={svc.slug}
                  className={`bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#C8973E]/40 hover:-translate-y-1 transition-all duration-300 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center scroll-mt-28 ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Left / Text details */}
                  <div className={`lg:col-span-7 space-y-6 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0A2540] text-[#DFC37C] flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase">
                          Division 0{idx + 1}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
                          {svc.name}
                        </h2>
                      </div>
                    </div>

                    {svc.divisionSlogan && (
                      <div className="inline-block px-3.5 py-1.5 rounded-md bg-[#C8973E]/10 border-l-4 border-[#C8973E] text-[#9A7024] font-serif italic text-sm font-semibold">
                        &ldquo;{svc.divisionSlogan}&rdquo;
                      </div>
                    )}

                    <p className="text-slate-600 text-base leading-relaxed">
                      {svc.description}
                    </p>

                    {/* Services Included */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        Included Services:
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {svc.includedServices.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                            <CheckCircle2 className="w-4 h-4 text-[#C8973E] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <Link
                        href={`/services/${svc.slug}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0A2540] hover:bg-[#153a63] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                      >
                        <span>Division Page & FAQ</span>
                        <ArrowRight className="w-4 h-4 text-[#DFC37C]" />
                      </Link>

                      <Link
                        href={`/booking?service=${encodeURIComponent(svc.name)}`}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-[#C8973E]/20"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Book This Service</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right / Photo Banner */}
                  <div className={`lg:col-span-5 relative ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
                      <Image
                        src={resolveImageSrc(svc.heroImage)}
                        alt={svc.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-xs font-semibold text-[#DFC37C] block uppercase tracking-wider">
                          Georgia & Beyond
                        </span>
                        <span className="font-serif text-lg font-bold">
                          {svc.divisionSlogan}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Global Banner */}
        <section className="bg-[#061426] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-[#C8973E]/20 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <span className="text-[#DFC37C] text-xs font-bold tracking-[0.2em] uppercase">
              Looking for a Multi-Division Commercial Contract?
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Combine Services with Miller Group of Company LLC
            </h2>
            <p className="text-slate-300 text-base sm:text-lg">
              We draft customized, unified service level agreements for property portfolios, retail chains, and corporate facilities.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3.5 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-sm uppercase tracking-wider transition-colors shadow-lg"
              >
                Discuss Custom Contract
              </Link>
              <a
                href="tel:+17705722022"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-slate-500 hover:bg-white/10 text-white font-semibold text-sm uppercase tracking-wider transition-colors"
              >
                <Phone className="w-4 h-4 text-[#DFC37C]" />
                <span>+1 (770) 572-2022</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
