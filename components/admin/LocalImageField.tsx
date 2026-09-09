'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ImagePlus, Loader2, RefreshCw, Trash2, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { resolveImageSrc, isStoredUploadUrl } from '@/lib/images';

export type UploadFolder = 'products' | 'gallery' | 'pages' | 'misc' | 'team' | 'blog';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const ACCEPT_ATTR = 'image/png,image/jpeg,image/webp,image/gif';
const MAX_FILE_SIZE = 8 * 1024 * 1024; // must match the server limit

interface LocalImageFieldProps {
  label?: string;
  /** Current value: a public URL string (`/api/uploads/...` or an external URL). */
  value: string;
  /** Receives the saved public URL, or '' when cleared. */
  onChange: (url: string) => void;
  folder?: UploadFolder;
  helpText?: string;
  /**
   * Delete the previous binary from storage when the image is replaced or
   * removed. Only applies to `/api/uploads/` URLs this app owns.
   */
  deleteOnReplace?: boolean;
  className?: string;
  disabled?: boolean;
}

type Toast = { kind: 'success' | 'error'; message: string } | null;

/**
 * Admin image field backed by the serverless-safe upload API.
 *
 * Uploads go to POST /api/upload as multipart FormData and come back as a public
 * URL served from MongoDB - nothing is written to the local filesystem, so this
 * works unchanged on Vercel and survives redeploys.
 */
export default function LocalImageField({
  label = 'Image',
  value,
  onChange,
  folder = 'misc',
  helpText,
  deleteOnReplace = true,
  className = '',
  disabled = false
}: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((kind: 'success' | 'error', message: string) => {
    setToast({ kind, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), kind === 'error' ? 6000 : 3000);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  /** Best-effort cleanup of a replaced binary. Never blocks the new value. */
  const removeStoredBinary = useCallback(async (url: string) => {
    if (!deleteOnReplace || !isStoredUploadUrl(url)) return;
    try {
      await fetch(`/api/upload?url=${encodeURIComponent(url)}`, { method: 'DELETE' });
    } catch {
      // Orphaned binary is not worth failing the edit over.
    }
  }, [deleteOnReplace]);

  const handleFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      notify('error', 'Unsupported file type. Use PNG, JPEG, WEBP, or GIF.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      notify('error', `File is ${mb}MB. The maximum is 8MB.`);
      return;
    }

    const previous = value;
    setUploading(true);

    try {
      const body = new FormData();
      body.append('file', file);
      body.append('folder', folder);

      const res = await fetch('/api/upload', { method: 'POST', body });
      const payload = await res.json().catch(() => null);

      if (!res.ok || !payload?.success || !payload?.url) {
        const message =
          payload?.error ||
          (res.status === 401
            ? 'Your admin session expired. Sign in again to upload.'
            : `Upload failed (HTTP ${res.status}).`);
        notify('error', message);
        return;
      }

      onChange(payload.url as string);
      notify('success', 'Image uploaded.');
      await removeStoredBinary(previous);
    } catch {
      notify('error', 'Upload failed. Check your connection and try again.');
    } finally {
      setUploading(false);
      // Allow re-selecting the same file after a failure.
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [folder, notify, onChange, removeStoredBinary, value]);

  const handleRemove = useCallback(async () => {
    const previous = value;
    onChange('');
    notify('success', 'Image removed.');
    await removeStoredBinary(previous);
  }, [notify, onChange, removeStoredBinary, value]);

  const previewSrc = resolveImageSrc(value);
  const hasImage = Boolean(value?.trim());
  const isBusy = uploading || disabled;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide">
          {label}
        </label>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-3">
        <div className="flex items-start gap-4">
          {/* Preview thumbnail */}
          <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
            {hasImage ? (
              <Image
                src={previewSrc}
                alt={label || 'Uploaded image preview'}
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImagePlus className="w-7 h-7" />
              </div>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-[#0A2540]/70 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isBusy}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A2540] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#061426] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Uploading…
                  </>
                ) : hasImage ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Replace
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-3.5 h-3.5" />
                    Upload image
                  </>
                )}
              </button>

              {hasImage && !uploading && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isBusy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              {helpText || `PNG, JPEG, WEBP, or GIF · max 8MB · saved to "${folder}"`}
            </p>

            {hasImage && (
              <p className="truncate text-[10px] font-mono text-slate-400" title={value}>
                {value}
              </p>
            )}
          </div>
        </div>

        {/* Manual URL entry stays available for external images. */}
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={isBusy}
          placeholder="…or paste an external image URL"
          className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 outline-none transition-colors focus:border-[#C8973E] disabled:bg-slate-50"
        />

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>

      {/* Inline toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-start gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
            toast.kind === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {toast.kind === 'success' ? (
            <CheckCircle2 className="mt-0.5 w-3.5 h-3.5 shrink-0" />
          ) : (
            <AlertTriangle className="mt-0.5 w-3.5 h-3.5 shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
