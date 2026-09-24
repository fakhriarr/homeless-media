import { clearAuthCookie } from "@/lib/auth";
import { ok } from "@/lib/api-helpers";

export async function POST() {
  return clearAuthCookie(ok({ success: true, message: "Logout berhasil." }));
}