import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";

export function SectionHeading({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-5 flex items-center justify-between border-b-2 border-zinc-900 pb-2">
      <h2 className="font-serif text-xl font-bold text-zinc-900">{title}</h2>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-0.5 text-sm font-semibold text-red-700 hover:text-red-800"
        >
          Lihat Semua <ChevronRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-serif text-3xl font-bold text-zinc-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
    </div>
  );
}