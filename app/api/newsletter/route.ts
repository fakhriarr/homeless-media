import { prisma } from "@/lib/prisma";
import { ApiError, handleError, json, ok } from "@/lib/api-helpers";
import { getSession, toSafeUser } from "@/lib/auth";

export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return json({ subscribers });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email) throw new ApiError("Email wajib diisi.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError("Format email tidak valid.");

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    const session = await getSessionViaCookie();

    if (existing) {
      const updated =
        session && !existing.userId
          ? await prisma.subscriber.update({
              where: { id: existing.id },
              data: { userId: session.id },
            })
          : existing;
      return ok({
        success: true,
        message: "Email Anda sudah terdaftar sebagai pelanggan.",
        email: updated.email,
      });
    }

    const subscriber = await prisma.subscriber.create({
      data: { email, userId: session?.id ?? null },
    });

    return ok({
      success: true,
      message: "Berhasil berlangganan! Anda akan menerima kabar terbaru dari kami.",
      email: subscriber.email,
    });
  } catch (error) {
    return handleError(error);
  }
}

async function getSessionViaCookie() {
  try {
    const user = await getSession();
    return user ? toSafeUser(user) : null;
  } catch {
    return null;
  }
}