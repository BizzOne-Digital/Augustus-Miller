import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Star } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import HeroBackground from '@/components/site/HeroBackground';
import { getTestimonials } from '@/lib/db/db';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('testimonials', DEFAULT_LOCALE, '/testimonials');
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      <Header />

      <main className="flex-1">
        {/* Testimonials Hero */}
        <section className="bg-[#0A2540] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C8973E]/20 text-center relative overflow-hidden">
          <HeroBackground
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2064&auto=format&fit=crop"
            alt="Miller Group Satisfied Clients"
            theme="dark-navy"
          />
          <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#DFC37C] uppercase">
              Proven Track Record
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white">
              What Our Clients Say
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Read how our dedicated service divisions empower property owners, growing companies, and homeowners with dependable results.
            </p>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between space-y-6 hover:border-[#C8973E]/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-[#C8973E]">
                      {[...Array(test.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#C8973E]" />
                      ))}
                    </div>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
                      &ldquo;{test.content}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <span className="font-serif font-bold text-[#0A2540] text-base block">
                      {test.customerName}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      {test.customerRole} {test.company ? `• ${test.company}` : ''}
                    </span>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#0A2540]/5 text-[#C8973E] text-[11px] font-semibold">
                      Service: {test.serviceCategory}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-16 bg-[#061426] text-white rounded-3xl p-8 sm:p-12 border border-[#C8973E]/30 text-center space-y-4 max-w-3xl mx-auto">
              <h3 className="text-2xl font-serif font-bold text-white">
                Experience the Miller Group Difference
              </h3>
              <p className="text-slate-300 text-sm max-w-xl mx-auto">
                Schedule a consultation or book your first service today.
              </p>
              <div className="pt-2 flex justify-center gap-4">
                <Link
                  href="/booking"
                  className="px-8 py-3 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Book a Service
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 rounded-lg border border-slate-500 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
