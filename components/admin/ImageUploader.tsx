"use client";

import { useRef, useState } from "react";
import CoverImage from "@/components/CoverImage";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload gagal.");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 sm:w-64">
          <CoverImage src={value} alt="Pratinjau gambar cover" className="p-0" sizes="256px" />
        </div>
        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60 sm:w-auto"
          >
            {uploading ? "Mengunggah…" : "Unggah Gambar"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="atau tempel URL gambar…"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <p className="text-xs text-zinc-400">
            Maks. 5MB. Format: JPG, PNG, WebP, GIF, SVG, AVIF. Disimpan secara lokal.
          </p>
        </div>
      </div>
    </div>
  );
}