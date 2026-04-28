'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      router.push('/boards');
    } else {
      alert(error.message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200 p-6 text-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-sm backdrop-blur">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
            TaskFlow
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Giriş Yap
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Board&apos;larını yönetmek için hesabına giriş yap.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full rounded-2xl bg-indigo-600 p-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md">
            Giriş Yap
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Hesabın yok mu?{' '}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Kayıt ol
          </Link>
        </p>
      </div>
    </main>
  );
}