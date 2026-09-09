import React from 'react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('privacy', DEFAULT_LOCALE, '/privacy-policy');
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
          <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase block">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540]">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: March 2026 • Miller Group of Company LLC
          </p>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-6">
            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">1. Introduction</h2>
              <p>
                Miller Group of Company LLC (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) respects your privacy and is committed to protecting the personal information you provide when visiting our website or engaging our services.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">2. Information We Collect</h2>
              <p>
                When you request a service, submit a booking form, or contact us, we may collect your name, email address, phone number, physical service address, and specific details about the work requested. We do not sell or rent your personal information to third parties.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">3. How We Use Your Information</h2>
              <p>
                We use collected information solely to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Coordinate appointment scheduling and dispatch technicians or consultants</li>
                <li>Prepare and provide accurate quotes, proposals, and invoices</li>
                <li>Respond to customer inquiries and deliver ongoing support</li>
                <li>Comply with applicable legal, licensing, and insurance obligations</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">4. Data Security</h2>
              <p>
                We employ standard technical, administrative, and physical security measures to safeguard your personal data from unauthorized access, disclosure, or destruction.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">5. Contact Us</h2>
              <p>
                If you have questions regarding this Privacy Policy, please contact our corporate desk at <strong>sgustus76@gmail.com</strong> or call <strong>+1 (770) 572-2022</strong>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
