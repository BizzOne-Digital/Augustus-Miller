'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, Trash2, Calendar, ExternalLink, X } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New post form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Insights');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setPosts(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          excerpt,
          content,
          author: 'Augustus Miller'
        })
      });

      if (res.ok) {
        const created = await res.json();
        setPosts((prev) => [created, ...prev]);
        setShowAddModal(false);
        setTitle('');
        setExcerpt('');
        setContent('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
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
              Content Marketing
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
              Articles & Guides
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Publish news, case studies, and field notes across all divisions.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm">
            Loading articles...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {posts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[#0A2540] uppercase">
                      {p.category}
                    </span>
                    <span>{p.publishedAt}</span>
                    <span>By {p.author}</span>
                  </div>
                  <h2 className="font-serif font-bold text-lg text-[#0A2540]">
                    {p.title}
                  </h2>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {p.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <Link
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    className="p-2 text-slate-500 hover:text-[#0A2540] hover:bg-slate-100 rounded-lg transition-colors text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 transition-colors"
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
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#0A2540]">
                  Create New Article
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-md hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPost} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Maintenance Checks Every Atlanta Property Owner Must Do"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                    <option value="Insights">Insights</option>
                    <option value="Property Care">Property Care</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Construction">Construction</option>
                    <option value="IT & Tech">IT & Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Short Excerpt
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief summary displayed on article cards..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Full Content *
                  </label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Write your article text..."
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
                    {submitting ? 'Publishing...' : 'Publish Article'}
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
