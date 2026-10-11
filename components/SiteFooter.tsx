import Link from "next/link";
import type { Category } from "@/lib/types";
import { FacebookIcon, InstagramIcon, TwitterIcon, YouTubeIcon } from "@/components/icons";
import { SITE_NAME } from "@/lib/constants";

export default function SiteFooter({ categories }: { categories: Category[] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt={SITE_NAME} className="h-10 w-auto" />
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600">
              JelajahRasa mengajak kamu menjelajahi cita rasa Nusantara, dari kuliner lokal dan tempat makan ramah kantong sampai hidden gem dan cerita di balik para pelaku kuliner.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-brand-700 hover:text-white">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" className="rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-brand-700 hover:text-white">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Twitter" className="rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-brand-700 hover:text-white">
                <TwitterIcon />
              </a>
              <a href="#" aria-label="YouTube" className="rounded-full bg-zinc-100 p-2 text-zinc-600 hover:bg-brand-700 hover:text-white">
                <YouTubeIcon />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium tracking-wide text-zinc-900">Kategori</h3>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/kategori/${c.slug}`} className="text-sm text-zinc-600 hover:text-brand-700">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium tracking-wide text-zinc-900">JelajahRasa</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-zinc-600 hover:text-brand-700">Beranda</Link></li>
              <li><Link href="/search" className="text-sm text-zinc-600 hover:text-brand-700">Cari Berita</Link></li>
              <li><Link href="/register" className="text-sm text-zinc-600 hover:text-brand-700">Daftar Akun</Link></li>
              <li><Link href="/login" className="text-sm text-zinc-600 hover:text-brand-700">Masuk</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-zinc-200 pt-5 text-xs text-zinc-500 sm:flex-row">
          <p>© {year} {SITE_NAME}. All rights reserved.</p>
          <p>Terms & Conditions. Privacy Policy.</p>
        </div>
      </div>
    </footer>
  );
}