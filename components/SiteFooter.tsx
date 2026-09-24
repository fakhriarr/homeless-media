import Link from "next/link";
import type { Category } from "@/lib/types";
import { FacebookIcon, InstagramIcon, TwitterIcon, YouTubeIcon } from "@/components/icons";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function SiteFooter({ categories }: { categories: Category[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-red-700 font-serif text-lg font-black text-white">
                M
              </span>
              <span className="font-serif text-xl font-bold text-zinc-900">{SITE_NAME}</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
              {SITE_TAGLINE}. Menyajikan informasi nasional, ekonomi, olahraga, teknologi, hiburan, dan gaya hidup
              secara cepat, akurat, dan terpercaya. Dibangun dengan arsitektur headless (Next.js + API).
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-red-700 hover:text-white">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" className="rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-red-700 hover:text-white">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Twitter" className="rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-red-700 hover:text-white">
                <TwitterIcon />
              </a>
              <a href="#" aria-label="YouTube" className="rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-red-700 hover:text-white">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-900">Kategori</h3>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/kategori/${c.slug}`} className="text-sm text-zinc-600 hover:text-red-700">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-zinc-900">MediaKita</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-zinc-600 hover:text-red-700">Beranda</Link></li>
              <li><Link href="/search" className="text-sm text-zinc-600 hover:text-red-700">Cari Berita</Link></li>
              <li><Link href="/register" className="text-sm text-zinc-600 hover:text-red-700">Daftar Akun</Link></li>
              <li><Link href="/login" className="text-sm text-zinc-600 hover:text-red-700">Masuk</Link></li>
              <li><Link href="/admin/login" className="text-sm text-zinc-600 hover:text-red-700">Panel Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-zinc-200 pt-5 text-xs text-zinc-500 sm:flex-row">
          <p>© {year} {SITE_NAME}. Dibuat untuk tugas kuliah — versi sederhana.</p>
          <p>Arsitektur headless: frontend & panel admin mengonsumsi satu API.</p>
        </div>
      </div>
    </footer>
  );
}