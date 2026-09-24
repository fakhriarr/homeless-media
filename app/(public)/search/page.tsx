import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { Article, ArticleListResponse } from "@/lib/types";
import { HorizontalArticle } from "@/components/ArticleCard";
import { PageTitle } from "@/components/SectionHeading";
import Pagination from "@/components/Pagination";
import { SearchIcon } from "@/components/icons";

export const metadata = {
  title: "Cari Berita",
  description: "Cari berita berdasarkan kata kunci di MediaKita.",
};

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const query = await searchParams;
  const q = String(query.q ?? "").trim();
  const sort = String(query.sort ?? "latest");
  const page = Math.max(Number(query.page) || 1, 1);

  if (!q) {
    return (
      <div>
        <PageTitle title="Cari Berita" subtitle="Masukkan kata kunci untuk mencari judul berita." />
        <SearchForm initial="" />
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center">
          <SearchIcon className="mx-auto h-8 w-8 text-zinc-300" />
          <p className="mt-3 text-zinc-500">Ketik judul berita yang ingin Anda cari.</p>
        </div>
      </div>
    );
  }

  const popular = sort === "popular" ? "&popular=1" : "";
  const list = await apiFetch<ArticleListResponse>(`/api/articles?q=${encodeURIComponent(q)}&page=${page}&limit=10${popular}`).catch(
    () => ({ articles: [] as Article[], pagination: { page, limit: 10, total: 0, totalPages: 1 } })
  );

  return (
    <div>
      <PageTitle title={`Hasil pencarian: “${q}”`} subtitle={`${list.pagination.total} berita ditemukan.`} />
      <SearchForm initial={q} sort={sort} />

      <div className="mt-4 mb-6 flex gap-2">
        <SortLink basePath={`/search?q=${encodeURIComponent(q)}`} current={sort} value="latest" label="Terbaru" />
        <SortLink basePath={`/search?q=${encodeURIComponent(q)}`} current={sort} value="popular" label="Terpopuler" />
      </div>

      {list.articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center text-zinc-500">
          Tidak ada berita yang cocok dengan kata kunci tersebut. Coba kata kunci lain.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {list.articles.map((a) => (
            <HorizontalArticle key={a.id} article={a} />
          ))}
        </div>
      )}

      <Pagination basePath={`/search?q=${encodeURIComponent(q)}${popular ? `&sort=popular` : ""}`} page={list.pagination.page} totalPages={list.pagination.totalPages} />
    </div>
  );
}

function SearchForm({ initial, sort }: { initial: string; sort?: string }) {
  return (
    <form action="/search" method="GET" className="mb-6 flex max-w-xl gap-2">
      <input
        type="text"
        name="q"
        defaultValue={initial}
        placeholder="Cari judul berita…"
        className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
      />
      {sort && <input type="hidden" name="sort" value={sort} />}
      <button type="submit" className="rounded-lg bg-red-700 px-5 py-2 text-sm font-semibold text-white hover:bg-red-800">
        Cari
      </button>
    </form>
  );
}

function SortLink({ basePath, current, value, label }: { basePath: string; current: string; value: string; label: string }) {
  const active = current === value;
  return (
    <Link
      href={`${basePath}${value === "popular" ? "&sort=popular" : ""}`}
      aria-current={active ? "page" : undefined}
      className={`rounded-full px-4 py-1.5 text-sm font-medium ${
        active ? "bg-zinc-900 text-white" : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {label}
    </Link>
  );
}