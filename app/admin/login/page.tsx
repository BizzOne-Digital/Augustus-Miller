'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import MillerLogo from '@/components/site/MillerLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@millergroup.com');
  const [password, setPassword] = useState('MillerAdmin2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#061426] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8973E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0A2540] rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0A2540] border border-[#C8973E]/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative z-10 space-y-6">
        {/* Crest */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <MillerLogo variant="mark" size="md" width={64} height={64} />
          </div>
          <span className="text-xs font-bold text-[#DFC37C] tracking-[0.2em] uppercase block">
            Administrative Portal
          </span>
          <h1 className="text-2xl font-serif font-bold text-white">
            Miller Group Management
          </h1>
          <p className="text-xs text-slate-300">
            Sign in to access bookings, dispatch requests, division controls, and site content.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@millergroup.com"
                className="w-full pl-9 pr-4 py-3 rounded-lg bg-[#071B2F] border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C8973E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-4 py-3 rounded-lg bg-[#071B2F] border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#C8973E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#C8973E] hover:bg-[#D4A244] text-[#0A2540] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-[#C8973E]/20 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Credentials Reminder for Preview */}
        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400 space-y-1">
          <p className="text-[11px]">
            Default Admin Credentials:
          </p>
          <p className="text-slate-300 font-mono text-[11px]">
            admin@millergroup.com / MillerAdmin2026!
          </p>
          <div className="pt-3">
            <Link href="/" className="text-xs text-[#DFC37C] hover:underline">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
