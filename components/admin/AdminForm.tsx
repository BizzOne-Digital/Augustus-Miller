'use client';

import React from 'react';
import { AlertCircle, Loader2, Plus, Save, Trash2, X } from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Modal shell                                                               */
/* -------------------------------------------------------------------------- */

interface AdminModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting?: boolean;
  error?: string | null;
  submitLabel?: string;
  children: React.ReactNode;
  /** Widen the dialog for records with many fields. */
  wide?: boolean;
}

export function AdminModal({
  open,
  title,
  onClose,
  onSubmit,
  submitting = false,
  error = null,
  submitLabel = 'Save',
  children,
  wide = false
}: AdminModalProps) {
  // Close on Escape for keyboard users.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, submitting, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#0A2540]/60 p-4 backdrop-blur-sm sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`my-8 w-full rounded-2xl bg-white shadow-2xl ${wide ? 'max-w-3xl' : 'max-w-xl'}`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-[#0A2540]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-6 py-5 text-xs">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {children}

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-[#C8973E] px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0A2540] shadow-sm transition-colors hover:bg-[#D4A244] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Field primitives                                                          */
/* -------------------------------------------------------------------------- */

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 outline-none transition-colors focus:border-[#C8973E] focus:ring-1 focus:ring-[#C8973E] disabled:bg-slate-50';

export function Field({
  label,
  required,
  hint,
  children
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  required,
  placeholder,
  hint,
  type = 'text'
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  required,
  min,
  step,
  hint
}: {
  label: string;
  value: number | string;
  onChange: (v: number) => void;
  required?: boolean;
  min?: number;
  step?: string;
  hint?: string;
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <input
        type="number"
        required={required}
        min={min}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={inputClass}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  required,
  rows = 3,
  placeholder,
  hint
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <textarea
        required={required}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    </Field>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#C8973E]"
      />
      <span>
        <span className="font-semibold text-slate-700">{label}</span>
        {hint && <span className="mt-0.5 block text-[11px] text-slate-500">{hint}</span>}
      </span>
    </label>
  );
}

/**
 * Editable list of plain strings - used for capability bullets, benefits, tags.
 * Stores a real array so the API receives the same shape the site renders.
 */
export function StringListField({
  label,
  items,
  onChange,
  placeholder = 'Add an item…',
  hint
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  hint?: string;
}) {
  const [draft, setDraft] = React.useState('');

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft('');
  };

  return (
    <Field label={`${label} (${items.length})`} hint={hint}>
      <div className="space-y-2">
        {items.length > 0 && (
          <ul className="space-y-1.5">
            {items.map((item, i) => (
              <li
                key={`${item}-${i}`}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <span className="flex-1 break-words text-slate-700">{item}</span>
                <button
                  type="button"
                  aria-label={`Remove ${item}`}
                  onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  className="shrink-0 rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                // Enter adds an item; it must not submit the whole form.
                e.preventDefault();
                add();
              }
            }}
            className={inputClass}
          />
          <button
            type="button"
            onClick={add}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#0A2540] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#153a63]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </Field>
  );
}

/** Two-column row on wider screens, stacked on mobile. */
export function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

/** Slugify a title into a URL-safe slug. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
