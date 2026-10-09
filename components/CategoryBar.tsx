"use client";

import Link from "next/link";
import type { Category } from "@/lib/types";
import { usePathname } from "next/navigation";

export default function CategoryBar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  if (categories.length === 0) return null;

  const isHome = pathname === "/";
  return (
    <nav className="sticky top-24 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80" aria-label="Bar kategori">
      <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link
          href="/"
          className={`whitespace-nowrap rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
            isHome ? "bg-brand-700 text-white" : "text-zinc-700 hover:bg-zinc-100 hover:text-brand-700"
          }`}
        >
          Populer & Tren
        </Link>
        {categories.map((c) => {
          const isActive = pathname === `/kategori/${c.slug}`;
          return (
            <Link
              key={c.id}
              href={`/kategori/${c.slug}`}
              className={`whitespace-nowrap rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                isActive ? "bg-brand-700 text-white" : "text-zinc-700 hover:bg-zinc-100 hover:text-brand-700"
              }`}
            >
              {c.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
