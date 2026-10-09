"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Category, SessionUser } from "@/lib/types";
import { clientApi } from "@/lib/client-api";
import { SITE_NAME } from "@/lib/constants";
import { CloseIcon, LogoutIcon, MenuIcon, SearchIcon } from "@/components/icons";

export default function Navbar({ categories }: { categories: Category[] }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    clientApi
      .get<{ user: SessionUser | null }>("/api/auth/me")
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  function closeMenus() {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    closeMenus();
    setSearchQuery("");
  }

  async function handleLogout() {
    try {
      await clientApi.post("/api/auth/logout");
    } finally {
      setUser(null);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <header className="sticky top-8 z-40 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <button
          className="lg:hidden rounded-md p-2 text-zinc-700 hover:bg-zinc-100"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Buka menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <Link href="/" onClick={closeMenus} className="flex items-center">
          <img src="/logo.png" alt={SITE_NAME} className="h-9 w-auto" />
        </Link>

        {/* <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu utama">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/kategori/${c.slug}`}
              onClick={closeMenus}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-brand-700"
            >
              {c.name}
            </Link>
          ))}
        </nav> */}

        <div className="flex flex-1 items-center justify-end gap-1.5">
          <form onSubmit={submitSearch} className="hidden items-center gap-2 sm:flex sm:flex-1 sm:max-w-md lg:max-w-lg">
            <div className="relative flex w-full items-center">
              <SearchIcon className="absolute left-3 h-4 w-4 text-zinc-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita…"
                className="w-full rounded-lg border border-zinc-300 bg-white py-1.5 pl-9 pr-3 text-sm outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100/40"
              />
            </div>
          </form>

          {!loading && !user && (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link
                href="/login"
                onClick={closeMenus}
                className="rounded-full px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={closeMenus}
                className="rounded-full bg-brand-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-800"
              >
                Daftar
              </Link>
            </div>
          )}

          {!loading && user && (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md p-2 text-zinc-700 hover:bg-zinc-100"
                aria-label="Menu akun"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[7rem] truncate text-sm font-medium sm:block">{user.name}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-52 overflow-hidden rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-zinc-100 px-4 py-2.5">
                    <p className="truncate text-sm font-semibold text-zinc-900">{user.name}</p>
                    <p className="truncate text-xs text-zinc-500">{user.email}</p>
                  </div>
                  {user.role === "ADMIN" && (
                    <Link href="/admin/berita" onClick={closeMenus} className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                      Panel Admin
                    </Link>
                  )}
                  <Link href="/#berlangganan" onClick={closeMenus} className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                    Berlangganan
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-brand-700 hover:bg-brand-50"
                  >
                    <LogoutIcon className="h-3.5 w-3.5" /> Keluar
                  </button>
                </div>
              )}
            </div>
          )}

          <Link
            href={user ? "/#berlangganan" : "/register"}
            onClick={closeMenus}
            className="hidden rounded-full border-1 border-[#552B19] px-3 py-1.5 text-sm font-medium text-[#552B19] hover:bg-brand-700 hover:border-brand-700 hover:text-white md:block"
          >
            Langganan
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-zinc-200 px-4">
            <button
              className="rounded-md p-2 text-zinc-700 hover:bg-zinc-100"
              onClick={closeMenus}
              aria-label="Tutup menu"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <Link href="/" onClick={closeMenus} className="flex items-center">
              <img src="/logo.png" alt={SITE_NAME} className="h-9 w-auto" />
            </Link>
            <div className="w-9" />
          </div>

          <div className="flex flex-1 flex-col justify-between overflow-y-auto px-4 pb-6 pt-4">
            <div>
              <form onSubmit={submitSearch} className="mb-4">
                <div className="relative flex w-full items-center">
                  <SearchIcon className="absolute left-3 h-4 w-4 text-zinc-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berita…"
                    className="w-full rounded-lg border border-zinc-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100/40"
                  />
                </div>
              </form>

              <nav className="flex flex-col gap-1" aria-label="Menu kategori mobile">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/kategori/${c.slug}`}
                    onClick={closeMenus}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mt-4 border-t border-zinc-100 py-4">
              {!user && (
                <div className="flex gap-2">
                  <Link href="/login" onClick={closeMenus} className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-800">
                    Masuk
                  </Link>
                  <Link href="/register" onClick={closeMenus} className="flex-1 rounded-lg bg-brand-700 px-4 py-2 text-center text-sm font-medium text-white">
                    Daftar
                  </Link>
                </div>
              )}
              {user && (
                <div className="space-y-2">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-zinc-900">{user.name}</p>
                    <p className="truncate text-xs text-zinc-500">{user.email}</p>
                  </div>
                  {user.role === "ADMIN" && (
                    <Link href="/admin/berita" onClick={closeMenus} className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                      Panel Admin
                    </Link>
                  )}
                  <Link href="/#berlangganan" onClick={closeMenus} className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">
                    Berlangganan
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-brand-700 hover:bg-brand-50"
                  >
                    <LogoutIcon className="h-3.5 w-3.5" /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}