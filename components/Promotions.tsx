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

  function closeMenus() {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }


  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-brand-700">
      <div className="mx-auto flex h-8 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex flex-1 items-center justify-center gap-1.5">
            <p className="text-white md:text-sm text-xs">
                <span className="md:hidden">Info kuliner baru tiap pekan. Gratis.</span>
                <span className="hidden md:inline">
                    Rekomendasi kuliner pilihan, dikirim ke inbox kamu setiap pekan. Gratis.
                </span>
            </p>
          <Link
            href={user ? "/#berlangganan" : "/register"}
            onClick={closeMenus}
            className="underline text-xs md:text-sm font-medium text-white md:block"
          >
            Langganan Sekarang!
          </Link>
        </div>
      </div>
    </header>
  );
}