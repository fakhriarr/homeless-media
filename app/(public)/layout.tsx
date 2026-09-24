import Navbar from "@/components/Navbar";
import CategoryBar from "@/components/CategoryBar";
import SiteFooter from "@/components/SiteFooter";
import { apiFetch } from "@/lib/api";
import type { Category } from "@/lib/types";

// Halaman publik dirender saat request (SSR) karena frontend mengonsumsi API sendiri.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const { categories } = await apiFetch<{ categories: Category[] }>("/api/categories").catch(() => ({
    categories: [] as Category[],
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories} />
      <CategoryBar categories={categories} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">{children}</main>
      <SiteFooter categories={categories} />
    </div>
  );
}