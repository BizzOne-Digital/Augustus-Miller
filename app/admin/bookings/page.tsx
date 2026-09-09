'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Trash2,
  CheckCircle2,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking record?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      b.customerName?.toLowerCase().includes(term) ||
      b.phone?.toLowerCase().includes(term) ||
      b.serviceName?.toLowerCase().includes(term) ||
      b.address?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase block">
              Dispatch & Scheduling
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
              Customer Service Bookings
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage incoming service appointments, customer site addresses, and dispatch progress.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#0A2540] shadow-sm">
              Total: {bookings.length}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, phone, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? 'bg-[#0A2540] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Loading bookings...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-2">
            <p className="font-serif font-bold text-lg text-[#0A2540]">No Bookings Found</p>
            <p className="text-xs text-slate-500">Try adjusting your search terms or filter selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-[#C8973E] transition-colors"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-serif font-bold text-lg text-[#0A2540]">
                      {b.customerName}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0A2540]/10 text-[#0A2540] text-xs font-semibold">
                      {b.serviceName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Ref: {b.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C8973E] shrink-0" />
                      <span>{b.preferredDate} ({b.preferredTime})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#C8973E] shrink-0" />
                      <a href={`tel:${b.phone}`} className="font-semibold text-[#0A2540] hover:underline">
                        {b.phone}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#C8973E] shrink-0" />
                      <a href={`mailto:${b.email}`} className="text-slate-600 hover:underline">
                        {b.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-3">
                      <MapPin className="w-3.5 h-3.5 text-[#C8973E] shrink-0" />
                      <span className="font-medium text-slate-800">{b.address}</span>
                    </div>
                  </div>

                  {b.message && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 italic">
                      &ldquo;{b.message}&rdquo;
                    </div>
                  )}
                </div>

                {/* Status selector & actions */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-xs">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 lg:text-right">
                      Update Status:
                    </label>
                    <select
                      value={b.status}
                      disabled={updatingId === b.id}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleDelete(b.id)}
                    title="Delete booking"
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
