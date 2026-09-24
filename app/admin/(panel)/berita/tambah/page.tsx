import { prisma } from "@/lib/prisma";
import type { Category } from "@/lib/types";
import ArticleForm from "@/components/admin/ArticleForm";

export const metadata = { title: "Tambah Berita" };

export default async function AdminTambahBeritaPage() {
  const dbCategories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  const categories: Category[] = dbCategories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-zinc-900">Tambah Berita</h1>
        <p className="text-sm text-zinc-500">Lengkapi form untuk membuat berita baru.</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <ArticleForm initial={null} categories={categories} />
      </div>
    </div>
  );
}