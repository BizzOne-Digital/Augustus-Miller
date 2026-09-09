'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, Edit2, ExternalLink, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import LocalImageField from '@/components/admin/LocalImageField';
import { resolveImageSrc } from '@/lib/images';
import {
  AdminModal,
  CheckboxField,
  NumberField,
  Row,
  SelectField,
  TextArea,
  TextField,
  slugify
} from '@/components/admin/AdminForm';

const CATEGORY_OPTIONS = [
  { value: 'General', label: 'General' },
  { value: 'Tools & Equipment', label: 'Tools & Equipment' },
  { value: 'Safety Gear', label: 'Safety Gear' },
  { value: 'Digital Services & Templates', label: 'Digital Services & Templates' },
  { value: 'Network Hardware', label: 'Network Hardware' }
];

const emptyForm = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  price: 0,
  salePrice: 0,
  sku: '',
  image: '',
  category: 'General',
  inventory: 0,
  featured: false,
  active: true,
  comingSoon: false,
  seoTitle: '',
  seoDescription: ''
};

type FormState = typeof emptyForm;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
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

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setProducts((await res.json()) || []);
      setListError(null);
    } catch (e) {
      console.error(e);
      setListError('Could not load products. Reload the page to try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sku: `MIL-${Date.now().toString().slice(-6)}` });
    setSlugLocked(false);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      name: p.name || '',
      slug: p.slug || '',
      shortDescription: p.shortDescription || '',
      description: p.description || '',
      price: Number(p.price ?? 0),
      salePrice: Number(p.salePrice ?? 0),
      sku: p.sku || '',
      image: p.images?.[0] || '',
      category: p.category || 'General',
      inventory: Number(p.inventory ?? 0),
      featured: Boolean(p.featured),
      active: p.active !== false,
      comingSoon: Boolean(p.comingSoon),
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || ''
    });
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
    if (products.some((p) => p.slug === slug && p.id !== editingId)) {
      setFormError(`The slug "${slug}" is already used by another product.`);
      setSubmitting(false);
      return;
    }
    if (products.some((p) => p.sku === form.sku && p.id !== editingId)) {
      setFormError(`The SKU "${form.sku}" is already used by another product.`);
      setSubmitting(false);
      return;
    }

    const { image, salePrice, ...rest } = form;
    const payload: Record<string, unknown> = {
      ...rest,
      slug,
      // The API stores an images array; this form manages the primary image.
      images: image ? [image] : []
    };
    // Only send salePrice when it is a real discount.
    if (salePrice > 0 && salePrice < form.price) payload.salePrice = salePrice;

    try {
      const res = await fetch(editingId ? `/api/products/${editingId}` : '/api/products', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setFormError(err?.error || `Save failed (HTTP ${res.status}).`);
        return;
      }

      await fetchProducts();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Save failed. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (p: any) => {
    if (!confirm(`Delete "${p.name}"?\n\nThis cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${p.id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((x) => x.id !== p.id));
      } else {
        setListError('Could not delete that product.');
      }
    } catch (err) {
      console.error(err);
      setListError('Could not delete that product.');
    }
  };

  const handleToggleActive = async (p: any) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !p.active })
      });
      if (res.ok) {
        setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !p.active } : x)));
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
              Merchandise &amp; Tools
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#0A2540] sm:text-3xl">
              Products &amp; Equipment Catalog
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Manage commercial gear, trade kits, and digital products.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/products"
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
              <span>Add Product</span>
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
          <div className="py-16 text-center text-sm text-slate-400">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <ShoppingBag className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No products yet.</p>
            <button
              onClick={openCreate}
              className="mt-3 text-xs font-bold uppercase tracking-wider text-[#C8973E] hover:underline"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-[#C8973E]/60"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={resolveImageSrc(p.images?.[0])}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div
                      className={`absolute left-3 top-3 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        p.comingSoon
                          ? 'bg-[#0A2540] text-[#DFC37C]'
                          : 'bg-[#C8973E] text-[#0A2540]'
                      }`}
                    >
                      {p.comingSoon ? 'Coming Soon' : 'Available'}
                    </div>
                  </div>

                  <div className="space-y-2 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-400">
                        SKU: {p.sku}
                      </span>
                      <button
                        onClick={() => handleToggleActive(p)}
                        title="Toggle public visibility"
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          p.active !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {p.active !== false ? 'Active' : 'Hidden'}
                      </button>
                    </div>

                    <h2 className="font-serif text-base font-bold leading-snug text-[#0A2540]">
                      {p.name}
                    </h2>
                    <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                      {p.shortDescription}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-bold text-[#0A2540]">
                        ${Number(p.price).toFixed(2)}
                      </span>
                      {p.salePrice > 0 && (
                        <span className="text-[11px] font-semibold text-emerald-700">
                          sale ${Number(p.salePrice).toFixed(2)}
                        </span>
                      )}
                      <span className="ml-auto text-[11px] text-slate-400">
                        stock {p.inventory ?? 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 border-t border-slate-100 p-3">
                  <button
                    onClick={() => openEdit(p)}
                    title="Edit product"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0A2540]"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    title="Delete product"
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
        wide
        title={editingId ? 'Edit Product' : 'Add New Product'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        submitLabel={editingId ? 'Save Changes' : 'Create Product'}
      >
        <Row>
          <TextField
            label="Product Name"
            required
            value={form.name}
            placeholder="e.g. Miller Pro Contractor Toolset"
            onChange={(v) => {
              set('name', v);
              if (!slugLocked) set('slug', slugify(v));
            }}
          />
          <TextField
            label="URL Slug"
            required
            value={form.slug}
            placeholder="miller-pro-toolset"
            onChange={(v) => {
              setSlugLocked(true);
              set('slug', slugify(v));
            }}
          />
        </Row>

        <Row>
          <TextField
            label="SKU"
            required
            value={form.sku}
            placeholder="MIL-TL-001"
            onChange={(v) => set('sku', v)}
          />
          <SelectField
            label="Category"
            value={form.category}
            options={CATEGORY_OPTIONS}
            onChange={(v) => set('category', v)}
          />
        </Row>

        <Row>
          <NumberField
            label="Price (USD)"
            required
            value={form.price}
            min={0}
            step="0.01"
            onChange={(v) => set('price', v)}
          />
          <NumberField
            label="Sale Price (USD)"
            value={form.salePrice}
            min={0}
            step="0.01"
            hint="Leave 0 for no sale price."
            onChange={(v) => set('salePrice', v)}
          />
        </Row>

        <TextArea
          label="Short Description"
          required
          rows={2}
          value={form.shortDescription}
          placeholder="One or two sentences shown on the product card."
          onChange={(v) => set('shortDescription', v)}
        />

        <TextArea
          label="Full Description"
          rows={4}
          value={form.description}
          placeholder="Specifications, inclusions, and details."
          onChange={(v) => set('description', v)}
        />

        <LocalImageField
          label="Product Image"
          folder="products"
          value={form.image}
          onChange={(url) => set('image', url)}
        />

        <Row>
          <NumberField
            label="Inventory"
            value={form.inventory}
            min={0}
            onChange={(v) => set('inventory', v)}
          />
          <div className="space-y-2.5 pt-5">
            <CheckboxField
              label="Coming soon"
              checked={form.comingSoon}
              onChange={(v) => set('comingSoon', v)}
              hint="Shows a Coming Soon badge and hides the price."
            />
            <CheckboxField
              label="Featured"
              checked={form.featured}
              onChange={(v) => set('featured', v)}
            />
            <CheckboxField
              label="Visible on the public site"
              checked={form.active}
              onChange={(v) => set('active', v)}
            />
          </div>
        </Row>

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Search Engine Optimisation (optional)
          </p>
          <div className="space-y-4">
            <TextField
              label="SEO Title"
              value={form.seoTitle}
              placeholder="Leave blank to use the product name"
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
