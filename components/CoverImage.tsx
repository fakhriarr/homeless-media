import Image from "next/image";

type CoverImageProps = {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export default function CoverImage({ src, alt, className = "", sizes = "100vw", priority }: CoverImageProps) {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-zinc-200 text-zinc-400 ${className}`}>
        <span className="text-sm font-medium">Tanpa gambar</span>
      </div>
    );
  }

  if (/^https?:\/\//.test(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={`object-cover ${className}`} loading={priority ? "eager" : "lazy"} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith("/covers/")}
    />
  );
}