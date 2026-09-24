import { apiFetch } from "@/lib/api";
import type { Article, ArticleListResponse, Category } from "@/lib/types";
import { HeroArticle, GridArticle, CompactArticle } from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import CtaBanner from "@/components/CtaBanner";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

export const metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [{ categories }, heroRes, latestRes, popularRes] = await Promise.all([
    apiFetch<{ categories: Category[] }>("/api/categories"),
    apiFetch<ArticleListResponse>("/api/articles?featured=1&limit=1"),
    apiFetch<ArticleListResponse>("/api/articles?limit=8"),
    apiFetch<ArticleListResponse>("/api/articles?popular=1&limit=5"),
  ]);

  const featured = heroRes.articles[0];
  const latest = latestRes.articles;
  const popular = popularRes.articles;

  const categorySectionData = await Promise.all(
    categories.slice(0, 4).map(async (c) => {
      const { articles } = await apiFetch<ArticleListResponse>(`/api/articles?category=${c.slug}&limit=4`);
      return { category: c, articles };
    })
  );

  return (
    <div className="space-y-12">
      {/* Hero: 2/3 berita utama, 1/3 berita terbaru */}
      <section className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">{featured ? <HeroArticle article={featured} /> : null}</div>
        <aside>
          <SectionHeading title="Berita Terbaru" href="/search" />
          <div>
            {latest.slice(0, 6).map((a: Article) => (
              <CompactArticle key={a.id} article={a} />
            ))}
          </div>
        </aside>
      </section>

      {/* Popular News */}
      <section>
        <SectionHeading title="Berita Terpopuler" href="/search?sort=popular&q=" />
        <div className="grid gap-x-8 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
          {popular.map((a, i) => (
            <CompactArticle key={a.id} article={a} rank={i + 1} />
          ))}
        </div>
      </section>

      {/* Berita per Kategori */}
      {categorySectionData.map(({ category, articles }) => {
        if (articles.length === 0) return null;
        return (
          <section key={category.id}>
            <SectionHeading title={category.name} href={`/kategori/${category.slug}`} />
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
              {articles.map((a) => (
                <GridArticle key={a.id} article={a} />
              ))}
            </div>
          </section>
        );
      })}

      <CtaBanner />
    </div>
  );
}