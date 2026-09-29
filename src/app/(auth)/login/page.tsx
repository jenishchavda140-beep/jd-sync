'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/40">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/20 text-2xl text-green-400">
            J
          </div>
          <h1 className="mt-4 text-3xl font-bold text-white">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-400">Log in to manage your freelance workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input"
              placeholder="hello@jd-groups.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          {message ? <p className="text-sm text-red-400">{message}</p> : null}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-green-400 hover:text-green-300">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
