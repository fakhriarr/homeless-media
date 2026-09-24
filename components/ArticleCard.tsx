import Link from "next/link";
import type { Article } from "@/lib/types";
import { readingTime, relativeTime, formatViews } from "@/lib/utils";
import CoverImage from "@/components/CoverImage";
import { ClockIcon, EyeIcon } from "@/components/icons";

const CATEGORY_COLORS: Record<string, string> = {
  Nasional: "bg-red-700",
  Ekonomi: "bg-emerald-700",
  Olahraga: "bg-blue-700",
  Teknologi: "bg-violet-700",
  Hiburan: "bg-amber-600",
  "Gaya Hidup": "bg-teal-700",
};

export function CategoryBadge({ name, slug, color }: { name?: string; slug?: string; color?: string }) {
  if (!name || !slug) return null;
  return (
    <Link
      href={`/kategori/${slug}`}
      className={`inline-block rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-85 ${
        color ?? CATEGORY_COLORS[name] ?? "bg-zinc-700"
      }`}
    >
      {name}
    </Link>
  );
}

export function ArticleMeta({
  publishedAt,
  content,
  views,
}: {
  publishedAt: Article["publishedAt"];
  content: string;
  views: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
      <time dateTime={publishedAt ?? undefined}>{relativeTime(publishedAt ?? new Date())}</time>
      <span className="inline-flex items-center gap-1">
        <ClockIcon className="h-3.5 w-3.5" /> {readingTime(content)} mnt baca
      </span>
      <span className="inline-flex items-center gap-1">
        <EyeIcon className="h-3.5 w-3.5" /> {formatViews(views)}
      </span>
    </div>
  );
}

export function HeroArticle({ article }: { article: Article }) {
  return (
    <article className="group">
      <Link href={`/berita/${article.slug}`} className="block">
        <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-xl bg-zinc-200">
          <CoverImage
            src={article.coverImage}
            alt={article.title}
            className="transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
          />
        </div>
      </Link>
      <CategoryBadge name={article.category?.name} slug={article.category?.slug} />
      <h2 className="mt-2 font-serif text-2xl font-bold leading-snug text-zinc-900 sm:text-3xl">
        <Link href={`/berita/${article.slug}`} className="transition-colors group-hover:text-red-700">
          {article.title}
        </Link>
      </h2>
      {article.excerpt && (
        <p className="mt-2 hidden text-sm leading-relaxed text-zinc-600 sm:block">{article.excerpt}</p>
      )}
      <div className="mt-3">
        <ArticleMeta publishedAt={article.publishedAt} content={article.content} views={article.views} />
      </div>
    </article>
  );
}

export function GridArticle({ article }: { article: Article }) {
  return (
    <article className="group">
      <Link href={`/berita/${article.slug}`} className="block">
        <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-lg bg-zinc-200">
          <CoverImage src={article.coverImage} alt={article.title} className="transition-transform duration-300 group-hover:scale-[1.02]" sizes="(max-width: 640px) 100vw, 25vw" />
        </div>
      </Link>
      <CategoryBadge name={article.category?.name} slug={article.category?.slug} />
      <h3 className="mt-2 font-serif text-base font-bold leading-snug text-zinc-900">
        <Link href={`/berita/${article.slug}`} className="transition-colors group-hover:text-red-700">
          {article.title}
        </Link>
      </h3>
      <div className="mt-2">
        <ArticleMeta publishedAt={article.publishedAt} content={article.content} views={article.views} />
      </div>
    </article>
  );
}

export function HorizontalArticle({ article }: { article: Article }) {
  return (
    <article className="group flex gap-4">
      <Link href={`/berita/${article.slug}`} className="relative block h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-zinc-200 sm:h-28 sm:w-40">
        <CoverImage src={article.coverImage} alt={article.title} className="transition-transform duration-300 group-hover:scale-[1.05]" sizes="160px" />
      </Link>
      <div className="min-w-0">
        <CategoryBadge name={article.category?.name} slug={article.category?.slug} />
        <h3 className="mt-1.5 font-serif text-sm font-bold leading-snug text-zinc-900 sm:text-base">
          <Link href={`/berita/${article.slug}`} className="transition-colors group-hover:text-red-700">
            {article.title}
          </Link>
        </h3>
        <div className="mt-1.5">
          <ArticleMeta publishedAt={article.publishedAt} content={article.content} views={article.views} />
        </div>
      </div>
    </article>
  );
}

export function CompactArticle({
  article,
  rank,
}: {
  article: Article;
  rank?: number;
}) {
  return (
    <article className="group flex gap-3 border-b border-zinc-100 py-3 last:border-0">
      {rank !== undefined && (
        <Link href={`/berita/${article.slug}`} className="shrink-0 font-serif text-2xl font-black text-red-700/70">
          {rank}
        </Link>
      )}
      <div className="min-w-0">
        <h3 className="font-serif text-sm font-bold leading-snug text-zinc-900">
          <Link href={`/berita/${article.slug}`} className="transition-colors group-hover:text-red-700">
            {article.title}
          </Link>
        </h3>
        <div className="mt-1">
          <ArticleMeta publishedAt={article.publishedAt} content={article.content} views={article.views} />
        </div>
      </div>
    </article>
  );
}