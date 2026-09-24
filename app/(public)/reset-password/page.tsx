"use client";

import { useState } from "react";
import Link from "next/link";
import { clientApi } from "@/lib/client-api";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await clientApi.post<{ message: string }>("/api/auth/reset-password", { email });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-2xl font-bold text-zinc-900">Reset Password</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Masukkan email Anda, kami akan mengirimkan link untuk mengatur ulang password.
          </p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-6 text-center">
            <p className="text-lg font-semibold text-green-800">Link Terkirim (Simulasi)</p>
            <p className="mt-1 text-sm text-green-700">
              Link reset password telah dikirim ke <strong>{email}</strong>. Periksa kotak masuk Anda.
            </p>
            <p className="mt-3 text-xs text-green-600">
              (Versi demonstrasi — tidak ada email sungguhan yang dikirim.)
            </p>
          </div>
        ) : (
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

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-red-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60"
            >
              {loading ? "Mengirim…" : "Kirim Link Reset"}
            </button>
          </form>
        )}
      </div>

      <p className="mt-5 text-center text-sm text-zinc-500">
        <Link href="/login" className="font-semibold text-red-700 hover:text-red-800">Kembali ke halaman masuk</Link>
      </p>
    </div>
  );
}