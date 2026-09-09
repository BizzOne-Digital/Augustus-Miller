'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Trash2,
  CheckCircle2,
  Calendar,
  Search
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = messages.filter((m) => {
    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      m.name?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.phone?.toLowerCase().includes(term) ||
      m.message?.toLowerCase().includes(term) ||
      m.service?.toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase block">
              Inbound Communications
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
              Customer Inquiries & Quotes
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Review and reply to leads, project estimates, and general customer messages.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#0A2540] shadow-sm">
            Total Messages: {messages.length}
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search messages by name, email, keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['All', 'Unread', 'Read', 'Replied', 'Archived'].map((status) => (
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

        {/* Messages List */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Loading messages...
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-2">
            <p className="font-serif font-bold text-lg text-[#0A2540]">No Messages Found</p>
            <p className="text-xs text-slate-500">No inquiry matches the active filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((m) => (
              <div
                key={m.id}
                className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between gap-4 transition-colors ${
                  m.status === 'Unread'
                    ? 'border-blue-300 ring-1 ring-blue-100 bg-blue-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-serif font-bold text-base text-[#0A2540]">
                      {m.name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#0A2540]/10 text-[#0A2540] text-xs font-semibold">
                      {m.service}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {m.message}
                </p>

                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href={`tel:${m.phone}`}
                      className="flex items-center gap-1.5 font-bold text-[#0A2540] hover:text-[#C8973E]"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C8973E]" />
                      <span>{m.phone}</span>
                    </a>
                    <a
                      href={`mailto:${m.email}?subject=RE: Miller Group Inquiry - ${encodeURIComponent(m.service)}`}
                      className="flex items-center gap-1.5 text-slate-600 hover:text-[#0A2540]"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#C8973E]" />
                      <span>{m.email}</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={m.status}
                      onChange={(e) => handleStatusChange(m.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value="Unread">Unread</option>
                      <option value="Read">Read</option>
                      <option value="Replied">Replied</option>
                      <option value="Archived">Archived</option>
                    </select>

                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
