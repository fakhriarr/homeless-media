import { apiFetch } from "@/lib/api";
import type { ArticleListResponse, Category } from "@/lib/types";
import { HorizontalArticle } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/kategori/[slug]">) {
  const { slug } = await params;
  try {
    const { categories } = await apiFetch<{ categories: Category[] }>("/api/categories");
    const category = categories.find((c) => c.slug === slug);
    if (!category) return { title: "Kategori Tidak Ditemukan" };
    return {
      title: `Berita Kategori ${category.name}`,
      description: `Kumpulan berita terbaru dalam kategori ${category.name} di MediaKita.`,
    };
  } catch {
    return { title: "Kategori" };
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/kategori/[slug]">) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Math.max(Number(query.page) || 1, 1);

  const { categories } = await apiFetch<{ categories: Category[] }>("/api/categories").catch(() => ({
    categories: [] as Category[],
  }));
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const emptyList: ArticleListResponse = {
    articles: [],
    pagination: { page, limit: 8, total: 0, totalPages: 1 },
  };
  const list = await apiFetch<ArticleListResponse>(`/api/articles?category=${slug}&page=${page}&limit=8`).catch(
    () => emptyList
  );

  return (
    <div>
      <SectionHeading title={`Kategori: ${category.name}`} href={`/kategori/${slug}`} />
      <p className="-mt-3 mb-6 text-sm text-zinc-500">{list.pagination.total} berita ditemukan.</p>

      {list.articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-zinc-500">
          Belum ada berita pada kategori ini.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {list.articles.map((a) => (
            <HorizontalArticle key={a.id} article={a} />
          ))}
        </div>
      )}

      <Pagination basePath={`/kategori/${slug}`} page={list.pagination.page} totalPages={list.pagination.totalPages} />
    </div>
  );
}