"use client";

import { useRef, useState } from "react";
import CoverImage from "@/components/CoverImage";

type GalleryUploaderProps = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export default function GalleryUploader({ value, onChange }: GalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          credentials: "include",
          body: form,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Upload "${file.name}" gagal.`);
        uploaded.push(data.url);
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function addUrl() {
    const url = urlInput.trim();
    if (!url) return;
    onChange([...value, url]);
    setUrlInput("");
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60"
      >
        {uploading ? "Mengunggah…" : "Unggah Gambar (bisa pilih banyak)"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {value.map((url, index) => (
            <div key={`${url}-${index}`} className="group relative aspect-video overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
              <CoverImage src={url} alt={`Gambar galeri ${index + 1}`} sizes="(max-width: 640px) 50vw, 200px" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-end gap-1 bg-gradient-to-b from-black/50 to-transparent p-1.5">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  title="Pindah ke kiri"
                  className="rounded bg-white/90 px-1.5 text-xs font-bold text-zinc-700 disabled:opacity-40"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === value.length - 1}
                  title="Pindah ke kanan"
                  className="rounded bg-white/90 px-1.5 text-xs font-bold text-zinc-700 disabled:opacity-40"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  title="Hapus gambar"
                  className="rounded bg-brand-700 px-1.5 text-xs font-bold text-white"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
          placeholder="atau tempel URL gambar…"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-brand-700 focus:ring-2 focus:ring-brand-100/40"
        />
        <button
          type="button"
          onClick={addUrl}
          className="shrink-0 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Tambah
        </button>
      </div>

      {error && <p className="text-sm text-brand-600">{error}</p>}
      <p className="text-xs text-zinc-400">
        {value.length} gambar. Maks. 5MB per gambar. Format: JPG, PNG, WebP, GIF, SVG, AVIF.
      </p>
    </div>
  );
}
