import CoverImage from "@/components/CoverImage";

type ArticleGalleryProps = {
  images: string[];
  title: string;
};

export default function ArticleGallery({ images, title }: ArticleGalleryProps) {
  if (images.length === 0) return null;

  // Jumlah ganjil: gambar pertama tampil penuh, sisanya berpasangan di bawahnya.
  const fullFirst = images.length % 2 === 1;

  return (
    <section className="not-prose space-y-2" aria-label="Galeri dokumentasi">
      <div className="grid gap-3 sm:grid-cols-2">
        {images.map((src, index) => {
          const isFull = fullFirst && index === 0;
          return (
            <a
              key={`${src}-${index}`}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative aspect-video overflow-hidden rounded-xl bg-zinc-200 ${isFull ? "sm:col-span-2" : ""}`}
            >
              <CoverImage
                src={src}
                alt={`${title} — dokumentasi ${index + 1}`}
                sizes={isFull ? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 700px" : "(max-width: 640px) 100vw, 50vw"}
                className="transition-transform duration-300 hover:scale-105"
              />
            </a>
          );
        })}
      </div>
      <p className="text-xs text-zinc-400">Dokumentasi: {title}</p>
    </section>
  );
}
