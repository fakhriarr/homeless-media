import type { NextRequest } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ApiError, handleError, json, ok } from "@/lib/api-helpers";
import { getSession, requireAdmin } from "@/lib/auth";

const articleInclude = {
  category: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, name: true, avatar: true, bio: true } },
} satisfies Prisma.ArticleInclude;

async function findByIdentifier(identifier: string, includeAdmin: boolean) {
  const where: Prisma.ArticleWhereInput = includeAdmin ? {} : { status: "PUBLISHED" };
  const article = await prisma.article.findFirst({
    where: { ...where, OR: [{ slug: identifier }, { id: identifier }] },
    include: articleInclude,
  });
  return article;
}

function parseBody(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>;
  return {
    title: String(b.title ?? "").trim(),
    excerpt: String(b.excerpt ?? "").trim(),
    content: String(b.content ?? "").trim(),
    coverImage: String(b.coverImage ?? "").trim(),
    categoryId: String(b.categoryId ?? "").trim(),
    status: String(b.status ?? "").trim().toUpperCase(),
    featured: Boolean(b.featured),
  };
}

export async function GET(req: NextRequest, ctx: RouteContext<"/api/articles/[slug]">) {
  try {
    const { slug } = await ctx.params;
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "1";

    let includeAdmin = false;
    if (all) {
      const user = await getSession();
      if (!user || user.role !== "ADMIN") return json({ error: "Akses ditolak." }, 403);
      includeAdmin = true;
    }

    const article = await findByIdentifier(slug, includeAdmin);
    if (!article) return json({ error: "Berita tidak ditemukan.", article: null }, 404);

    const related = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        categoryId: article.categoryId,
        NOT: { id: article.id },
      },
      include: articleInclude,
      orderBy: [{ publishedAt: "desc" }],
      take: 4,
    });

    return json({ article, related });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest, ctx: RouteContext<"/api/articles/[slug]">) {
  try {
    // Endpoint publik: mencatat pembacaan (views).
    const { slug } = await ctx.params;
    const article = await prisma.article.updateMany({
      where: { slug, status: "PUBLISHED" },
      data: { views: { increment: 1 } },
    });
    if (article.count === 0) return json({ error: "Berita tidak ditemukan." }, 404);
    return ok({ success: true });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest, ctx: RouteContext<"/api/articles/[slug]">) {
  try {
    await requireAdmin();
    const { slug } = await ctx.params;
    const body = parseBody(await req.json().catch(() => null));

    const existing = await prisma.article.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
    if (!existing) throw new ApiError("Berita tidak ditemukan.", 404);

    if (!body.title) throw new ApiError("Judul wajib diisi.");
    if (!body.content) throw new ApiError("Isi konten wajib diisi.");
    if (body.status && !["DRAFT", "PUBLISHED", "HIDDEN"].includes(body.status)) {
      throw new ApiError("Status tidak valid.");
    }

    const nextStatus = body.status || existing.status;

    const data: Prisma.ArticleUpdateInput = {
      title: body.title,
      excerpt: body.excerpt || null,
      content: body.content,
      coverImage: body.coverImage || null,
      featured: body.featured,
      category: body.categoryId ? { connect: { id: body.categoryId } } : { disconnect: true },
      status: nextStatus,
    };

    // Saat berubah menjadi PUBLISHED dari status lain, set tanggal terbit.
    if (nextStatus === "PUBLISHED" && existing.status !== "PUBLISHED") {
      data.publishedAt = new Date();
    }

    const article = await prisma.article.update({
      where: { id: existing.id },
      data,
      include: articleInclude,
    });

    return ok({ success: true, message: "Berita berhasil diperbarui.", article });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest, ctx: RouteContext<"/api/articles/[slug]">) {
  try {
    await requireAdmin();
    const { slug } = await ctx.params;
    const body = await req.json().catch(() => null);
    const status = String(body?.status ?? "").toUpperCase();

    if (!["DRAFT", "PUBLISHED", "HIDDEN"].includes(status)) {
      throw new ApiError("Status tidak valid.");
    }

    const existing = await prisma.article.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
    if (!existing) throw new ApiError("Berita tidak ditemukan.", 404);

    const article = await prisma.article.update({
      where: { id: existing.id },
      data: {
        status,
        publishedAt: status === "PUBLISHED" && existing.status !== "PUBLISHED" ? new Date() : existing.publishedAt,
      },
    });

    return ok({ success: true, message: "Status berita diperbarui.", article: { id: article.id, status: article.status } });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<"/api/articles/[slug]">) {
  try {
    await requireAdmin();
    const { slug } = await ctx.params;
    const existing = await prisma.article.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
    if (!existing) throw new ApiError("Berita tidak ditemukan.", 404);

    // Soft delete: sembunyikan dari halaman publik.
    const article = await prisma.article.update({
      where: { id: existing.id },
      data: { status: "HIDDEN" },
    });

    return ok({ success: true, message: "Berita disembunyikan (soft delete).", article: { id: article.id, status: article.status } });
  } catch (error) {
    return handleError(error);
  }
}