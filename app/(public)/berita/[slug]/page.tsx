import { apiFetch } from "@/lib/api";
import { extractParagraphs } from "@/lib/utils";
import type { Category, Article, ArticleListResponse } from "@/lib/types";
import {
  ArticleMeta,
  CategoryBadge,
  GridArticle,
  CompactArticle,
} from "@/components/ArticleCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Sidebar } from "@/components/Sidebar";
import CtaBanner from "@/components/CtaBanner";
import CoverImage from "@/components/CoverImage";
import ViewTracker from "@/components/ViewTracker";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type ArticleDetail = {
  article: Article & { content: string };
  related: Article[];
};

export async function generateMetadata({ params }: PageProps<"/berita/[slug]">) {
  const { slug } = await params;
  try {
    const { article } = await apiFetch<ArticleDetail>(`/api/articles/${slug}`);
    if (!article) return { title: "Berita Tidak Ditemukan" };
    return {
      title: article.title,
      description: article.excerpt ?? article.title,
      openGraph: {
        title: article.title,
        description: article.excerpt ?? article.title,
        images: article.coverImage ? [article.coverImage] : [],
        type: "article",
      },
    };
  } catch {
    return { title: "Berita Tidak Ditemukan" };
  }
}

export default async function ArticlePage({ params }: PageProps<"/berita/[slug]">) {
  const { slug } = await params;
  const { article, related } = await apiFetch<ArticleDetail>(`/api/articles/${slug}`).catch(() => ({
    article: null,
    related: [] as Article[],
  }));

  if (!article) notFound();

  const paragraphs = extractParagraphs(article.content);
  const categories = await apiFetch<{ categories: Category[] }>("/api/categories").catch(() => ({
    categories: [] as Category[],
  }));

  const otherCategoryData = await Promise.all(
    categories.categories
      .filter((c) => c.slug !== article.category?.slug)
      .slice(0, 2)
      .map(async (c) => {
        const { articles } = await apiFetch<ArticleListResponse>(`/api/articles?category=${c.slug}&limit=4`);
        return { category: c, articles };
      })
  );

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <ViewTracker slug={article.slug} />

      <div className="lg:col-span-2">
        <CategoryBadge name={article.category?.name} slug={article.category?.slug} />
        <h1 className="mt-2 font-serif text-3xl font-bold leading-tight text-zinc-900 sm:text-4xl">
          {article.title}
        </h1>
        {article.excerpt && <p className="mt-3 text-base leading-relaxed text-zinc-600">{article.excerpt}</p>}

        <div className="mt-4">
          <ArticleMeta publishedAt={article.publishedAt} content={article.content} views={article.views} />
        </div>

        {article.coverImage && (
          <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-zinc-200">
            <CoverImage src={article.coverImage} alt={article.title} sizes="(max-width: 1024px) 100vw, 66vw" priority />
          </div>
        )}

        <article className="mt-6 space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-sans text-[17px] leading-8 text-zinc-800">
              {p}
            </p>
          ))}
        </article>

        {/* Profil Penulis */}
        {article.author && (
          <div className="mt-8 flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-700 text-lg font-bold text-white">
              {article.author.name.charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Penulis</p>
              <p className="font-serif text-lg font-bold text-zinc-900">{article.author.name}</p>
              {article.author.bio && <p className="mt-1 text-sm leading-relaxed text-zinc-600">{article.author.bio}</p>}
            </div>
          </div>
        )}

        {/* CTA Berlangganan */}
        <div className="mt-8">
          <CtaBanner />
        </div>

        {/* Berita Terkait */}
        {related.length > 0 && (
          <section className="mt-4">
            <SectionHeading title="Berita Terkait" />
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {related.map((a) => (
                <CompactArticle key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}

        {otherCategoryData.map(({ category, articles }) => {
          if (articles.length === 0) return null;
          return (
            <section key={category.id} className="mt-10">
              <SectionHeading title={`Berita ${category.name}`} href={`/kategori/${category.slug}`} />
              <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {articles.map((a) => (
                  <GridArticle key={a.id} article={a} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <Sidebar />
    </div>
  );
}