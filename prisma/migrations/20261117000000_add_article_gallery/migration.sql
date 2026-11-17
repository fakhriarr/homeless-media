-- Tambah galeri gambar (multiple) pada artikel.
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "galleryImages" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "galleryLayout" TEXT NOT NULL DEFAULT 'BOTTOM';
