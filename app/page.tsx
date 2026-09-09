import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Award,
  Handshake,
  Users,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Briefcase,
  ChevronRight,
  Star
} from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import MillerLogo from '@/components/site/MillerLogo';
import InteractiveServicesWheel from '@/components/site/InteractiveServicesWheel';
import HeroMotion from '@/components/site/HeroMotion';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/site/ScrollReveal';
import { getTestimonials, getSiteSettings, getServices } from '@/lib/db/db';
import {
  TrendingUp,
  Building,
  HardHat,
  Wrench,
  Hammer,
  Truck,
  Monitor
} from 'lucide-react';
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, generatePageMetadata } from '@/lib/seo';
import { resolveImageSrc } from '@/lib/images';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('home', DEFAULT_LOCALE, '/');
}

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Building,
  HardHat,
  Wrench,
  Hammer,
  Truck,
  Monitor
};

export default async function HomePage() {
  const testimonials = await getTestimonials();
  const settings = await getSiteSettings();
  const services = await getServices();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased selection:bg-[#C8973E]/20 selection:text-[#0A2540]">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <HeroMotion />

        {/* TRUST / CREDIBILITY BAR */}
        <section className="bg-white border-b border-slate-200/80 py-7 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <StaggerContainer
            staggerDelay={0.09}
            className="max-w-7xl mx-auto flex flex-wrap items-center justify-around gap-6 text-slate-700 text-sm"
          >
            <StaggerItem direction="right" distance={30} className="flex items-center gap-3.5 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#0A2540]/5 flex items-center justify-center text-[#0A2540] transition-all duration-300 group-hover:bg-[#C8973E]/15 group-hover:scale-105">
                <ShieldCheck className="w-5 h-5 text-[#C8973E] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider transition-colors duration-200 group-hover:text-[#0A2540]">Integrity</span>
                <span className="text-xs text-slate-500">Honest, ethical, and transparent service</span>
              </div>
            </StaggerItem>

            <StaggerItem direction="right" distance={30} className="flex items-center gap-3.5 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#0A2540]/5 flex items-center justify-center text-[#0A2540] transition-all duration-300 group-hover:bg-[#C8973E]/15 group-hover:scale-105">
                <Handshake className="w-5 h-5 text-[#C8973E] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider transition-colors duration-200 group-hover:text-[#0A2540]">Reliability</span>
                <span className="text-xs text-slate-500">Consistent, dependable, and timely delivery</span>
              </div>
            </StaggerItem>

            <StaggerItem direction="right" distance={30} className="flex items-center gap-3.5 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#0A2540]/5 flex items-center justify-center text-[#0A2540] transition-all duration-300 group-hover:bg-[#C8973E]/15 group-hover:scale-105">
                <Award className="w-5 h-5 text-[#C8973E] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider transition-colors duration-200 group-hover:text-[#0A2540]">Quality</span>
                <span className="text-xs text-slate-500">High standards in every project</span>
              </div>
            </StaggerItem>

            <StaggerItem direction="right" distance={30} className="flex items-center gap-3.5 group cursor-default">
              <div className="w-10 h-10 rounded-xl bg-[#0A2540]/5 flex items-center justify-center text-[#0A2540] transition-all duration-300 group-hover:bg-[#C8973E]/15 group-hover:scale-105">
                <Users className="w-5 h-5 text-[#C8973E] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider transition-colors duration-200 group-hover:text-[#0A2540]">Commitment</span>
                <span className="text-xs text-slate-500">Customer satisfaction and long-term relationships</span>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </section>

        {/* 02. INTERACTIVE 7 SERVICES SHOWCASE (Direct recreation of miller services.jpg) */}
        <section id="services-showcase">
          <InteractiveServicesWheel />
        </section>

        {/* 03. COMPANY OVERVIEW (Editorial Section) */}
        <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              {/* Left: Founder Narrative */}
              <ScrollReveal direction="up" delay={0.05} className="lg:col-span-7 space-y-6">
                <div className="inline-block text-[11px] font-bold tracking-[0.2em] text-[#C8973E] uppercase">
                  Company Overview
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540] tracking-tight leading-tight">
                  Your One-Stop Partner for Dependable, Customer-Focused Solutions.
                </h2>
                <div className="space-y-4 text-slate-600 text-base sm:text-[17px] leading-[1.7]">
                  <p>
                    <strong className="text-slate-900 font-semibold">Miller Group of Company LLC</strong> is your one-stop partner for dependable, professional, and customer focused services. We combine technical expertise, business knowledge, and hands on experience to deliver solutions that help individuals, businesses, and communities grow.
                  </p>
                  <p>
                    Whether assisting a growing startup with financial budgeting, remodeling a commercial facility, screening tenants for an investor, fixing urgent residential plumbing, or managing regional cargo transport — our clients deal with a single, highly accountable leadership team.
                  </p>
                </div>

                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 shadow-[0_2px_8px_rgba(10,37,64,0.02)]">
                    <span className="font-serif font-bold text-base text-[#0A2540] block mb-1.5">Our Mission</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {settings.mission}
                    </p>
                  </div>
                  <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200/80 shadow-[0_2px_8px_rgba(10,37,64,0.02)]">
                    <span className="font-serif font-bold text-base text-[#0A2540] block mb-1.5">Our Vision</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {settings.vision}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-[0.08em] text-[#0A2540] hover:text-[#C8973E] transition-colors group"
                  >
                    <span>Read Our Full Story & Philosophy</span>
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </ScrollReveal>

              {/* Right: Founder Profile Card */}
              <ScrollReveal direction="up" delay={0.15} className="lg:col-span-5">
                <div className="bg-[#0A2540] text-white rounded-2xl p-7 sm:p-8 shadow-xl border border-[#C8973E]/35 relative overflow-hidden">
                  <div className="relative h-72 w-full rounded-xl overflow-hidden mb-6 border border-slate-700/80">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
                      alt="Augustus Miller - Founder & CEO"
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#DFC37C] tracking-[0.2em] uppercase block mb-1">
                    Leadership
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white">Augustus Miller</h3>
                  <p className="text-sm text-slate-300 font-medium mb-3">Founder & Chief Executive Officer</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 italic">
                    &ldquo;Our commitment is simple: treat every client’s property, business, and timeline with the respect and precision we would expect ourselves.&rdquo;
                  </p>

                  <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-300">
                    <a href="tel:+17705722022" className="flex items-center gap-1.5 hover:text-[#DFC37C] transition-colors">
                      <Phone className="w-3.5 h-3.5 text-[#C8973E]" />
                      <span>+1 (770) 572-2022</span>
                    </a>
                    <Link href="/team" className="font-bold text-[#DFC37C] hover:underline uppercase tracking-wider text-[11px]">
                      View Profile →
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 04. DETAILED SERVICES DIRECTORY (Cards Grid) */}
        <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#F4F6F9] border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-[11px] font-bold text-[#C8973E] tracking-[0.2em] uppercase block mb-2">
                Comprehensive Division Directory
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540]">
                Explore Our Complete Service Capabilities
              </h2>
              <p className="text-slate-600 text-base sm:text-[17px] mt-3 leading-relaxed">
                Click into any of our seven core divisions to learn about included scopes, client benefits, standard processes, and to request a tailored quote.
              </p>
            </ScrollReveal>

            <StaggerContainer staggerDelay={0.07} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((svc, idx) => {
                const Icon = iconMap[svc.iconName] || Wrench;
                return (
                  <StaggerItem key={svc.id}>
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_16px_rgba(10,37,64,0.03)] hover:shadow-[0_16px_36px_rgba(10,37,64,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group hover:border-[#C8973E]/60 h-full">
                      {/* Image Header */}
                      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                        <Image
                          src={resolveImageSrc(svc.heroImage)}
                          alt={svc.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#061426]/90 via-[#061426]/30 to-transparent" />
                        <div className="absolute top-3 left-3 bg-[#0A2540]/90 border border-[#C8973E]/40 text-[#DFC37C] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                          Division 0{idx + 1}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[11px] font-serif italic text-[#DFC37C] block">
                            &ldquo;{svc.divisionSlogan}&rdquo;
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#0A2540] text-[#DFC37C] flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4" />
                            </div>
                            <h3 className="font-serif font-bold text-lg text-[#0A2540] group-hover:text-[#C8973E] transition-colors leading-tight">
                              {svc.name}
                            </h3>
                          </div>

                          <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                            {svc.shortDescription}
                          </p>

                          <div className="space-y-1.5 border-t border-slate-100 pt-3">
                            {svc.includedServices?.slice(0, 3).map((item, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#C8973E] shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <Link
                            href={`/services/${svc.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A2540] hover:text-[#C8973E] transition-colors uppercase tracking-wider group-hover:translate-x-0.5 transition-transform"
                          >
                            <span>Learn More</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                          <Link
                            href={`/booking?service=${encodeURIComponent(svc.name)}`}
                            className="text-xs font-bold text-[#C8973E] hover:underline uppercase tracking-wider text-[11px]"
                          >
                            Book Service →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}

              {/* 8th Card: Custom Multi-Service Consultation */}
              <StaggerItem>
                <div className="bg-[#0A2540] text-white rounded-2xl p-7 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between border border-[#C8973E]/40 relative overflow-hidden h-full transition-all duration-300 group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#C8973E]/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="space-y-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-[#C8973E] text-[#0A2540] flex items-center justify-center font-bold shadow-md shadow-[#C8973E]/20">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#DFC37C] tracking-[0.2em] uppercase block">
                      Integrated Solutions
                    </span>
                    <h3 className="font-serif font-bold text-2xl text-white leading-tight">
                      Need Multiple Services for Your Property or Business?
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Combine property management, preventative repairs, IT maintenance, and business consultancy under one customized corporate contract.
                    </p>
                  </div>

                  <div className="pt-6 relative z-10">
                    <Link
                      href="/contact"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-[0.08em] transition-colors shadow-md active:scale-[0.98]"
                    >
                      <span>Request Custom Proposal</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* 05. HOW WE WORK (4-Step Workflow) */}
        <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[11px] font-bold text-[#C8973E] tracking-[0.2em] uppercase block mb-2">
                Operational Excellence
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540]">
                How Miller Group Delivers Results
              </h2>
              <p className="text-slate-600 text-base sm:text-[17px] mt-3 leading-relaxed">
                A structured, disciplined approach ensuring transparency, safety, and satisfaction on every single engagement.
              </p>
            </ScrollReveal>

            <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <StaggerItem>
                <div className="p-6 sm:p-7 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 relative space-y-4 hover:bg-white hover:border-[#C8973E]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#C8973E] tracking-tight block">01</span>
                  <h3 className="font-serif font-bold text-lg text-[#0A2540]">Discovery & Request</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Submit your request online or connect directly with our dispatch team to define your project requirements.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 sm:p-7 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 relative space-y-4 hover:bg-white hover:border-[#C8973E]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#C8973E] tracking-tight block">02</span>
                  <h3 className="font-serif font-bold text-lg text-[#0A2540]">Upfront Quote</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We present a transparent scope of work, timeline, and clear cost estimate with zero unexpected fees.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 sm:p-7 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 relative space-y-4 hover:bg-white hover:border-[#C8973E]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#C8973E] tracking-tight block">03</span>
                  <h3 className="font-serif font-bold text-lg text-[#0A2540]">Skilled Execution</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our tradesmen and consultants execute the scope with high safety standards and active supervisory checks.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 sm:p-7 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 relative space-y-4 hover:bg-white hover:border-[#C8973E]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#C8973E] tracking-tight block">04</span>
                  <h3 className="font-serif font-bold text-lg text-[#0A2540]">Quality Assurance</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    We conduct a comprehensive final walkthrough or review to ensure complete client satisfaction and long-term value.
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* 06. AUDIENCE & INDUSTRIES SERVED */}
        <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-[#061426] text-white border-b border-[#C8973E]/20">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-[11px] font-bold text-[#DFC37C] tracking-[0.2em] uppercase block mb-2">
                Who We Serve
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Tailored Solutions for Diverse Client Needs
              </h2>
            </ScrollReveal>

            <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StaggerItem>
                <div className="p-6 sm:p-7 rounded-2xl bg-[#0B213B] border border-slate-800 hover:border-[#C8973E]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 space-y-3 h-full">
                  <h3 className="font-serif font-bold text-lg text-[#DFC37C]">Property Owners & Landlords</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    End-to-end tenant placement, continuous maintenance oversight, and property value preservation.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 sm:p-7 rounded-2xl bg-[#0B213B] border border-slate-800 hover:border-[#C8973E]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 space-y-3 h-full">
                  <h3 className="font-serif font-bold text-lg text-[#DFC37C]">Small Businesses & Startups</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Financial budgeting, strategic roadmaps, website development, and IT infrastructure management.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 sm:p-7 rounded-2xl bg-[#0B213B] border border-slate-800 hover:border-[#C8973E]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 space-y-3 h-full">
                  <h3 className="font-serif font-bold text-lg text-[#DFC37C]">Homeowners & Residents</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Prompt plumbing & electrical repairs, TV mounting, pressure washing, and handyman punch-lists.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 sm:p-7 rounded-2xl bg-[#0B213B] border border-slate-800 hover:border-[#C8973E]/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 space-y-3 h-full">
                  <h3 className="font-serif font-bold text-lg text-[#DFC37C]">Commercial Enterprises</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    General construction remodeling, regional freight transport, and preventative facility maintenance.
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* 07. TESTIMONIALS SECTION */}
        <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-[11px] font-bold text-[#C8973E] tracking-[0.2em] uppercase block mb-2">
                Client Testimonials
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0A2540]">
                Trusted by Businesses & Homeowners Across Georgia
              </h2>
            </ScrollReveal>

            <StaggerContainer staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test) => (
                <StaggerItem key={test.id}>
                  <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-7 sm:p-8 flex flex-col justify-between space-y-6 relative hover:border-[#C8973E]/50 hover:bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#C8973E] text-[#C8973E]" />
                        ))}
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed italic">
                        &ldquo;{test.content}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/80">
                      <span className="font-serif font-bold text-[#0A2540] text-sm block">
                        {test.customerName}
                      </span>
                      <span className="text-xs text-slate-500 block mt-0.5">
                        {test.customerRole} {test.company ? `• ${test.company}` : ''}
                      </span>
                      <span className="text-[11px] text-[#C8973E] font-medium block mt-1">
                        Service: {test.serviceCategory}
                      </span>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <div className="mt-10 text-center">
              <Link
                href="/testimonials"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0A2540] hover:text-[#C8973E] uppercase tracking-wider group"
              >
                <span>Read More Client Stories</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 08. FINAL CALL TO ACTION (Booking / Consultation) */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#061426] text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#DFC37C_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
          <ScrollReveal direction="up" className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
            <span className="text-[#DFC37C] text-[11px] font-bold tracking-[0.2em] uppercase">
              Ready to Work with a Dependable Multi-Service Partner?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
              Let&apos;s Build Solutions and Deliver Lasting Value Together.
            </h2>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Contact Augustus Miller and the team today for a free consultation, upfront estimate, or emergency repair dispatch.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/booking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-[0.08em] transition-all shadow-xl shadow-black/30 active:scale-[0.98]"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Service Online</span>
              </Link>
              <a
                href="tel:+17705722022"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-slate-500/70 hover:border-slate-300 font-bold text-xs uppercase tracking-[0.08em] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#DFC37C]" />
                <span>Call +1 (770) 572-2022</span>
              </a>
            </div>

            <div className="pt-6 text-xs text-slate-400">
              <span>Service Area: Metro Atlanta • Surrounding Counties • Statewide Georgia • Nationwide Consulting</span>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}
