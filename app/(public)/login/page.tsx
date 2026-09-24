"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { clientApi } from "@/lib/client-api";
import type { SessionUser } from "@/lib/types";
import { SITE_NAME } from "@/lib/constants";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await clientApi.post<{ user: SessionUser }>("/api/auth/login", { email, password });
      router.push(res.user.role === "ADMIN" && next === "/" ? "/admin/berita" : next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl font-bold text-zinc-900">Masuk</h1>
          <p className="mt-1 text-sm text-zinc-500">Selamat datang kembali di {SITE_NAME}.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-zinc-700">Password</label>
            <input
              id="password"
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
            className="w-full rounded-lg bg-red-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60"
          >
            {loading ? "Memproses…" : "Masuk"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link href="/reset-password" className="text-red-700 hover:text-red-800">Lupa password?</Link>
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-zinc-500">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-red-700 hover:text-red-800">Daftar di sini</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-8">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}