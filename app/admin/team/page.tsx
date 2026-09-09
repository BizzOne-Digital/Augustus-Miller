'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertCircle, Edit2, ExternalLink, Plus, Trash2, Users } from 'lucide-react';
import LocalImageField from '@/components/admin/LocalImageField';
import { resolveImageSrc } from '@/lib/images';
import {
  AdminModal,
  CheckboxField,
  NumberField,
  Row,
  TextArea,
  TextField
} from '@/components/admin/AdminForm';

const emptyForm = {
  name: '',
  position: '',
  bio: '',
  photo: '',
  email: '',
  phone: '',
  linkedin: '',
  displayOrder: 0,
  active: true
};

type FormState = typeof emptyForm;

export default function AdminTeamPage() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch('/api/team');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTeam((await res.json()) || []);
      setListError(null);
    } catch (e) {
      console.error(e);
      setListError('Could not load team members. Reload the page to try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const openCreate = () => {
    setEditingId(null);
    const nextOrder = team.reduce((m, t) => Math.max(m, Number(t.displayOrder ?? 0)), 0) + 1;
    setForm({ ...emptyForm, displayOrder: nextOrder });
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (m: any) => {
    setEditingId(m.id);
    setForm({
      name: m.name || '',
      position: m.position || '',
      bio: m.bio || '',
      photo: m.photo || '',
      email: m.email || '',
      phone: m.phone || '',
      linkedin: m.linkedin || '',
      displayOrder: Number(m.displayOrder ?? 0),
      active: m.active !== false
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch(editingId ? `/api/team/${editingId}` : '/api/team', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        setFormError(err?.error || `Save failed (HTTP ${res.status}).`);
        return;
      }

      await fetchTeam();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Save failed. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (m: any) => {
    if (!confirm(`Remove "${m.name}" from the team?\n\nThis cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/team/${m.id}`, { method: 'DELETE' });
      if (res.ok) {
        setTeam((prev) => prev.filter((x) => x.id !== m.id));
      } else {
        setListError('Could not remove that team member.');
      }
    } catch (err) {
      console.error(err);
      setListError('Could not remove that team member.');
    }
  };

  const handleToggleActive = async (m: any) => {
    try {
      const res = await fetch(`/api/team/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !m.active })
      });
      if (res.ok) {
        setTeam((prev) => prev.map((x) => (x.id === m.id ? { ...x, active: !m.active } : x)));
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
              People &amp; Leadership
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#0A2540] sm:text-3xl">
              Team Leadership
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Manage the leadership and specialists shown on the public team page.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/team"
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
              <span>Add Member</span>
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
          <div className="py-16 text-center text-sm text-slate-400">Loading team…</div>
        ) : team.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <Users className="mx-auto mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No team members yet.</p>
            <button
              onClick={openCreate}
              className="mt-3 text-xs font-bold uppercase tracking-wider text-[#C8973E] hover:underline"
            >
              Add your first team member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div
                key={m.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors hover:border-[#C8973E]/60"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={resolveImageSrc(m.photo)}
                      alt={m.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-top"
                    />
                    <button
                      onClick={() => handleToggleActive(m)}
                      title="Toggle public visibility"
                      className={`absolute right-3 top-3 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        m.active !== false
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {m.active !== false ? 'Visible' : 'Hidden'}
                    </button>
                  </div>

                  <div className="space-y-1.5 p-5">
                    <h2 className="font-serif text-base font-bold text-[#0A2540]">{m.name}</h2>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#C8973E]">
                      {m.position}
                    </span>
                    <p className="line-clamp-3 pt-1 text-xs leading-relaxed text-slate-600">
                      {m.bio}
                    </p>
                    {(m.email || m.phone) && (
                      <div className="space-y-0.5 pt-2 text-[11px] text-slate-500">
                        {m.email && <p className="truncate">{m.email}</p>}
                        {m.phone && <p>{m.phone}</p>}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 p-3">
                  <span className="text-[11px] font-medium text-slate-400">
                    Order #{m.displayOrder}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(m)}
                      title="Edit member"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0A2540]"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(m)}
                      title="Remove member"
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
        title={editingId ? 'Edit Team Member' : 'Add Team Member'}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        submitLabel={editingId ? 'Save Changes' : 'Add Member'}
      >
        <Row>
          <TextField
            label="Full Name"
            required
            value={form.name}
            placeholder="e.g. Augustus Miller"
            onChange={(v) => set('name', v)}
          />
          <TextField
            label="Position"
            required
            value={form.position}
            placeholder="e.g. Founder & CEO"
            onChange={(v) => set('position', v)}
          />
        </Row>

        <TextArea
          label="Biography"
          required
          rows={4}
          value={form.bio}
          placeholder="Background, responsibilities, and experience."
          onChange={(v) => set('bio', v)}
        />

        <LocalImageField
          label="Photo"
          folder="team"
          value={form.photo}
          onChange={(url) => set('photo', url)}
          helpText="Portrait orientation works best · max 8MB"
        />

        <Row>
          <TextField
            label="Email"
            type="email"
            value={form.email}
            placeholder="name@millergroup.com"
            onChange={(v) => set('email', v)}
          />
          <TextField
            label="Phone"
            type="tel"
            value={form.phone}
            placeholder="+1 (770) 572-2022"
            onChange={(v) => set('phone', v)}
          />
        </Row>

        <Row>
          <TextField
            label="LinkedIn URL"
            type="url"
            value={form.linkedin}
            placeholder="https://linkedin.com/in/…"
            onChange={(v) => set('linkedin', v)}
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
          label="Visible on the public team page"
          checked={form.active}
          onChange={(v) => set('active', v)}
          hint="Uncheck to hide without deleting."
        />
      </AdminModal>
    </>
  );
}
