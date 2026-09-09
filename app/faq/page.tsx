import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowRight, Phone } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import HeroBackground from '@/components/site/HeroBackground';
import { getFAQs } from '@/lib/db/db';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, buildFaqJsonLd, generatePageMetadata } from '@/lib/seo';
import JsonLd from '@/components/site/JsonLd';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('faq', DEFAULT_LOCALE, '/faq');
}

export default async function FAQPage() {
  const faqs = await getFAQs();
  // Only published Q&A pairs belong in the FAQPage node.
  const activeFaqs = faqs
    .filter(f => f.active !== false)
    .map(f => ({ question: f.question, answer: f.answer }));

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      {activeFaqs.length > 0 && <JsonLd data={buildFaqJsonLd(activeFaqs)} />}
      <Header />

      <main className="flex-1">
        {/* FAQ Hero */}
        <section className="bg-[#0A2540] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C8973E]/20 text-center relative overflow-hidden">
          <HeroBackground
            src="https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=2070&auto=format&fit=crop"
            alt="Miller Group Client Support"
            theme="dark-navy"
          />
          <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#DFC37C] uppercase">
              Help Center & Support
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Find clear answers regarding our booking procedure, multi-service corporate agreements, service areas, and billing policies.
            </p>
          </div>
        </section>

        {/* FAQ Accordion-like List */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#C8973E]/50 hover:-translate-y-0.5 transition-all duration-300 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#0A2540]/10 text-[#0A2540] flex items-center justify-center shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4 text-[#C8973E]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#C8973E] uppercase tracking-wider block mb-1">
                      {faq.category}
                    </span>
                    <h2 className="font-serif font-bold text-lg text-[#0A2540]">
                      {faq.question}
                    </h2>
                  </div>
                </div>

                <div className="pl-10 text-slate-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            ))}

            {/* Still have questions card */}
            <div className="bg-[#0A2540] text-white rounded-3xl p-8 border border-[#C8973E]/30 text-center space-y-4 mt-12 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-serif font-bold text-xl text-white">
                Have a Question Not Answered Here?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
                Our support team and Augustus Miller are available to answer any questions about your specific project requirements.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-4">
                <a
                  href="tel:+17705722022"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call +1 (770) 572-2022</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-500 hover:bg-white/10 text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Send a Direct Message</span>
                  <ArrowRight className="w-4 h-4" />
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
