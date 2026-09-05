'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, KeyRound, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError('Please enter the admin password.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', password }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || 'Invalid password.');
          return;
        }

        router.push('/admin');
        router.refresh();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Login failed.';
        setError(msg);
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 text-white">
      <div className="w-full max-w-md bg-stone-900/90 backdrop-blur-md rounded-2xl p-8 border border-stone-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Admin Portal
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Review contributions, generate scrapbook designs &amp; publish letters
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-stone-300 mb-2">
              Admin Access Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full pl-10 pr-4 py-3 bg-stone-800/80 border border-stone-700 rounded-xl text-white placeholder-stone-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-stone-800 text-center flex items-center justify-between text-xs text-stone-500">
          <Link href="/" className="hover:text-stone-300 transition-colors">
            ← Contributor Form
          </Link>
          <span className="flex items-center gap-1 text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Protected Route
          </span>
        </div>
      </div>
    </div>
  );
}
