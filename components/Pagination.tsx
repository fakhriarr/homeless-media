import Link from "next/link";

type PaginationProps = {
  basePath: string;
  page: number;
  totalPages: number;
};

export default function Pagination({ basePath, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
  }

  function href(p: number) {
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}page=${p}`;
  }

  let last = 0;
  return (
    <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Paginasi">
      {page > 1 && (
        <Link
          href={href(page - 1)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Sebelumnya
        </Link>
      )}
      {pages.map((p) => {
        const isGap = p - last > 1;
        last = p;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {isGap && <span className="px-1 text-zinc-400">…</span>}
            <Link
              href={href(p)}
              aria-current={p === page ? "page" : undefined}
              className={`min-w-9 rounded-lg px-3 py-2 text-center text-sm font-medium ${
                p === page ? "bg-red-700 text-white" : "border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              {p}
            </Link>
          </span>
        );
      })}
      {page < totalPages && (
        <Link
          href={href(page + 1)}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          Berikutnya
        </Link>
      )}
    </nav>
  );
}