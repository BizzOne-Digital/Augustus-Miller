import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import HeroBackground from '@/components/site/HeroBackground';
import { getTeam } from '@/lib/db/db';

export const metadata = {
  title: 'Leadership & Team | Miller Group of Company LLC',
  description: 'Meet Augustus Miller and the executive leadership team behind Miller Group of Company LLC.'
};

export default async function TeamPage() {
  const team = await getTeam();

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      <Header />

      <main className="flex-1">
        {/* Team Hero */}
        <section className="bg-[#0A2540] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C8973E]/20 text-center relative overflow-hidden">
          <HeroBackground
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
            alt="Miller Group Leadership Team"
            theme="dark-navy"
          />
          <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#DFC37C] uppercase">
              Corporate Governance & Management
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white">
              Leadership Committed to Excellence
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Guided by founder Augustus Miller, our leadership combines seasoned strategic acumen with hands-on trade mastery across all seven divisions.
            </p>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#C8973E]/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-72 w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover object-top hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540] via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <span className="text-xs font-bold text-[#DFC37C] tracking-wider uppercase block">
                          {member.position}
                        </span>
                        <h2 className="text-xl font-serif font-bold text-white">
                          {member.name}
                        </h2>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {member.bio}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    {member.phone && (
                      <a href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-1.5 hover:text-[#0A2540]">
                        <Phone className="w-3.5 h-3.5 text-[#C8973E]" />
                        <span>{member.phone}</span>
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center gap-1.5 hover:text-[#0A2540]">
                        <Mail className="w-3.5 h-3.5 text-[#C8973E]" />
                        <span>Contact</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Join Our Team Card */}
            <div className="mt-16 bg-[#0B213B] rounded-3xl p-8 sm:p-12 text-white border border-[#C8973E]/30 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 max-w-xl text-center md:text-left">
                <span className="text-xs font-bold text-[#DFC37C] tracking-widest uppercase">
                  Careers at Miller Group
                </span>
                <h3 className="text-2xl font-serif font-bold text-white">
                  Join Our Multi-Disciplinary Team
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  We are always seeking licensed tradesmen, certified IT technicians, and experienced business consultants to uphold our high service standards.
                </p>
              </div>

              <Link
                href="/contact?service=Careers"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#C8973E]/20 shrink-0"
              >
                <span>Submit Your Resume</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
