'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MessageSquare,
  Wrench,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/bookings').then((r) => r.ok ? r.json() : []),
      fetch('/api/messages').then((r) => r.ok ? r.json() : []),
      fetch('/api/services').then((r) => r.ok ? r.json() : [])
    ]).then(([bData, mData, sData]) => {
      setBookings(bData || []);
      setMessages(mData || []);
      setServices(sData || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const pendingBookings = bookings.filter((b) => b.status === 'Pending').length;
  const unreadMessages = messages.filter((m) => m.status === 'Unread').length;

  return (
    <>
      <div className="space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase block">
              Miller Group Control Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
              Operational Dashboard
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Real-time monitoring across all 7 service divisions, customer bookings, and inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/bookings"
              className="px-4 py-2.5 rounded-lg bg-[#0A2540] hover:bg-[#163a62] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              Manage Bookings
            </Link>
            <Link
              href="/booking"
              target="_blank"
              className="px-4 py-2.5 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              + New Client Request
            </Link>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Bookings</span>
              <Calendar className="w-5 h-5 text-[#C8973E]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#0A2540]">
              {bookings.length}
            </p>
            <span className="text-xs text-amber-600 font-semibold block">
              {pendingBookings} pending confirmation
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Client Inquiries</span>
              <MessageSquare className="w-5 h-5 text-[#0A2540]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#0A2540]">
              {messages.length}
            </p>
            <span className="text-xs text-blue-600 font-semibold block">
              {unreadMessages} new unread
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Divisions</span>
              <Wrench className="w-5 h-5 text-[#C8973E]" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#0A2540]">
              {services.length || 7}
            </p>
            <span className="text-xs text-emerald-600 font-semibold block">
              All 7 divisions operational
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Service Coverage</span>
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-serif font-bold text-[#0A2540]">
              Statewide
            </p>
            <span className="text-xs text-slate-500 font-medium block">
              Georgia + National Consulting
            </span>
          </div>
        </div>

        {/* Split Grid: Recent Bookings & Recent Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Service Bookings */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">
                Recent Service Bookings
              </h2>
              <Link
                href="/admin/bookings"
                className="text-xs font-bold text-[#C8973E] hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-4">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No bookings received yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">
                        {b.customerName}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {b.serviceName} • {b.preferredDate}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Contact Inquiries */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">
                Recent Inquiries & Quotes
              </h2>
              <Link
                href="/admin/messages"
                className="text-xs font-bold text-[#C8973E] hover:underline"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <p className="text-xs text-slate-400 py-4">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No inquiries received yet.</p>
            ) : (
              <div className="space-y-3">
                {messages.slice(0, 5).map((m) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="max-w-[70%]">
                      <span className="font-bold text-slate-900 block text-sm">
                        {m.name}
                      </span>
                      <p className="text-slate-500 truncate">
                        {m.message}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        m.status === 'Unread'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 7 Divisions Quick Status Bar */}
        <div className="bg-[#0A2540] text-white rounded-2xl p-6 sm:p-8 border border-[#C8973E]/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#DFC37C] tracking-widest uppercase block">
                Division Status
              </span>
              <h3 className="font-serif font-bold text-xl text-white">
                All 7 Core Business Divisions
              </h3>
            </div>
            <Link
              href="/admin/services"
              className="text-xs font-bold text-[#DFC37C] hover:underline"
            >
              Configure Details →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {services.slice(0, 7).map((s, idx) => (
              <div
                key={s.id}
                className="p-3 rounded-xl bg-[#0F294A] border border-slate-700 flex items-center justify-between text-xs"
              >
                <div className="truncate mr-2">
                  <span className="text-[10px] text-[#DFC37C] block font-mono">0{idx + 1}</span>
                  <span className="font-bold truncate block">{s.name}</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Active" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
