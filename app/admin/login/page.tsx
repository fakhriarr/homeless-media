"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { clientApi } from "@/lib/client-api";
import type { SessionUser } from "@/lib/types";

function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blocked = searchParams.get("blocked") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(blocked ? "Akses admin ditolak untuk akun ini." : "");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    clientApi
      .get<{ user: SessionUser | null }>("/api/auth/me")
      .then((res) => {
        if (res.user?.role === "ADMIN") router.replace("/admin/berita");
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await clientApi.post<{ user: SessionUser }>("/api/auth/login", { email, password });
      if (res.user.role !== "ADMIN") {
        setError("Akun Anda bukan admin. Login admin tidak diizinkan.");
        setLoading(false);
        return;
      }
      router.replace("/admin/berita");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return <p className="py-16 text-center text-sm text-zinc-500">Memeriksa sesi…</p>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-700 font-serif text-2xl font-black text-white">
              M
            </span>
            <h1 className="mt-3 font-serif text-xl font-bold text-zinc-900">Panel Admin MediaKita</h1>
            <p className="mt-1 text-sm text-zinc-500">Masuk dengan akun administrator.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mediakita.id"
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-zinc-700">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
              />
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-700 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
            >
              {loading ? "Memproses…" : "Masuk ke Panel"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-zinc-400">
            Demo: admin@mediakita.id / admin123
          </p>
        </div>

        <p className="mt-5 text-center text-sm">
          <Link href="/" className="font-medium text-zinc-600 hover:text-red-700">← Kembali ke situs</Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <AdminLogin />
    </Suspense>
  );
}