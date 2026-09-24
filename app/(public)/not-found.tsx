import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-serif text-7xl font-black text-red-700">404</p>
      <h1 className="mt-3 font-serif text-2xl font-bold text-zinc-900">Halaman Tidak Ditemukan</h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        Maaf, halaman atau berita yang Anda cari tidak tersedia. Mungkin sudah dihapus atau tautannya salah.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-800"
        >
          Kembali ke Beranda
        </Link>
        <Link
          href="/search"
          className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
        >
          Cari Berita
        </Link>
      </div>
    </div>
  );
}