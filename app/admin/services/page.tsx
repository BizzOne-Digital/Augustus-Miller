'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  CheckCircle2,
  Edit2,
  ExternalLink,
  Plus,
  TrendingUp,
  Building,
  HardHat,
  Hammer,
  Truck,
  Monitor
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !current })
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === id ? { ...s, active: !current } : s))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase block">
              Core Operations
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
              The 7 Business Divisions
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Configure division slogans, included trade capabilities, and public visibility.
            </p>
          </div>

          <Link
            href="/services"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0A2540] hover:bg-[#153a63] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <span>Preview Public Services</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Services Cards */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Loading divisions...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => (
              <div
                key={svc.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C8973E] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase">
                      Division 0{idx + 1}
                    </span>
                    <button
                      onClick={() => handleToggleActive(svc.id, svc.active)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        svc.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {svc.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <h2 className="font-serif font-bold text-lg text-[#0A2540] leading-snug">
                    {svc.name}
                  </h2>

                  {svc.divisionSlogan && (
                    <p className="font-serif italic text-xs text-[#C8973E] font-medium">
                      &ldquo;{svc.divisionSlogan}&rdquo;
                    </p>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {svc.shortDescription}
                  </p>

                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Included Scopes ({svc.includedServices?.length || 0}):
                    </span>
                    {svc.includedServices?.slice(0, 3).map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3 h-3 text-[#C8973E] shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <Link
                    href={`/services/${svc.slug}`}
                    target="_blank"
                    className="text-[#0A2540] hover:text-[#C8973E] inline-flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <span className="text-slate-400 text-[11px]">
                    Order: #{svc.displayOrder}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
