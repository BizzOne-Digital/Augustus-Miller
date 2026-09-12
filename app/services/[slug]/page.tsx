import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Phone,
  HelpCircle,
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
import { getServiceBySlug, getServices } from '@/lib/db/db';
import type { Metadata } from 'next';
import JsonLd from '@/components/site/JsonLd';
import { resolveImageSrc } from '@/lib/images';
import {
  DEFAULT_LOCALE,
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildServiceJsonLd,
  noIndexMetadata
} from '@/lib/seo';


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

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    // Nothing to index at this URL.
    return noIndexMetadata('Service Not Found');
  }

  return buildMetadata({
    title: service.seoTitle || service.name,
    description: service.seoDescription || service.shortDescription,
    locale: DEFAULT_LOCALE,
    path: `/services/${service.slug}`,
    image: service.heroImage,
    keywords: [service.name]
  });
}

export default async function ServiceDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const allServices = await getServices();
  const otherServices = allServices.filter(s => s.slug !== slug).slice(0, 3);
  const Icon = iconMap[service.iconName] || Wrench;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      <JsonLd
        data={[
          buildServiceJsonLd({
            name: service.name,
            description: service.seoDescription || service.shortDescription,
            image: service.heroImage,
            path: `/services/${service.slug}`
          }),
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.name, path: `/services/${service.slug}` }
          ])
        ]}
      />
      <Header />

      <main className="flex-1">
        {/* Service Hero */}
        <section className="relative overflow-hidden bg-[#061426] text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#C8973E]/20">
          <HeroBackground
            src={resolveImageSrc(service.heroImage)}
            alt={service.name}
            theme="deep-midnight"
          />
          <div className="max-w-7xl mx-auto relative z-10">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#DFC37C] hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All 7 Services</span>
            </Link>

            <div className="max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8973E]/20 border border-[#C8973E]/40 text-[#DFC37C] text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                Division 0{service.displayOrder}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white leading-tight">
                {service.name}
              </h1>
              {service.divisionSlogan && (
                <p className="text-xl sm:text-2xl font-serif italic text-[#DFC37C]">
                  &ldquo;{service.divisionSlogan}&rdquo;
                </p>
              )}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                {service.shortDescription}
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href={`/booking?service=${encodeURIComponent(service.name)}`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#C8973E]/20"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book {service.name}</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border border-slate-400/80 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Request a Quote</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* In-depth Details, Included Items & Benefits */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content Body */}
            <div className="lg:col-span-8 space-y-12">
              {/* Detailed Description */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-4">
                <h2 className="font-serif font-bold text-2xl text-[#0A2540]">
                  Service Overview & Scope
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* What Is Included */}
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
                <h2 className="font-serif font-bold text-2xl text-[#0A2540]">
                  Included Capabilities & Work Scope
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.includedServices.map((inc, i) => (
                    <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-5 h-5 text-[#C8973E] shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-slate-800">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Benefits */}
              <div className="bg-[#0A2540] text-white rounded-2xl p-8 shadow-sm space-y-6 border border-[#C8973E]/30">
                <h2 className="font-serif font-bold text-2xl text-white">
                  Why Clients Choose Miller Group for {service.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#0F294A] border border-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-[#DFC37C] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-200">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Delivery Process */}
              {service.process && service.process.length > 0 && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
                  <h2 className="font-serif font-bold text-2xl text-[#0A2540]">
                    Our Standard Service Process
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {service.process.map((step) => (
                      <div key={step.step} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase">
                          Step 0{step.step}
                        </span>
                        <h3 className="font-serif font-bold text-base text-[#0A2540]">
                          {step.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Division FAQ */}
              {service.faq && service.faq.length > 0 && (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#C8973E]" />
                    <h2 className="font-serif font-bold text-2xl text-[#0A2540]">
                      Frequently Asked Questions
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {service.faq.map((f, i) => (
                      <div key={i} className="border-b border-slate-100 pb-4 last:border-b-0 space-y-1">
                        <h3 className="font-serif font-bold text-base text-[#0A2540]">
                          {f.question}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {f.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Sidebar Action Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg sticky top-28 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0A2540] text-[#DFC37C] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#C8973E] uppercase block">
                      Direct Request
                    </span>
                    <span className="font-serif font-bold text-lg text-[#0A2540]">
                      Ready to Proceed?
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Book online to reserve your preferred date and time, or contact our dispatch desk directly.
                </p>

                <div className="space-y-3">
                  <Link
                    href={`/booking?service=${encodeURIComponent(service.name)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-[#C8973E]/20"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Service Online</span>
                  </Link>

                  <Link
                    href={`/contact?service=${encodeURIComponent(service.name)}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-slate-300 hover:border-[#0A2540] text-[#0A2540] font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    <span>Request Custom Quote</span>
                  </Link>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <a href="tel:+17705722022" className="flex items-center gap-2 font-bold text-[#0A2540] hover:text-[#C8973E]">
                    <Phone className="w-4 h-4 text-[#C8973E]" />
                    <span>Call: +1 (770) 572-2022</span>
                  </a>
                  <p className="text-[11px] text-slate-400">
                    Metro Atlanta, statewide Georgia, and nationwide consulting.
                  </p>
                </div>
              </div>

              {/* Related Services */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-sm text-[#0A2540] uppercase tracking-wider border-b border-slate-100 pb-2">
                  Other Core Divisions
                </h3>
                <div className="space-y-3">
                  {otherServices.map((other) => (
                    <Link
                      key={other.id}
                      href={`/services/${other.slug}`}
                      className="group flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <span className="font-semibold text-xs text-slate-800 group-hover:text-[#C8973E] block">
                          {other.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {other.divisionSlogan}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#C8973E] group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
