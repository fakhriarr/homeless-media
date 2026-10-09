import Link from "next/link";
import type { Category } from "@/lib/types";

export default function CategoryBar({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <nav className="sticky top-24 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80" aria-label="Bar kategori">
      <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link href="/" className="whitespace-nowrap rounded-full bg-brand-700 px-3.5 py-1 text-xs font-semibold text-white">
          Populer & Tren
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/kategori/${c.slug}`}
            className="whitespace-nowrap rounded-full px-3.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-brand-700"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}