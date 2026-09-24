import { ApiError, handleError, ok } from "@/lib/api-helpers";

// Reset password dummy: tanpa mengirim email sungguhan.
// Cukup memvalidasi email lalu "mengirim" email berisi link reset.
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email) throw new ApiError("Email wajib diisi.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ApiError("Format email tidak valid.");
    }

    return ok({
      success: true,
      message: "Link reset password telah dikirim ke email Anda (simulasi).",
    });
  } catch (error) {
    return handleError(error);
  }
}