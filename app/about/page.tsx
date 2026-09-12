import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Award,
  Handshake,
  Users,
  CheckCircle2,
  ArrowRight,
  Phone,
  Mail,
  Building,
  Target,
  Eye,
  Compass
} from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import MillerLogo from '@/components/site/MillerLogo';
import HeroBackground from '@/components/site/HeroBackground';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, generatePageMetadata } from '@/lib/seo';
import { getSiteSettings, getTeam } from '@/lib/db/db';
import { resolveImageSrc } from '@/lib/images';


// Admin edits must show up on the public site immediately, so this route is
// rendered per request instead of being cached at build time.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('about', DEFAULT_LOCALE, '/about');
}

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const team = await getTeam();

  // The founder card mirrors the first team member, so editing that record in
  // the admin dashboard updates this section too.
  const founder = team[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      <Header />

      <main className="flex-1">
        {/* About Hero */}
        <section className="bg-[#061426] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C8973E]/20 relative overflow-hidden">
          <HeroBackground
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
            alt="Miller Group Executive Boardroom"
            theme="deep-midnight"
          />
          <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#DFC37C] uppercase">
              The Miller Group Story
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white">
              Building Solutions. Delivering Value.
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Founded on the belief that personal service, technical excellence, and honesty are the foundation of enduring client partnerships.
            </p>
          </div>
        </section>

        {/* Company Narrative & Founder Profile */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-block text-xs font-bold text-[#C8973E] tracking-widest uppercase">
                Our History & Purpose
              </div>
              <h2 className="text-3xl font-serif font-bold text-[#0A2540] leading-tight">
                A Diversified Enterprise Built on Real-World Accountability.
              </h2>
              <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed">
                <p>
                  <strong>Miller Group of Company LLC</strong> is a diversified service-oriented company established to provide practical, reliable, and innovative solutions across multiple industries. Built on the belief that clients deserve a single dependable partner, we deliver excellence through professionalism, integrity, and customer satisfaction.
                </p>
                <p>
                  In traditional markets, clients are often forced to juggle multiple disjointed vendors — hiring one firm for financial advice, another for physical repairs, a third for construction, and yet another for computer networks. This fragmentation breeds finger-pointing, unexpected costs, and delays.
                </p>
                <p>
                  Under the stewardship of Founder & CEO <strong>Augustus Miller</strong>, we assembled seven complementary divisions under a single, unified banner. Whether managing a rental property, building an addition, configuring an IT office network, or dispatching urgent repairs, our clients receive consistent standards, clear written quotes, and direct executive oversight.
                </p>
              </div>

              {/* Mission & Vision Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[#0A2540]">
                    <Target className="w-5 h-5 text-[#C8973E]" />
                    <h3 className="font-serif font-bold text-base">Our Mission</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {settings.mission}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[#0A2540]">
                    <Eye className="w-5 h-5 text-[#C8973E]" />
                    <h3 className="font-serif font-bold text-base">Our Vision</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {settings.vision}
                  </p>
                </div>
              </div>

              {/* Our Philosophy - client-supplied copy */}
              <div className="pt-4 space-y-3">
                <div className="inline-block text-xs font-bold text-[#C8973E] tracking-widest uppercase">
                  Our Philosophy
                </div>
                <div className="space-y-3 text-slate-600 text-base leading-relaxed">
                  <p>
                    We believe that quality service, honesty, accountability, and innovation are the foundation of long-term success. Every project — large or small — is approached with careful planning, attention to detail, and a commitment to exceeding expectations.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Founder Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
                <div className="relative h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-100">
                  <Image
                    src={resolveImageSrc(founder?.photo)}
                    alt={`${founder?.name || settings.founderName} - ${founder?.position || 'Founder & CEO'}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs text-[#DFC37C] font-semibold tracking-wider uppercase block">
                      {founder?.position || 'Founder & Chief Executive Officer'}
                    </span>
                    <h3 className="text-2xl font-serif font-bold">
                      {founder?.name || settings.founderName}
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                  <p className="italic font-serif text-[#0A2540] text-base">
                    &ldquo;Excellence isn’t an accident; it’s the result of setting high standards and honoring our word every single day.&rdquo;
                  </p>
                  <p className="text-xs">
                    Augustus Miller brings decades of multi-disciplinary management, field construction oversight, and strategic business consulting to every Miller Group endeavor.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2 text-xs">
                  <a href="tel:+17705722022" className="flex items-center gap-2 font-bold text-[#0A2540] hover:text-[#C8973E]">
                    <Phone className="w-4 h-4 text-[#C8973E]" />
                    <span>Direct Phone: +1 (770) 572-2022</span>
                  </a>
                  <a href="mailto:sgustus76@gmail.com" className="flex items-center gap-2 text-slate-600 hover:text-[#0A2540]">
                    <Mail className="w-4 h-4 text-[#C8973E]" />
                    <span>Email: sgustus76@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars (from miller services.jpg) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A2540] text-white border-t border-[#C8973E]/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-[#DFC37C] tracking-widest uppercase block mb-2">
                Guiding Principles
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-white">
                Our Four Foundational Values
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2">
                As showcased in our corporate seal, these four pillars dictate every client interaction and service delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-6 rounded-2xl bg-[#0F294A] border border-slate-700 space-y-4 hover:-translate-y-1 hover:shadow-xl hover:border-[#C8973E]/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#C8973E] text-[#0A2540] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-white">INTEGRITY</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Honest, ethical, and transparent service. We provide straightforward assessments, clear written quotes before work begins, and open communication at every milestone.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F294A] border border-slate-700 space-y-4 hover:-translate-y-1 hover:shadow-xl hover:border-[#C8973E]/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#C8973E] text-[#0A2540] flex items-center justify-center font-bold">
                  <Handshake className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-white">RELIABILITY</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Consistent, dependable, and timely delivery. When we commit to a timeline, a dispatch window, or a project scope, we follow through and keep you informed.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F294A] border border-slate-700 space-y-4 hover:-translate-y-1 hover:shadow-xl hover:border-[#C8973E]/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#C8973E] text-[#0A2540] flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-white">QUALITY</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  High standards in every project. We take pride in our workmanship, using durable materials, verified technical practices, and quality checks on every job.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F294A] border border-slate-700 space-y-4 hover:-translate-y-1 hover:shadow-xl hover:border-[#C8973E]/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-[#C8973E] text-[#0A2540] flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-white">COMMITMENT</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Dedicated to customer satisfaction and long-term relationships. We view our clients as long-term partners, and measure our success by theirs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Corporate Motto Banner */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <MillerLogo variant="mark" size="md" width={72} height={72} />
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
              Ready to Experience the Miller Group Standard?
            </h2>
            <p className="text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
              Explore our 7 service divisions or reach out to Augustus Miller directly to discuss your upcoming project.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/services"
                className="px-8 py-3.5 rounded-lg bg-[#0A2540] hover:bg-[#153a63] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                View 7 Divisions
              </Link>
              <Link
                href="/booking"
                className="px-8 py-3.5 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-wider transition-colors shadow-md shadow-[#C8973E]/20"
              >
                Book a Service
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
