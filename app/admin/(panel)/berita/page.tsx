"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApi } from "@/lib/client-api";
import type { Article, ArticleListResponse } from "@/lib/types";
import { STATUS_LABEL, type ArticleStatus } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/icons";

const FILTERS: Array<{ value: string; label: string }> = [
  { value: "", label: "Semua" },
  { value: "PUBLISHED", label: "Terbit" },
  { value: "DRAFT", label: "Draft" },
  { value: "HIDDEN", label: "Disembunyikan" },
];

const STATUS_STYLE: Record<ArticleStatus, string> = {
  PUBLISHED: "bg-green-100 text-green-800",
  DRAFT: "bg-amber-100 text-amber-800",
  HIDDEN: "bg-zinc-200 text-zinc-700",
};

export default function AdminArticlesPage() {
  const [data, setData] = useState<ArticleListResponse | null>(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actingId, setActingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    const query = new URLSearchParams({ all: "1", limit: "10", page: String(page) });
    if (filter) query.set("status", filter);

    clientApi
      .get<ArticleListResponse>(`/api/articles?${query.toString()}`)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Gagal memuat data.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, filter, reload]);

  function refresh() {
    setLoading(true);
    setError("");
    setNotice("");
    setReload((n) => n + 1);
  }

  async function setStatus(article: Article, status: ArticleStatus) {
    setActingId(article.id);
    try {
      await clientApi.patch(`/api/articles/${article.slug}`, { status });
      setNotice(`Status "${article.title}" berhasil diubah.`);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengubah status.");
    } finally {
      setActingId(null);
    }
  }

  async function softDelete(article: Article) {
    if (!confirm(`Sembunyikan berita "${article.title}" dari halaman publik?`)) return;
    setActingId(article.id);
    try {
      await clientApi.delete(`/api/articles/${article.slug}`);
      setNotice(`Berita "${article.title}" disembunyikan.`);
      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyembunyikan berita.");
    } finally {
      setActingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-zinc-900">Daftar Berita</h1>
          <p className="text-sm text-zinc-500">Kelola seluruh konten berita di MediaKita.</p>
        </div>
        <Link
          href="/admin/berita/tambah"
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
        >
          <PlusIcon className="h-4 w-4" /> Tambah Berita
        </Link>
      </div>

      {notice && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-800">
          {notice}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setFilter(f.value);
              setPage(1);
              refresh();
            }}
            aria-current={filter === f.value ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              filter === f.value
                ? "bg-zinc-900 text-white"
                : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {loading ? (
          <p className="px-6 py-10 text-center text-sm text-zinc-500">Memuat data…</p>
        ) : !data || data.articles.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-zinc-500">
            Tidak ada berita.{" "}
            <Link href="/admin/berita/tambah" className="text-red-700 hover:underline">Tambah berita pertama</Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-4 py-3 font-semibold">Judul</th>
                  <th className="px-4 py-3 font-semibold">Kategori</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Terbit</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.articles.map((a) => (
                  <tr key={a.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <td className="max-w-xs px-4 py-3">
                      <Link href={`/berita/${a.slug}`} className="font-semibold text-zinc-900 hover:text-red-700">
                        {a.title}
                      </Link>
                      <p className="text-xs text-zinc-400">
                        {a.author?.name ?? "Tanpa penulis"} · {a.views}x dibaca
                      </p>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">{a.category?.name ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLE[a.status]}`}>
                        {STATUS_LABEL[a.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{formatDateTime(a.publishedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/berita/edit/${a.slug}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100"
                          title="Edit berita"
                        >
                          <PencilIcon className="h-3.5 w-3.5" /> Edit
                        </Link>
                        {a.status === "HIDDEN" ? (
                          <button
                            onClick={() => setStatus(a, "PUBLISHED")}
                            disabled={actingId === a.id}
                            className="rounded-lg border border-green-300 px-2.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-50"
                          >
                            Tampilkan
                          </button>
                        ) : (
                          <button
                            onClick={() => setStatus(a, "HIDDEN")}
                            disabled={actingId === a.id}
                            className="rounded-lg border border-amber-300 px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                          >
                            Sembunyikan
                          </button>
                        )}
                        <button
                          onClick={() => softDelete(a)}
                          disabled={actingId === a.id}
                          className="inline-flex items-center rounded-lg bg-red-50 p-1.5 text-red-700 hover:bg-red-100 disabled:opacity-50"
                          title="Sembunyikan (soft delete)"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {data && data.pagination.totalPages > 1 && !loading && (
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              refresh();
            }}
            disabled={page <= 1}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <span className="text-sm text-zinc-500">
            Halaman {data.pagination.page} dari {data.pagination.totalPages}
          </span>
          <button
            onClick={() => {
              setPage((p) => Math.min(data.pagination.totalPages, p + 1));
              refresh();
            }}
            disabled={page >= data.pagination.totalPages}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      )}
    </div>
  );
}