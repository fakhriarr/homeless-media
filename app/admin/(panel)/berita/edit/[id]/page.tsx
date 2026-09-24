import { prisma } from "@/lib/prisma";
import type { Category } from "@/lib/types";
import ArticleForm from "@/components/admin/ArticleForm";
import { notFound } from "next/navigation";

export const metadata = { title: "Edit Berita" };

export default async function AdminEditBeritaPage({ params }: PageProps<"/admin/berita/edit/[id]">) {
  const { id } = await params;

  const [dbArticle, dbCategories] = await Promise.all([
    prisma.article.findFirst({ where: { OR: [{ id }, { slug: id }] } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!dbArticle) notFound();

  const categories: Category[] = dbCategories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-zinc-900">Edit Berita</h1>
        <p className="text-sm text-zinc-500">Perbarui informasi berita berikut ini.</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <ArticleForm
          articleSlug={dbArticle.slug}
          initial={{
            title: dbArticle.title,
            excerpt: dbArticle.excerpt ?? "",
            content: dbArticle.content,
            coverImage: dbArticle.coverImage ?? "",
            categoryId: dbArticle.categoryId ?? "",
            status: dbArticle.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
            featured: dbArticle.featured,
          }}
          categories={categories}
        />
      </div>
    </div>
  );
}