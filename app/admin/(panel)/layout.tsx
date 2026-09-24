import { redirect } from "next/navigation";
import { getSession, toSafeUser } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();

  if (!user) redirect("/admin/login");
  if (user.role !== "ADMIN") redirect("/admin/login?blocked=1");

  return (
    <div className="min-h-screen bg-zinc-100">
      <AdminNav user={toSafeUser(user)} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}