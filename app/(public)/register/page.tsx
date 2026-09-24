"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/client-api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      await clientApi.post("/api/auth/register", { name, email, password });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl font-bold text-zinc-900">Daftar Akun</h1>
          <p className="mt-1 text-sm text-zinc-500">Buat akun untuk pengalaman membaca yang lebih baik.</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-zinc-700">Nama lengkap</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Anda"
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
            />
          </div>
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
              placeholder="Minimal 6 karakter"
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-zinc-700">Konfirmasi password</label>
            <input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Ulangi password"
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
            />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-red-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60"
          >
            {loading ? "Memproses…" : "Daftar"}
          </button>
        </form>
      </div>

      <p className="mt-5 text-center text-sm text-zinc-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-red-700 hover:text-red-800">Masuk</Link>
      </p>
    </div>
  );
}