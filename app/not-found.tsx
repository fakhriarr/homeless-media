import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

// Fallback 404 untuk URL yang tidak cocok dengan segmen mana pun
// (di luar route group (public), sehingga tidak punya navbar publik).
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-red-700 font-serif text-lg font-black text-white">M</span>
            <span className="font-serif text-xl font-bold text-zinc-900">{SITE_NAME}</span>
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-16 text-center">
        <div>
          <p className="font-serif text-7xl font-black text-red-700">404</p>
          <h1 className="mt-3 font-serif text-2xl font-bold text-zinc-900">Halaman Tidak Ditemukan</h1>
          <p className="mt-2 max-w-sm text-sm text-zinc-500">
            Halaman yang Anda cari tidak tersedia.
          </p>
          <Link href="/" className="mt-6 inline-block rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-800">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}