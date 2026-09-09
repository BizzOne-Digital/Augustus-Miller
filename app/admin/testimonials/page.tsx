'use client';

import React, { useState, useEffect } from 'react';
import { Star, Plus, Trash2, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerRole, setCustomerRole] = useState('Client');
  const [company, setCompany] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Property Management');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState('5');
  const [submitting, setSubmitting] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !content) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerRole,
          company,
          serviceCategory,
          content,
          rating: parseInt(rating)
        })
      });

      if (res.ok) {
        const created = await res.json();
        setTestimonials((prev) => [created, ...prev]);
        setShowAddModal(false);
        setCustomerName('');
        setContent('');
        setCompany('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase block">
              Social Proof & Reviews
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
              Client Testimonials
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage client feedback and quotes displayed across the homepage and review page.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Loading testimonials...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-[#C8973E]">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#C8973E]" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {t.serviceCategory}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    &ldquo;{t.content}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#0A2540] block">{t.customerName}</span>
                    <span className="text-slate-400 text-[10px]">{t.customerRole} {t.company ? `• ${t.company}` : ''}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                  Add Client Testimonial
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTestimonial} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Reynolds"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Portfolio Owner"
                      value={customerRole}
                      onChange={(e) => setCustomerRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Reynolds Holdings"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Division
                    </label>
                    <select
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    >
                      <option value="Property Management">Property Management</option>
                      <option value="General Construction">General Construction</option>
                      <option value="Financial Consulting">Financial Consulting</option>
                      <option value="Repairs & Maintenance">Repairs & Maintenance</option>
                      <option value="Handyman Services">Handyman Services</option>
                      <option value="Transportation">Transportation</option>
                      <option value="IT Services">IT Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Review / Testimonial Text *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter what the client said..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold uppercase tracking-wider"
                  >
                    {submitting ? 'Saving...' : 'Add Testimonial'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
