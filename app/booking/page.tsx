'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
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

const servicesList = [
  { id: 'srv-1', name: 'Financial & Small Business Consultancy', icon: TrendingUp },
  { id: 'srv-2', name: 'Property Rental & Management', icon: Building },
  { id: 'srv-3', name: 'General Construction', icon: HardHat },
  { id: 'srv-4', name: 'Repairs & Maintenance', icon: Wrench },
  { id: 'srv-5', name: 'Handyman Services', icon: Hammer },
  { id: 'srv-6', name: 'Transportation Services', icon: Truck },
  { id: 'srv-7', name: 'IT Services', icon: Monitor },
  { id: 'srv-other', name: 'Multi-Division / Custom Solution', icon: ShieldCheck },
];

function BookingFormContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || '';

  const [serviceName, setServiceName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (8:00 AM - 12:00 PM)');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialService) {
      const match = servicesList.find(
        (s) => s.name.toLowerCase() === initialService.toLowerCase()
      );
      if (match) {
        setServiceName(match.name);
      } else {
        setServiceName(initialService);
      }
    } else {
      setServiceName(servicesList[0].name);
    }

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPreferredDate(tomorrow.toISOString().split('T')[0]);
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName || !email || !phone || !serviceName || !preferredDate || !address) {
      setErrorMessage('Please fill in all required fields (Name, Email, Phone, Service, Date, and Address).');
      return;
    }

    setSubmitting(true);
    try {
      const selected = servicesList.find((s) => s.name === serviceName);
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          serviceId: selected?.id || 'srv-general',
          serviceName,
          preferredDate,
          preferredTime,
          address,
          message
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking request');
      }

      setSuccessData(data.booking);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting your booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {successData ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase block">
              Request Received
            </span>
            <h1 className="text-3xl font-serif font-bold text-[#0A2540]">
              Your Booking Request Has Been Submitted
            </h1>
            <p className="text-slate-600 max-w-lg mx-auto text-sm sm:text-base">
              Thank you, <strong>{successData.customerName}</strong>. Our team has received your appointment request for <strong>{successData.serviceName}</strong>. A Miller Group coordinator will contact you at <strong>{successData.phone}</strong> to confirm scheduling.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-md mx-auto space-y-2 text-xs sm:text-sm text-slate-700">
            <p><strong>Reference ID:</strong> {successData.id}</p>
            <p><strong>Service:</strong> {successData.serviceName}</p>
            <p><strong>Preferred Date:</strong> {successData.preferredDate} ({successData.preferredTime})</p>
            <p><strong>Job Location:</strong> {successData.address}</p>
            <p><strong>Status:</strong> <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">{successData.status}</span></p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setSuccessData(null);
                setMessage('');
              }}
              className="px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Book Another Service
            </button>
            <Link
              href="/"
              className="px-6 py-3 rounded-lg bg-[#0A2540] hover:bg-[#153a63] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-xl">
          <div className="border-b border-slate-100 pb-6 mb-8 text-center sm:text-left">
            <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase block mb-1">
              Official Appointment Dispatch
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
              Book a Professional Service
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Select your service, choose your preferred timing, and tell us about your job. We will confirm with an exact appointment window and transparent pricing.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Service Selection */}
            <div>
              <label className="block text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-3">
                1. Select Desired Service Division *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {servicesList.map((svc) => {
                  const isChecked = serviceName === svc.name;
                  const Icon = svc.icon;
                  return (
                    <button
                      type="button"
                      key={svc.id}
                      onClick={() => setServiceName(svc.name)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isChecked
                          ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md ring-2 ring-[#C8973E]'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${isChecked ? 'text-[#DFC37C]' : 'text-[#C8973E]'}`} />
                        {isChecked && <CheckCircle2 className="w-4 h-4 text-[#DFC37C]" />}
                      </div>
                      <span className="text-xs font-bold leading-snug">{svc.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Date & Time Scheduling */}
            <div>
              <label className="block text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-3">
                2. Preferred Timing *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  >
                    <option>Morning (8:00 AM - 12:00 PM)</option>
                    <option>Afternoon (12:00 PM - 4:00 PM)</option>
                    <option>Evening (4:00 PM - 7:00 PM)</option>
                    <option>Flexible / Anytime</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Customer Information */}
            <div>
              <label className="block text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-3">
                3. Customer & Contact Details *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="(770) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Physical Service Address / Job Site *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Street address, city, state, and zip code"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Job Description & Details */}
            <div>
              <label className="block text-xs font-bold text-[#0A2540] uppercase tracking-wider mb-2">
                4. Job Description & Specific Instructions
              </label>
              <textarea
                rows={4}
                placeholder="Describe the issue, requested work, dimensions, timeline constraints, or any questions..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
              />
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-[#C8973E]" />
                <span>Zero obligation upfront. Transparent communication guaranteed.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#C8973E]/20 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <span>Confirm & Submit Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFC] text-slate-800 antialiased">
      <Header />
      <main className="flex-1">
        {/* Booking Hero */}
        <section className="bg-[#0A2540] text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C8973E]/20 text-center relative overflow-hidden">
          <HeroBackground
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=2070&auto=format&fit=crop"
            alt="Miller Group Dispatch & Scheduling"
            theme="dark-navy"
          />
          <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#DFC37C] uppercase">
              Official Appointment Dispatch
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-white">
              Schedule Your Service Engagement
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Select your service division, choose your preferred window, and our certified dispatch team will confirm your project scope with upfront pricing.
            </p>
          </div>
        </section>

        <Suspense fallback={<div className="text-center py-20">Loading Booking System...</div>}>
          <BookingFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
