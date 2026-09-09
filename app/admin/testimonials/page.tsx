'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Edit2, ExternalLink, Plus, Star, Trash2 } from 'lucide-react';
import LocalImageField from '@/components/admin/LocalImageField';
import {
  AdminModal,
  CheckboxField,
  NumberField,
  Row,
  SelectField,
  TextArea,
  TextField
} from '@/components/admin/AdminForm';

const CATEGORY_OPTIONS = [
  { value: 'General', label: 'General' },
  { value: 'Financial & Business Consultancy', label: 'Financial & Business Consultancy' },
  { value: 'Property Management', label: 'Property Management' },
  { value: 'General Construction', label: 'General Construction' },
  { value: 'Repairs & Maintenance', label: 'Repairs & Maintenance' },
  { value: 'Handyman Services', label: 'Handyman Services' },
  { value: 'Transportation Services', label: 'Transportation Services' },
  { value: 'IT Services', label: 'IT Services' }
];

const emptyForm = {
  customerName: '',
  customerRole: 'Client',
  company: '',
  content: '',
  rating: 5,
  serviceCategory: 'General',
  avatarUrl: '',
  active: true
};

type FormState = typeof emptyForm;

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTestimonials((await res.json()) || []);
      setListError(null);
    } catch (e) {
      console.error(e);
      setListError('Could not load testimonials. Reload the page to try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (t: any) => {
    setEditingId(t.id);
    setForm({
      customerName: t.customerName || '',
      customerRole: t.customerRole || 'Client',
      company: t.company || '',
      content: t.content || '',
      rating: Number(t.rating ?? 5),
      serviceCategory: t.serviceCategory || 'General',
      avatarUrl: t.avatarUrl || '',
      active: t.active !== false
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const rating = Math.min(5, Math.max(1, Number(form.rating) || 5));

    try {
      const res = await fetch(
        editingId ? `/api/testimonials/${editingId}` : '/api/testimonials',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, rating })
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setFormError(err?.error || `Save failed (HTTP ${res.status}).`);
        return;
      }

      await fetchTestimonials();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Save failed. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (t: any) => {
    if (!confirm(`Delete the testimonial from "${t.customerName}"?\n\nThis cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/testimonials/${t.id}`, { method: 'DELETE' });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((x) => x.id !== t.id));
      } else {
        setListError('Could not delete that testimonial.');
      }
    } catch (err) {
      console.error(err);
      setListError('Could not delete that testimonial.');
    }
  };

  const handleToggleActive = async (t: any) => {
    try {
      const res = await fetch(`/api/testimonials/${t.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !t.active })
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((x) => (x.id === t.id ? { ...x, active: !t.active } : x))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="block text-xs font-bold uppercase tracking-widest text-[#C8973E]">
              Social Proof &amp; Reviews
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#0A2540] sm:text-3xl">
              Client Testimonials
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Manage the quotes shown on the homepage and testimonials page.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/testimonials"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0A2540] transition-colors hover:border-[#C8973E]"
            >
              <span>Preview</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-[#C8973E] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0A2540] shadow-sm transition-colors hover:bg-[#D4A244]"
            >
              <Plus className="h-4 w-4" />
              <span>Add Testimonial</span>
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <span>
            Only publish reviews a real client actually gave you and agreed you could use.
            Invented names or quotes are a legal risk under FTC endorsement rules.
          </span>
        </div>

        {listError && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <span>{listError}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Loading testimonials…</div>
        ) : testimonials.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Star className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No testimonials yet.</p>
            <button
              onClick={openCreate}
              className="mt-3 text-xs font-bold uppercase tracking-wider text-[#C8973E] hover:underline"
            >
              Add your first testimonial
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-[#C8973E]/60"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5 text-[#C8973E]">
                      {Array.from({ length: Math.max(0, Math.min(5, t.rating || 0)) }).map(
                        (_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-[#C8973E]" />
                        )
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleActive(t)}
                      title="Toggle public visibility"
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        t.active !== false
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {t.active !== false ? 'Published' : 'Hidden'}
                    </button>
                  </div>

                  <p className="text-xs italic leading-relaxed text-slate-700">
                    &ldquo;{t.content}&rdquo;
                  </p>

                  <div className="border-t border-slate-100 pt-3">
                    <span className="block font-serif text-sm font-bold text-[#0A2540]">
                      {t.customerName}
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      {t.customerRole}
                      {t.company ? ` • ${t.company}` : ''}
                    </span>
                    <span className="mt-1.5 inline-block rounded-full bg-[#0A2540]/5 px-2 py-0.5 text-[10px] font-semibold text-[#C8973E]">
                      {t.serviceCategory}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 border-t border-slate-100 pt-3">
                  <button
                    onClick={() => openEdit(t)}
                    title="Edit testimonial"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0A2540]"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    title="Delete testimonial"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminModal
        open={modalOpen}
        title={editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        submitLabel={editingId ? 'Save Changes' : 'Create Testimonial'}
      >
        <TextArea
          label="Testimonial"
          required
          rows={4}
          value={form.content}
          placeholder="The client's own words."
          onChange={(v) => set('content', v)}
        />

        <Row>
          <TextField
            label="Client Name"
            required
            value={form.customerName}
            placeholder="e.g. Residential Client"
            hint="Use a generic label if the client prefers to stay anonymous."
            onChange={(v) => set('customerName', v)}
          />
          <TextField
            label="Role"
            value={form.customerRole}
            placeholder="e.g. Homeowner"
            onChange={(v) => set('customerRole', v)}
          />
        </Row>

        <Row>
          <TextField
            label="Company"
            value={form.company}
            placeholder="Leave blank if not applicable"
            onChange={(v) => set('company', v)}
          />
          <NumberField
            label="Rating (1-5)"
            value={form.rating}
            min={1}
            onChange={(v) => set('rating', v)}
          />
        </Row>

        <SelectField
          label="Service Category"
          value={form.serviceCategory}
          options={CATEGORY_OPTIONS}
          onChange={(v) => set('serviceCategory', v)}
        />

        <LocalImageField
          label="Client Photo (optional)"
          folder="misc"
          value={form.avatarUrl}
          onChange={(url) => set('avatarUrl', url)}
          helpText="Only use a photo the client has given you permission to publish."
        />

        <CheckboxField
          label="Published on the public site"
          checked={form.active}
          onChange={(v) => set('active', v)}
          hint="Uncheck to hide without deleting."
        />
      </AdminModal>
    </>
  );
}
