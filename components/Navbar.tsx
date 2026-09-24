"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Category, SessionUser } from "@/lib/types";
import { clientApi } from "@/lib/client-api";
import { SITE_NAME } from "@/lib/constants";
import { CloseIcon, LogoutIcon, MenuIcon, SearchIcon } from "@/components/icons";

export default function Navbar({ categories }: { categories: Category[] }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    clientApi
      .get<{ user: SessionUser | null }>("/api/auth/me")
      .then((res) => setUser(res.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  function closeMenus() {
    setMenuOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

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
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <button
          className="lg:hidden rounded-md p-2 text-zinc-700 hover:bg-zinc-100"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Buka menu"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <Link href="/" onClick={closeMenus} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-red-700 font-serif text-lg font-black text-white">
            M
          </span>
          <span className="font-serif text-xl font-bold tracking-tight text-zinc-900">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu utama">
          {categories.slice(0, 6).map((c) => (
            <Link
              key={c.id}
              href={`/kategori/${c.slug}`}
              onClick={closeMenus}
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-red-700"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          {searchOpen ? (
            <form onSubmit={submitSearch} className="flex items-center gap-2">
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita…"
                className="w-40 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm outline-none focus:border-red-700 sm:w-56"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-zinc-500 hover:text-zinc-700" aria-label="Tutup pencarian">
                <CloseIcon className="h-5 w-5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-md p-2 text-zinc-700 hover:bg-zinc-100"
              aria-label="Cari berita"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          )}

          {!loading && !user && (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link
                href="/login"
                onClick={closeMenus}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={closeMenus}
                className="rounded-lg bg-red-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-red-800"
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
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-700 text-xs font-bold text-white">
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
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50"
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
            className="hidden rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-zinc-700 md:block"
          >
            Langganan
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 lg:hidden">
          <nav className="grid grid-cols-2 gap-1" aria-label="Menu kategori mobile">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/kategori/${c.slug}`}
                onClick={closeMenus}
                className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
              >
                {c.name}
              </Link>
            ))}
          </nav>
          {!user && (
            <div className="mt-3 flex gap-2 border-t border-zinc-100 pt-3">
              <Link href="/login" onClick={closeMenus} className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-center text-sm font-medium text-zinc-800">
                Masuk
              </Link>
              <Link href="/register" onClick={closeMenus} className="flex-1 rounded-lg bg-red-700 px-4 py-2 text-center text-sm font-medium text-white">
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}