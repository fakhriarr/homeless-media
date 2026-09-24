import Link from "next/link";
import type { Category } from "@/lib/types";

export default function CategoryBar({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <nav className="border-b border-zinc-200 bg-white" aria-label="Bar kategori">
      <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link href="/" className="whitespace-nowrap rounded-full bg-red-700 px-3.5 py-1 text-xs font-semibold text-white">
          Utama
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/kategori/${c.slug}`}
            className="whitespace-nowrap rounded-full px-3.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-red-700"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}