'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import HeroBackground from '@/components/site/HeroBackground';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('General Inquiry');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (serviceParam) {
      setService(serviceParam);
    }
  }, [serviceParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !message) {
      setError('Please provide your name, email, phone number, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          service,
          preferredDate,
          message
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending your message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Contact Info & Brand Credibility */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase block mb-2">
              Corporate Office & Dispatch
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-extrabold text-[#0A2540]">
              Get in Touch with Miller Group
            </h1>
            <p className="text-slate-600 text-base mt-3 leading-relaxed">
              Have a question about one of our 7 service divisions? Need an upfront project quote or emergency repair estimate? Reach out directly.
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="space-y-4">
            <a
              href="tel:+17705722022"
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover:border-[#C8973E] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A2540] text-[#DFC37C] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Direct Telephone
                </span>
                <span className="text-lg font-bold text-[#0A2540] group-hover:text-[#C8973E] transition-colors">
                  +1 (770) 572-2022
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Mon - Sat: 8:00 AM - 6:00 PM EST</p>
              </div>
            </a>

            <a
              href="mailto:sgustus76@gmail.com"
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover:border-[#C8973E] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0A2540] text-[#DFC37C] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Email Correspondence
                </span>
                <span className="text-base font-bold text-[#0A2540] group-hover:text-[#C8973E] transition-colors">
                  sgustus76@gmail.com
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Replies typically within 24 hours</p>
              </div>
            </a>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-4 hover:shadow-lg hover:-translate-y-1 hover:border-[#C8973E]/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[#0A2540] text-[#DFC37C] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Service Area
                </span>
                <span className="text-base font-bold text-[#0A2540]">
                  Statewide Georgia & Metro Atlanta
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fulton, Gwinnett, Cobb, DeKalb, Clayton, and surrounding counties
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A2540] text-white border border-[#C8973E]/30 space-y-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-2 text-[#DFC37C]">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Emergency Dispatches</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Critical plumbing, electrical, and urgent repair calls receive priority routing based on technician availability.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#0A2540]">
                  Message Successfully Sent!
                </h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Thank you for contacting Miller Group of Company LLC. Our team has received your message and will get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-4 px-6 py-2.5 rounded-lg bg-[#0A2540] text-white font-bold text-xs uppercase tracking-wider"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#0A2540] mb-1">
                    Send Us an Inquiry or Request a Quote
                  </h2>
                  <p className="text-xs text-slate-500">
                    Fill out the form below and an expert from the corresponding division will respond promptly.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Augustus Miller"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(770) 572-2022"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Service Needed
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Financial & Small Business Consultancy">1. Financial & Business Consultancy</option>
                      <option value="Property Rental & Management">2. Property Rental & Management</option>
                      <option value="General Construction">3. General Construction</option>
                      <option value="Repairs & Maintenance">4. Repairs & Maintenance</option>
                      <option value="Handyman Services">5. Handyman Services</option>
                      <option value="Transportation Services">6. Transportation Services</option>
                      <option value="IT Services">7. IT Services</option>
                      <option value="Multi-Service Partnership">Multi-Service Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Optional. Tell us when you would like the work to start and we will confirm availability.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Message / Project Details *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about what you need, your project timeline, address or location..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-[#C8973E]" />
                    <span>Your information is kept strictly private.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
                  >
                    {submitting ? 'Sending...' : 'Send Inquiry'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      <Header />
      <main className="flex-1">
        {/* Contact Hero */}
        <section className="bg-[#0A2540] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C8973E]/20 text-center relative overflow-hidden">
          <HeroBackground
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop"
            alt="Miller Group Communications & Dispatch"
            theme="dark-navy"
          />
          <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#DFC37C] uppercase">
              Corporate Office & Direct Dispatch
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white">
              Get in Touch with Miller Group
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Have a question about one of our 7 service divisions? Need an upfront project quote or emergency repair estimate? Reach out directly.
            </p>
          </div>
        </section>

        <Suspense fallback={<div className="text-center py-20">Loading Contact...</div>}>
          <ContactFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
