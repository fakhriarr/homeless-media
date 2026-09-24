import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ApiError, handleError, ok } from "@/lib/api-helpers";
import { setAuthCookie, signToken, toSafeUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!name) throw new ApiError("Nama wajib diisi.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError("Format email tidak valid.");
    if (password.length < 6) throw new ApiError("Password minimal 6 karakter.");

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new ApiError("Email sudah terdaftar.", 409);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: "USER",
      },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });

    const res = ok({
      success: true,
      message: "Registrasi berhasil.",
      user: toSafeUser(user),
    });
    setAuthCookie(res, signToken(user));
    return res;
  } catch (error) {
    return handleError(error);
  }
}