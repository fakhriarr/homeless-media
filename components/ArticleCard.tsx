import Link from "next/link";
import type { Article } from "@/lib/types";
import { readingTime, relativeTime, formatViews } from "@/lib/utils";
import CoverImage from "@/components/CoverImage";
import { ClockIcon, EyeIcon } from "@/components/icons";

const CATEGORY_COLORS: Record<string, string> = {
  "Kuliner Lokal": "bg-brand-700",
  "Ramah Kantong": "bg-[#3F7D20]",
  "Hidden Gem": "bg-[#0E7490]",
  "Cerita Pelaku Kuliner": "bg-[#6B4226]",
};

export function CategoryBadge({ name, slug, color }: { name?: string; slug?: string; color?: string }) {
  if (!name || !slug) return null;
  return (
    <Link
      href={`/kategori/${slug}`}
      className={`inline-block rounded-full px-3 py-1 text-[11px] font-medium tracking-wide text-white transition-opacity hover:opacity-85 ${
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
      <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight leading-[1.25] text-[#4A2E1F] sm:text-3xl">
        <Link href={`/berita/${article.slug}`} className="transition-colors group-hover:text-brand-700">
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
      <h3 className="mt-2 font-heading text-base font-bold tracking-tight leading-[1.25] text-[#4A2E1F]">
        <Link href={`/berita/${article.slug}`} className="transition-colors group-hover:text-brand-700">
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
        <h3 className="mt-1.5 font-heading text-sm font-bold tracking-tight leading-[1.25] text-[#4A2E1F] sm:text-base">
          <Link href={`/berita/${article.slug}`} className="transition-colors group-hover:text-brand-700">
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
  showImage,
}: {
  article: Article;
  rank?: number;
  showImage?: boolean;
}) {
  return (
    <article className="group flex gap-3 border-b border-zinc-100 py-3 last:border-0">
      {showImage && (
        <Link href={`/berita/${article.slug}`} className="relative block h-16 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-200 sm:h-20 sm:w-24">
          <CoverImage src={article.coverImage} alt={article.title} className="transition-transform duration-300 group-hover:scale-[1.05]" sizes="96px" />
          {rank !== undefined && (
            <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-700 text-[11px] font-bold text-white">
              {rank}
            </span>
          )}
        </Link>
      )}
      {rank !== undefined && !showImage && (
        <Link href={`/berita/${article.slug}`} className="shrink-0 font-heading text-2xl font-extrabold tracking-tight text-brand-700/70">
          {rank}
        </Link>
      )}
      <div className="min-w-0">
        <h3 className="font-heading text-sm font-bold tracking-tight leading-[1.25] text-[#4A2E1F]">
          <Link href={`/berita/${article.slug}`} className="transition-colors group-hover:text-brand-700">
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