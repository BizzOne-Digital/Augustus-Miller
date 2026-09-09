import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, FileText, Phone, ShieldCheck } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import HeroBackground from '@/components/site/HeroBackground';
import { getServices } from '@/lib/db/db';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, buildMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: 'Service Pricing',
    description:
      'Miller Group of Company LLC pricing is customized based on project size, materials, labor, and service requirements. Request a tailored quote for any of our seven divisions.',
    locale: DEFAULT_LOCALE,
    path: '/pricing',
    keywords: ['Miller Group pricing', 'service quote Atlanta']
  });
}

/**
 * Pricing page.
 *
 * The client's model is contact-for-quote, so this page explains how pricing is
 * determined and routes to a quote rather than publishing rate cards. The
 * "Starting Rates" figures in the brief were marked "optional to add later" and
 * are deliberately NOT published until the client confirms them.
 */
export default async function PricingPage() {
  const services = await getServices();

  const factors = [
    { title: 'Project Size & Scope', detail: 'The amount of work involved, the areas covered, and the total hours or duration required.' },
    { title: 'Materials', detail: 'Grade, quantity, and current supply cost of any materials, parts, or hardware needed.' },
    { title: 'Labor', detail: 'The trades and specialists required, and whether the work is scheduled or urgent.' },
    { title: 'Service Requirements', detail: 'Access constraints, permitting, compliance requirements, and any ongoing support you need.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      <Header />

      <main className="flex-1">
        {/* Pricing Hero */}
        <section className="bg-[#0A2540] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C8973E]/20 text-center relative overflow-hidden">
          <HeroBackground
            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070&auto=format&fit=crop"
            alt="Miller Group Service Pricing"
            theme="dark-navy"
          />
          <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#DFC37C] uppercase">
              Transparent, Custom Quotes
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white">
              Service Pricing Overview
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Our pricing is customized based on project size, materials, labor, and service
              requirements. Contact us for a tailored quote.
            </p>
          </div>
        </section>

        {/* What determines your price */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold tracking-[0.2em] text-[#C8973E] uppercase">
                How We Quote
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
                What Determines Your Price
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Every quote is written for your specific job. We assess the work on site or in
                consultation, then put the figure in writing before anything begins.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {factors.map((factor) => (
                <div
                  key={factor.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-2"
                >
                  <h3 className="font-serif font-bold text-base text-[#0A2540]">{factor.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{factor.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quote by division */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold tracking-[0.2em] text-[#C8973E] uppercase">
                Seven Divisions
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
                Request a Quote by Division
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((svc) => (
                <Link
                  key={svc.id}
                  href={`/contact?service=${encodeURIComponent(svc.name)}`}
                  className="group rounded-2xl border border-slate-200 bg-[#F9FAFC] p-6 transition-all duration-200 hover:border-[#C8973E]/50 hover:shadow-md space-y-2"
                >
                  <h3 className="font-serif font-bold text-base text-[#0A2540] transition-colors group-hover:text-[#C8973E]">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {svc.shortDescription}
                  </p>
                  <span className="inline-flex items-center gap-1.5 pt-1 text-[11px] font-bold uppercase tracking-wider text-[#0A2540]">
                    Request a quote
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* What you can expect */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <FileText className="w-6 h-6 text-[#C8973E]" />
              <h3 className="font-serif font-bold text-base text-[#0A2540]">Written Quotes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                You receive your quote in writing, itemized by scope, before work starts.
              </p>
            </div>
            <div className="space-y-2">
              <ShieldCheck className="w-6 h-6 text-[#C8973E]" />
              <h3 className="font-serif font-bold text-base text-[#0A2540]">No Obligation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Requesting a quote costs nothing and commits you to nothing.
              </p>
            </div>
            <div className="space-y-2">
              <Calendar className="w-6 h-6 text-[#C8973E]" />
              <h3 className="font-serif font-bold text-base text-[#0A2540]">Prompt Response</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We review each request promptly and follow up to confirm project details.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#061426] text-white">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">
              Ready for a Tailored Quote?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Tell us what you need and we will come back with a written figure for your exact
              scope.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <Link
                href="/contact"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-[0.08em] transition-all duration-200 shadow-md active:scale-[0.98]"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href="tel:+17705722022"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-[#C8973E]/50 hover:border-[#C8973E] hover:bg-[#C8973E]/10 text-white font-bold text-xs uppercase tracking-[0.08em] transition-all duration-200 active:scale-[0.98]"
              >
                <Phone className="w-3.5 h-3.5 text-[#DFC37C]" />
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
