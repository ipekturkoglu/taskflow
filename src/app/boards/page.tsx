'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

type Board = {
  id: string;
  title: string;
  user_id: string;
};

export default function BoardsPage() {
  const [title, setTitle] = useState('');
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchBoards = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setBoards(data);
    }

    setLoading(false);
  };

  const handleCreateBoard = async () => {
    if (!title.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('boards')
      .insert([
        {
          title,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    setBoards([data, ...boards]);
    setTitle('');
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200 p-6 text-slate-900">
      <section className="mb-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-indigo-600">
              TaskFlow
            </p>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
              Board&apos;larım
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Yeni board oluşturabilir, görevlerini kolon ve kartlarla yönetebilirsin.
            </p>
          </div>

          <div className="rounded-2xl bg-indigo-600 px-4 py-3 text-white shadow-sm">
            <p className="text-xs opacity-80">Toplam Board</p>
            <p className="text-xl font-bold">{boards.length}</p>
          </div>
        </div>
      </section>

      <section className="mb-6 flex flex-col gap-2 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur sm:flex-row">
        <input
          className="flex-1 rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Yeni board adı"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          onClick={handleCreateBoard}
          className="rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
        >
          Oluştur
        </button>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-white/70 bg-white/70 p-8 text-center text-slate-500 shadow-sm">
          Board&apos;lar yükleniyor...
        </div>
      ) : boards.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-indigo-300 bg-white/70 p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Henüz board oluşturmadın
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Başlamak için ilk board&apos;unu oluştur.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="group rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  Board
                </span>

                <span className="text-slate-300 transition group-hover:text-indigo-500">
                  →
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                {board.title}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Board detayına git
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}