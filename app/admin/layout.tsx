import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `Panel Admin | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}