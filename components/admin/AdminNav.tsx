"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clientApi } from "@/lib/client-api";
import type { SessionUser } from "@/lib/types";
import { LogoutIcon } from "@/components/icons";

const NAV = [
  { href: "/admin/berita", label: "Daftar Berita" },
  { href: "/admin/berita/tambah", label: "Tambah Berita" },
];

export default function AdminNav({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await clientApi.post("/api/auth/logout");
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-red-700 font-serif text-lg font-black text-white">M</span>
            <span className="font-serif text-lg font-bold text-zinc-900">MediaKita</span>
          </Link>
          <span className="rounded-full bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
            Admin
          </span>
        </div>

        <nav className="flex items-center gap-1" aria-label="Menu admin">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href === "/admin/berita" && pathname.startsWith("/admin/berita/edit"));
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? "bg-red-50 text-red-700" : "text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/" target="_blank" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50">
            Lihat Situs
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-800"
          >
            <LogoutIcon className="h-3.5 w-3.5" /> Keluar
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-3 text-sm text-zinc-500">
        Masuk sebagai <span className="font-semibold text-zinc-700">{user.name}</span>
      </div>
    </header>
  );
}