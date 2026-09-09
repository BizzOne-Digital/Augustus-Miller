'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Settings,
  Upload,
  Save,
  CheckCircle2,
  Copy,
  Folder,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

export default function AdminSettingsPage() {
  // Keys must match the SiteSettings shape returned by GET /api/settings.
  const [settings, setSettings] = useState<any>({
    businessName: '',
    corporateMotto: '',
    primaryEmail: '',
    primaryPhone: '',
    primaryAddress: ''
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Upload manager state
  const [targetFolder, setTargetFolder] = useState('products');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setSettings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSavedSuccess(false);
    setSaveError(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        setSaveError('Could not save settings. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setSaveError('Could not save settings. Please check your connection.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setUploadedUrl(null);
    setUploadError(null);

    try {
      // POST /api/upload takes multipart FormData with `file` and `folder`.
      const body = new FormData();
      body.append('file', file);
      body.append('folder', targetFolder);

      const res = await fetch('/api/upload', { method: 'POST', body });
      const payload = await res.json().catch(() => null);

      if (res.ok && payload?.success && payload?.url) {
        setUploadedUrl(payload.url as string);
      } else {
        setUploadError(payload?.error || `Upload failed (HTTP ${res.status}).`);
      }
    } catch (err) {
      console.error(err);
      setUploadError('Upload failed. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="space-y-8">
        <div>
          <span className="text-xs font-bold text-[#C8973E] tracking-widest uppercase block">
            System Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0A2540]">
            Settings & Media Upload Manager
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Configure core corporate identity details and upload assets for your products, team, and blog posts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Corporate Settings Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">
                Corporate Profile & Contact Details
              </h2>
              <p className="text-xs text-slate-500">
                These values are reflected in the header, footer, booking forms, and legal documentation.
              </p>
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Corporate settings updated successfully.</span>
              </div>
            )}

            {saveError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={settings.businessName || ''}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Corporate Slogan / Tagline
                </label>
                <input
                  type="text"
                  value={settings.corporateMotto || ''}
                  onChange={(e) => setSettings({ ...settings, corporateMotto: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={settings.primaryPhone || ''}
                    onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    value={settings.primaryEmail || ''}
                    onChange={(e) => setSettings({ ...settings, primaryEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Headquarters Address
                </label>
                <input
                  type="text"
                  value={settings.primaryAddress || ''}
                  onChange={(e) => setSettings({ ...settings, primaryAddress: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#0A2540] hover:bg-[#153a63] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Media & Asset Uploader */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-serif font-bold text-lg text-[#0A2540]">
                Image Upload Manager
              </h2>
              <p className="text-xs text-slate-500">
                Upload image assets to store in the database and get public URLs for your items.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Asset Folder
                </label>
                <div className="relative">
                  <Folder className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={targetFolder}
                    onChange={(e) => setTargetFolder(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  >
                    <option value="products">products (Equipment & tools)</option>
                    <option value="services">services (Division graphics)</option>
                    <option value="team">team (Staff headshots)</option>
                    <option value="blog">blog (Article covers)</option>
                    <option value="gallery">gallery (Site visuals)</option>
                  </select>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#C8973E] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-50 space-y-3"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                <div className="w-12 h-12 rounded-full bg-[#0A2540]/5 text-[#0A2540] flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6 text-[#C8973E]" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block text-xs">
                    {uploading ? 'Uploading...' : 'Click to Browse or Drag Image Here'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Supports PNG, JPG, WEBP, SVG
                  </span>
                </div>
              </div>

              {uploadError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle className="mt-0.5 w-4 h-4 shrink-0 text-red-600" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Upload Result Preview */}
              {uploadedUrl && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Upload Succeeded
                    </span>
                  </div>

                  <div className="relative h-36 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <Image
                      src={uploadedUrl}
                      alt="Uploaded asset"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={uploadedUrl}
                      className="w-full px-2 py-1.5 rounded border border-slate-200 text-[11px] font-mono bg-white text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(uploadedUrl)}
                      className="px-3 py-1.5 rounded bg-[#0A2540] text-white text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
