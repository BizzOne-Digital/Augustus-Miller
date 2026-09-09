'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, BookOpen, Edit2, ExternalLink, Plus, Trash2 } from 'lucide-react';
import LocalImageField from '@/components/admin/LocalImageField';
import { resolveImageSrc } from '@/lib/images';
import {
  AdminModal,
  Row,
  SelectField,
  StringListField,
  TextArea,
  TextField,
  slugify
} from '@/components/admin/AdminForm';

const CATEGORY_OPTIONS = [
  { value: 'Insights', label: 'Insights' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Property Management', label: 'Property Management' },
  { value: 'Business & Finance', label: 'Business & Finance' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Company News', label: 'Company News' }
];

const STATUS_OPTIONS = [
  { value: 'Published', label: 'Published' },
  { value: 'Draft', label: 'Draft' }
];

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  author: 'Augustus Miller',
  category: 'Insights',
  tags: [] as string[],
  status: 'Published',
  publishedAt: new Date().toISOString().split('T')[0],
  readTime: '4 min read',
  seoTitle: '',
  seoDescription: ''
};

type FormState = typeof emptyForm;

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
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

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/blog');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPosts((await res.json()) || []);
      setListError(null);
    } catch (e) {
      console.error(e);
      setListError('Could not load articles. Reload the page to try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSlugLocked(false);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditingId(p.id);
    setForm({
      title: p.title || '',
      slug: p.slug || '',
      excerpt: p.excerpt || '',
      content: p.content || '',
      coverImage: p.coverImage || '',
      author: p.author || 'Augustus Miller',
      category: p.category || 'Insights',
      tags: Array.isArray(p.tags) ? [...p.tags] : [],
      status: p.status || 'Published',
      publishedAt: (p.publishedAt || '').split('T')[0] || new Date().toISOString().split('T')[0],
      readTime: p.readTime || '4 min read',
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || ''
    });
    setSlugLocked(true);
    setFormError(null);
    setModalOpen(true);
  };

  /** Rough reading time so the badge stays honest as content changes. */
  const estimateReadTime = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return `${Math.max(1, Math.round(words / 200))} min read`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const slug = (form.slug || slugify(form.title)).trim();
    if (!slug) {
      setFormError('A URL slug is required.');
      setSubmitting(false);
      return;
    }
    if (posts.some((p) => p.slug === slug && p.id !== editingId)) {
      setFormError(`The slug "${slug}" is already used by another article.`);
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      slug,
      readTime: form.readTime || estimateReadTime(form.content)
    };

    try {
      const res = await fetch(editingId ? `/api/blog/${editingId}` : '/api/blog', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setFormError(err?.error || `Save failed (HTTP ${res.status}).`);
        return;
      }

      await fetchPosts();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Save failed. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (p: any) => {
    if (!confirm(`Delete "${p.title}"?\n\nThis cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/blog/${p.id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((x) => x.id !== p.id));
      } else {
        setListError('Could not delete that article.');
      }
    } catch (err) {
      console.error(err);
      setListError('Could not delete that article.');
    }
  };

  const handleToggleStatus = async (p: any) => {
    const next = p.status === 'Published' ? 'Draft' : 'Published';
    try {
      const res = await fetch(`/api/blog/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next })
      });
      if (res.ok) {
        setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
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
              Content &amp; Insights
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#0A2540] sm:text-3xl">
              Articles &amp; Guides
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Write and manage blog posts. Drafts stay off the public site and out of search.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/blog"
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
              <span>New Article</span>
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
          <div className="py-16 text-center text-sm text-slate-400">Loading articles…</div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <BookOpen className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No articles yet.</p>
            <button
              onClick={openCreate}
              className="mt-3 text-xs font-bold uppercase tracking-wider text-[#C8973E] hover:underline"
            >
              Write your first article
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-[#C8973E]/60 sm:flex-row sm:items-center"
              >
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-36">
                  <Image
                    src={resolveImageSrc(p.coverImage)}
                    alt={p.title}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      title="Toggle published / draft"
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'Published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.status}
                    </button>
                    <span className="rounded-full bg-[#0A2540]/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0A2540]">
                      {p.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{p.readTime}</span>
                  </div>

                  <h2 className="font-serif text-base font-bold leading-snug text-[#0A2540]">
                    {p.title}
                  </h2>
                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {p.excerpt}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    By {p.author} · /blog/{p.slug}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Link
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    title="View article"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0A2540]"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => openEdit(p)}
                    title="Edit article"
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0A2540]"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    title="Delete article"
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
        title={editingId ? 'Edit Article' : 'New Article'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        submitLabel={editingId ? 'Save Changes' : 'Create Article'}
      >
        <TextField
          label="Title"
          required
          value={form.title}
          placeholder="e.g. Preventative Maintenance for Georgia Properties"
          onChange={(v) => {
            set('title', v);
            if (!slugLocked) set('slug', slugify(v));
          }}
        />

        <Row>
          <TextField
            label="URL Slug"
            required
            value={form.slug}
            hint={`Public URL: /blog/${form.slug || 'your-slug'}`}
            onChange={(v) => {
              setSlugLocked(true);
              set('slug', slugify(v));
            }}
          />
          <TextField
            label="Author"
            value={form.author}
            onChange={(v) => set('author', v)}
          />
        </Row>

        <TextArea
          label="Excerpt"
          required
          rows={2}
          value={form.excerpt}
          placeholder="The summary shown on cards and in search results."
          onChange={(v) => set('excerpt', v)}
        />

        <TextArea
          label="Article Content"
          required
          rows={10}
          value={form.content}
          placeholder="The full article body."
          hint="Plain text and line breaks are preserved."
          onChange={(v) => set('content', v)}
        />

        <LocalImageField
          label="Cover Image"
          folder="blog"
          value={form.coverImage}
          onChange={(url) => set('coverImage', url)}
          helpText="Wide landscape image works best · max 8MB"
        />

        <Row>
          <SelectField
            label="Category"
            value={form.category}
            options={CATEGORY_OPTIONS}
            onChange={(v) => set('category', v)}
          />
          <SelectField
            label="Status"
            value={form.status}
            options={STATUS_OPTIONS}
            onChange={(v) => set('status', v)}
            hint="Drafts are hidden and set to noindex."
          />
        </Row>

        <Row>
          <TextField
            label="Publish Date"
            type="date"
            value={form.publishedAt}
            onChange={(v) => set('publishedAt', v)}
          />
          <TextField
            label="Read Time"
            value={form.readTime}
            placeholder="4 min read"
            hint="Leave blank to calculate from the content length."
            onChange={(v) => set('readTime', v)}
          />
        </Row>

        <StringListField
          label="Tags"
          items={form.tags}
          onChange={(items) => set('tags', items)}
          placeholder="e.g. property maintenance"
        />

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Search Engine Optimisation (optional)
          </p>
          <div className="space-y-4">
            <TextField
              label="SEO Title"
              value={form.seoTitle}
              placeholder="Leave blank to use the article title"
              onChange={(v) => set('seoTitle', v)}
            />
            <TextArea
              label="SEO Description"
              rows={2}
              value={form.seoDescription}
              placeholder="Leave blank to use the excerpt"
              onChange={(v) => set('seoDescription', v)}
            />
          </div>
        </div>
      </AdminModal>
    </>
  );
}
