'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Edit2,
  ExternalLink,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';
import LocalImageField from '@/components/admin/LocalImageField';
import {
  AdminModal,
  CheckboxField,
  NumberField,
  Row,
  SelectField,
  StringListField,
  TextArea,
  TextField,
  slugify
} from '@/components/admin/AdminForm';

const ICON_OPTIONS = [
  { value: 'TrendingUp', label: 'TrendingUp (consulting)' },
  { value: 'Building', label: 'Building (property)' },
  { value: 'HardHat', label: 'HardHat (construction)' },
  { value: 'Wrench', label: 'Wrench (repairs)' },
  { value: 'Hammer', label: 'Hammer (handyman)' },
  { value: 'Truck', label: 'Truck (transport)' },
  { value: 'Monitor', label: 'Monitor (IT)' }
];

const emptyForm = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  divisionSlogan: '',
  heroImage: '',
  iconName: 'Wrench',
  accentColor: '#C8973E',
  includedServices: [] as string[],
  benefits: [] as string[],
  featured: false,
  active: true,
  displayOrder: 0,
  seoTitle: '',
  seoDescription: ''
};

type FormState = typeof emptyForm;

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [slugLocked, setSlugLocked] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setServices((await res.json()) || []);
      setListError(null);
    } catch (e) {
      console.error(e);
      setListError('Could not load divisions. Reload the page to try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSlugLocked(false);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (svc: any) => {
    setEditingId(svc.id);
    setForm({
      name: svc.name || '',
      slug: svc.slug || '',
      shortDescription: svc.shortDescription || '',
      description: svc.description || '',
      divisionSlogan: svc.divisionSlogan || '',
      heroImage: svc.heroImage || '',
      iconName: svc.iconName || 'Wrench',
      accentColor: svc.accentColor || '#C8973E',
      includedServices: Array.isArray(svc.includedServices) ? [...svc.includedServices] : [],
      benefits: Array.isArray(svc.benefits) ? [...svc.benefits] : [],
      featured: Boolean(svc.featured),
      active: svc.active !== false,
      displayOrder: Number(svc.displayOrder ?? 0),
      seoTitle: svc.seoTitle || '',
      seoDescription: svc.seoDescription || ''
    });
    // An existing slug is a live URL - never auto-rewrite it from the name.
    setSlugLocked(true);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const slug = (form.slug || slugify(form.name)).trim();
    if (!slug) {
      setFormError('A URL slug is required.');
      setSubmitting(false);
      return;
    }

    const clash = services.some((s) => s.slug === slug && s.id !== editingId);
    if (clash) {
      setFormError(`The slug "${slug}" is already used by another division.`);
      setSubmitting(false);
      return;
    }

    // Keep the shape the public pages expect; process/faq are preserved on edit.
    const payload = {
      ...form,
      slug,
      process: editingId ? services.find((s) => s.id === editingId)?.process ?? [] : [],
      faq: editingId ? services.find((s) => s.id === editingId)?.faq ?? [] : []
    };

    try {
      const res = await fetch(
        editingId ? `/api/services/${editingId}` : '/api/services',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setFormError(err?.error || `Save failed (HTTP ${res.status}).`);
        return;
      }

      await fetchServices();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Save failed. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (svc: any) => {
    if (
      !confirm(
        `Delete "${svc.name}"?\n\nThis removes the division and its public page at /services/${svc.slug}. This cannot be undone.`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/services/${svc.id}`, { method: 'DELETE' });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s.id !== svc.id));
      } else {
        setListError('Could not delete that division.');
      }
    } catch (err) {
      console.error(err);
      setListError('Could not delete that division.');
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !current })
      });
      if (res.ok) {
        setServices((prev) => prev.map((s) => (s.id === id ? { ...s, active: !current } : s)));
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
              Core Operations
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#0A2540] sm:text-3xl">
              Service Divisions
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Add, edit, reorder, and retire divisions. Changes appear on the public site
              immediately.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/services"
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
              <span>Add Division</span>
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
          <div className="py-16 text-center text-sm text-slate-400">Loading divisions…</div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-sm font-semibold text-slate-600">No divisions yet.</p>
            <button
              onClick={openCreate}
              className="mt-3 text-xs font-bold uppercase tracking-wider text-[#C8973E] hover:underline"
            >
              Add your first division
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((svc, idx) => (
              <div
                key={svc.id}
                className="flex flex-col justify-between space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-[#C8973E]"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#C8973E]">
                      Division {String(idx + 1).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => handleToggleActive(svc.id, svc.active)}
                      title="Toggle public visibility"
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        svc.active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {svc.active ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <h2 className="font-serif text-lg font-bold leading-snug text-[#0A2540]">
                    {svc.name}
                  </h2>

                  {svc.divisionSlogan && (
                    <p className="font-serif text-xs font-medium italic text-[#C8973E]">
                      &ldquo;{svc.divisionSlogan}&rdquo;
                    </p>
                  )}

                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {svc.shortDescription}
                  </p>

                  <div className="space-y-1 border-t border-slate-100 pt-2">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Included Scopes ({svc.includedServices?.length || 0}):
                    </span>
                    {svc.includedServices?.slice(0, 3).map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-[#C8973E]" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(svc)}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-[#0A2540] transition-colors hover:bg-slate-100 hover:text-[#C8973E]"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <Link
                      href={`/services/${svc.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#0A2540]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>View</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-slate-400">
                      #{svc.displayOrder}
                    </span>
                    <button
                      onClick={() => handleDelete(svc)}
                      title="Delete division"
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
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
        wide
        title={editingId ? 'Edit Division' : 'Add New Division'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        submitLabel={editingId ? 'Save Changes' : 'Create Division'}
      >
        <Row>
          <TextField
            label="Division Name"
            required
            value={form.name}
            placeholder="e.g. General Construction"
            onChange={(v) => {
              set('name', v);
              if (!slugLocked) set('slug', slugify(v));
            }}
          />
          <TextField
            label="URL Slug"
            required
            value={form.slug}
            placeholder="general-construction"
            hint={`Public page: /services/${form.slug || 'your-slug'}`}
            onChange={(v) => {
              setSlugLocked(true);
              set('slug', slugify(v));
            }}
          />
        </Row>

        <TextField
          label="Division Slogan"
          value={form.divisionSlogan}
          placeholder="e.g. Building Dreams. Creating Legacies."
          onChange={(v) => set('divisionSlogan', v)}
        />

        <TextArea
          label="Short Description"
          required
          rows={2}
          value={form.shortDescription}
          placeholder="One or two sentences shown on cards and listings."
          onChange={(v) => set('shortDescription', v)}
        />

        <TextArea
          label="Full Description"
          required
          rows={5}
          value={form.description}
          placeholder="The full description shown on the division's own page."
          onChange={(v) => set('description', v)}
        />

        <LocalImageField
          label="Hero Image"
          folder="pages"
          value={form.heroImage}
          onChange={(url) => set('heroImage', url)}
          helpText="Wide landscape image works best · max 8MB"
        />

        <Row>
          <SelectField
            label="Icon"
            value={form.iconName}
            options={ICON_OPTIONS}
            onChange={(v) => set('iconName', v)}
          />
          <NumberField
            label="Display Order"
            value={form.displayOrder}
            min={0}
            hint="Lower numbers appear first."
            onChange={(v) => set('displayOrder', v)}
          />
        </Row>

        <StringListField
          label="Included Services"
          items={form.includedServices}
          onChange={(items) => set('includedServices', items)}
          placeholder="e.g. Residential & commercial construction"
          hint="These are the capability bullets listed on the public page."
        />

        <StringListField
          label="Key Benefits"
          items={form.benefits}
          onChange={(items) => set('benefits', items)}
          placeholder="e.g. Clear written quotes agreed before work begins"
        />

        <Row>
          <CheckboxField
            label="Featured division"
            checked={form.featured}
            onChange={(v) => set('featured', v)}
            hint="Highlighted on the homepage."
          />
          <CheckboxField
            label="Visible on the public site"
            checked={form.active}
            onChange={(v) => set('active', v)}
            hint="Uncheck to hide without deleting."
          />
        </Row>

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Search Engine Optimisation (optional)
          </p>
          <div className="space-y-4">
            <TextField
              label="SEO Title"
              value={form.seoTitle}
              placeholder="Leave blank to use the division name"
              onChange={(v) => set('seoTitle', v)}
            />
            <TextArea
              label="SEO Description"
              rows={2}
              value={form.seoDescription}
              placeholder="Leave blank to use the short description"
              onChange={(v) => set('seoDescription', v)}
            />
          </div>
        </div>
      </AdminModal>
    </>
  );
}
