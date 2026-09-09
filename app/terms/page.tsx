import React from 'react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

export const metadata = {
  title: 'Terms of Service | Miller Group of Company LLC',
  description: 'Terms of service and customer agreements for Miller Group of Company LLC.'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase block">
            Customer Agreements
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540]">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-400">
            Effective Date: March 2026 • Miller Group of Company LLC
          </p>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-6">
            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">1. Service Engagement</h2>
              <p>
                By requesting services, scheduling an appointment, or signing a contract with Miller Group of Company LLC, you agree to these Terms of Service. Individual projects may also be governed by written statements of work or formal estimates.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">2. Estimates & Pricing</h2>
              <p>
                All estimates provided are based on the initial information provided. Should unforeseen structural, electrical, mechanical, or technical conditions arise on-site, a written change order will be presented for approval prior to additional work commencing.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">3. Client Responsibilities</h2>
              <p>
                The client agrees to provide reasonable access to the property or worksite, ensure safe operating conditions, and disclose known hazards or relevant building restrictions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">4. Quality & Workmanship Guarantee</h2>
              <p>
                Miller Group of Company LLC stands behind our workmanship with strict adherence to industry standards, manufacturer specifications, and applicable local codes.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
