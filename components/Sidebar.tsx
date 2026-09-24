import type { Article, Category } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { CompactArticle } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { TrendingUpIcon } from "@/components/icons";

export async function Sidebar() {
  const [{ articles: latest }, { articles: trending }] = await Promise.all([
    apiFetch<{ articles: Article[] }>("/api/articles?limit=6"),
    apiFetch<{ articles: Article[] }>("/api/articles?popular=1&limit=5"),
  ]);

  return (
    <aside className="space-y-8">
      <section>
        <SectionHeading title="Berita Terbaru" />
        <div>
          {latest.map((a) => (
            <CompactArticle key={a.id} article={a} />
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 p-4">
        <div className="mb-2 flex items-center gap-2 border-b-2 border-zinc-900 pb-2">
          <TrendingUpIcon className="h-5 w-5 text-red-700" />
          <h2 className="font-serif text-lg font-bold text-zinc-900">Berita Trending</h2>
        </div>
        <div>
          {trending.map((a, i) => (
            <CompactArticle key={a.id} article={a} rank={i + 1} />
          ))}
        </div>
      </section>
    </aside>
  );
}

export async function CategorySections({ categories, skipSlug }: { categories: Category[]; skipSlug?: string }) {
  const targets = categories.filter((c) => c.slug !== skipSlug).slice(0, 3);
  if (targets.length === 0) return null;

  const sectionData = await Promise.all(
    targets.map(async (c) => {
      const { articles } = await apiFetch<{ articles: Article[] }>(
        `/api/articles?category=${c.slug}&limit=4`
      );
      return { category: c, articles };
    })
  );

  return (
    <div className="space-y-10">
      {sectionData.map(({ category, articles }) => {
        if (articles.length === 0) return null;
        return (
          <section key={category.id}>
            <SectionHeading title={category.name} href={`/kategori/${category.slug}`} />
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {articles.map((a) => (
                <CompactArticle key={a.id} article={a} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}