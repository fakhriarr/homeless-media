"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/client-api";
import type { Category } from "@/lib/types";
import ImageUploader from "@/components/admin/ImageUploader";

export type ArticleFormData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
};

type ArticleFormProps = {
  initial: Omit<ArticleFormData, "id" | "slug"> | null;
  articleSlug?: string;
  categories: Category[];
};

export default function ArticleForm({ initial, articleSlug, categories }: ArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(initial?.status ?? "DRAFT");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(articleSlug);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Judul wajib diisi.");
    if (!content.trim()) return setError("Isi konten wajib diisi.");

    setLoading(true);
    try {
      const body = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverImage: coverImage.trim(),
        categoryId: categoryId || null,
        status,
        featured,
      };

      if (isEdit) {
        await clientApi.put(`/api/articles/${articleSlug}`, body);
      } else {
        await clientApi.post("/api/articles", body);
      }

      router.push("/admin/berita");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan berita.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100";
  const labelClass = "mb-1.5 block text-sm font-medium text-zinc-700";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div>
            <label htmlFor="title" className={labelClass}>Judul berita <span className="text-red-600">*</span></label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pemerintah Percepat Pembangunan Infrastruktur Digital"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="excerpt" className={labelClass}>Ringkasan (excerpt)</label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Ringkasan singkat yang tampil di daftar berita."
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="content" className={labelClass}>Isi konten <span className="text-red-600">*</span></label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              placeholder={"Pisahkan paragraf dengan satu baris kosong.\n\nContoh: Pemerintah menegaskan komitmennya…"}
              className={`${inputClass} font-mono`}
            />
            <p className="mt-1 text-xs text-zinc-400">Paragraf dipisahkan dengan baris kosong.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="cover" className={labelClass}>Gambar cover</label>
            <ImageUploader value={coverImage} onChange={setCoverImage} />
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>Kategori</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputClass}
            >
              <option value="">— Pilih kategori —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className={labelClass}>Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
              className={inputClass}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Terbit (Publish)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-red-700 focus:ring-red-500"
            />
            Jadikan berita utama (hero)
          </label>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-60"
            >
              {loading ? "Menyimpan…" : isEdit ? "Simpan Perubahan" : "Terbitkan / Simpan Draft"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/berita")}
              className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}