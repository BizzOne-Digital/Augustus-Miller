'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Plus,
  Trash2,
  Tag,
  ExternalLink,
  CheckCircle2,
  X
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product form
  const [name, setName] = useState('');
  const [price, setPrice] = useState('149.99');
  const [category, setCategory] = useState('General');
  const [sku, setSku] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          category,
          sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
          shortDescription,
          images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800&auto=format&fit=crop'],
          comingSoon: true
        })
      });

      if (res.ok) {
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
        setShowAddModal(false);
        setName('');
        setShortDescription('');
        setImageUrl('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
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
              Merchandise & Tools
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
              Products & Equipment Catalog
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage commercial gear, trade inspection kits, and official products.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-2">
            <p className="font-serif font-bold text-lg text-[#0A2540]">No Products Yet</p>
            <p className="text-xs text-slate-500">Click &apos;Add New Product&apos; to create your first equipment item.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100">
                    <Image
                      src={p.images?.[0] || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800&auto=format&fit=crop'}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#0A2540] text-[#DFC37C] text-[10px] font-bold px-2 py-0.5 rounded">
                      {p.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white px-2.5 py-1 rounded-md text-xs font-bold text-[#0A2540] shadow">
                      ${p.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 block">
                      SKU: {p.sku}
                    </span>
                    <h2 className="font-serif font-bold text-base text-[#0A2540]">
                      {p.name}
                    </h2>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {p.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                    Active Catalog
                  </span>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                  Add New Product
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Miller Group Pro Multi-Trade Inspection Kit"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Price ($ USD) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    >
                      <option value="General">General</option>
                      <option value="Construction">Construction</option>
                      <option value="IT Hardware">IT Hardware</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Image URL (Unsplash or Uploaded)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide overview, inclusions, specifications..."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
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
                    {submitting ? 'Saving...' : 'Save Product'}
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
