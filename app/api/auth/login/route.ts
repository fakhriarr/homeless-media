import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ApiError, handleError, ok } from "@/lib/api-helpers";
import { setAuthCookie, signToken, toSafeUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();
    const password = String(body?.password ?? "");

    if (!email || !password) throw new ApiError("Email dan password wajib diisi.");

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, role: true, avatar: true, password: true },
    });

    if (!user) throw new ApiError("Email atau password salah.", 401);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new ApiError("Email atau password salah.", 401);

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };

    const res = ok({
      success: true,
      message: "Login berhasil.",
      user: toSafeUser(safeUser),
    });
    setAuthCookie(res, signToken(safeUser));
    return res;
  } catch (error) {
    return handleError(error);
  }
}