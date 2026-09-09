'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Edit2, ExternalLink, HelpCircle, Plus, Trash2 } from 'lucide-react';
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
  { value: 'Pricing', label: 'Pricing' },
  { value: 'Service Areas', label: 'Service Areas' },
  { value: 'Repairs', label: 'Repairs' },
  { value: 'Booking', label: 'Booking' },
  { value: 'Billing', label: 'Billing' }
];

const emptyForm = {
  question: '',
  answer: '',
  category: 'General',
  displayOrder: 0,
  active: true
};

type FormState = typeof emptyForm;

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const fetchFaqs = useCallback(async () => {
    try {
      const res = await fetch('/api/faqs');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setFaqs((await res.json()) || []);
      setListError(null);
    } catch (e) {
      console.error(e);
      setListError('Could not load FAQs. Reload the page to try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const openCreate = () => {
    setEditingId(null);
    // Default to the end of the list so new entries do not jump to the top.
    const nextOrder = faqs.reduce((max, f) => Math.max(max, Number(f.displayOrder ?? 0)), 0) + 1;
    setForm({ ...emptyForm, displayOrder: nextOrder });
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (faq: any) => {
    setEditingId(faq.id);
    setForm({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'General',
      displayOrder: Number(faq.displayOrder ?? 0),
      active: faq.active !== false
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch(editingId ? `/api/faqs/${editingId}` : '/api/faqs', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setFormError(err?.error || `Save failed (HTTP ${res.status}).`);
        return;
      }

      await fetchFaqs();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Save failed. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (faq: any) => {
    if (!confirm(`Delete this FAQ?\n\n"${faq.question}"\n\nThis cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/faqs/${faq.id}`, { method: 'DELETE' });
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== faq.id));
      } else {
        setListError('Could not delete that FAQ.');
      }
    } catch (err) {
      console.error(err);
      setListError('Could not delete that FAQ.');
    }
  };

  const handleToggleActive = async (faq: any) => {
    try {
      const res = await fetch(`/api/faqs/${faq.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !faq.active })
      });
      if (res.ok) {
        setFaqs((prev) =>
          prev.map((f) => (f.id === faq.id ? { ...f, active: !faq.active } : f))
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
              Help Centre
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#0A2540] sm:text-3xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Manage the questions shown on the public FAQ page. These also feed the FAQ
              structured data Google reads.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/faq"
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
              <span>Add FAQ</span>
            </button>
          </div>
        </div>

        {listError && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <span>{listError}</span>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Loading FAQs…</div>
        ) : faqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <HelpCircle className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No FAQs yet.</p>
            <button
              onClick={openCreate}
              className="mt-3 text-xs font-bold uppercase tracking-wider text-[#C8973E] hover:underline"
            >
              Add your first question
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-[#C8973E]/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#0A2540]/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0A2540]">
                        {faq.category || 'General'}
                      </span>
                      <button
                        onClick={() => handleToggleActive(faq)}
                        title="Toggle public visibility"
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          faq.active !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {faq.active !== false ? 'Published' : 'Hidden'}
                      </button>
                      <span className="text-[11px] font-medium text-slate-400">
                        Order #{faq.displayOrder}
                      </span>
                    </div>

                    <h2 className="font-serif text-base font-bold text-[#0A2540]">
                      {faq.question}
                    </h2>
                    <p className="text-xs leading-relaxed text-slate-600">{faq.answer}</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => openEdit(faq)}
                      title="Edit FAQ"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0A2540]"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq)}
                      title="Delete FAQ"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdminModal
        open={modalOpen}
        title={editingId ? 'Edit FAQ' : 'Add New FAQ'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        submitLabel={editingId ? 'Save Changes' : 'Create FAQ'}
      >
        <TextField
          label="Question"
          required
          value={form.question}
          placeholder="e.g. Are you licensed and insured?"
          onChange={(v) => set('question', v)}
        />

        <TextArea
          label="Answer"
          required
          rows={4}
          value={form.answer}
          placeholder="Keep it direct and factual."
          onChange={(v) => set('answer', v)}
        />

        <Row>
          <SelectField
            label="Category"
            value={form.category}
            options={CATEGORY_OPTIONS}
            onChange={(v) => set('category', v)}
          />
          <NumberField
            label="Display Order"
            value={form.displayOrder}
            min={0}
            hint="Lower numbers appear first."
            onChange={(v) => set('displayOrder', v)}
          />
        </Row>

        <CheckboxField
          label="Published on the public FAQ page"
          checked={form.active}
          onChange={(v) => set('active', v)}
          hint="Uncheck to hide without deleting."
        />
      </AdminModal>
    </>
  );
}
