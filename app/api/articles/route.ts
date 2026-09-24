import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ApiError, handleError, json, ok } from "@/lib/api-helpers";
import { getSession, requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const articleInclude = {
  category: { select: { id: true, name: true, slug: true } },
  author: { select: { id: true, name: true, avatar: true, bio: true } },
} satisfies Prisma.ArticleInclude;

export type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: typeof articleInclude;
}>;

async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "artikel";
  let slug = root;
  let n = 2;
  while (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${root}-${n++}`;
  }
  return slug;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");
    const wantFeatured = searchParams.get("featured") === "1";
    const wantPopular = searchParams.get("popular") === "1";
    const all = searchParams.get("all") === "1";
    const statusFilter = searchParams.get("status");
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 10, 1), 50);
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    const where: Prisma.ArticleWhereInput = {};

    if (all) {
      const user = await getSession();
      if (!user || user.role !== "ADMIN") {
        return json({ error: "Akses ditolak." }, 403);
      }
      if (statusFilter && ["DRAFT", "PUBLISHED", "HIDDEN"].includes(statusFilter)) {
        where.status = statusFilter;
      }
    } else {
      where.status = "PUBLISHED";
      if (wantFeatured) where.featured = true;
    }

    if (q) where.title = { contains: q };

    if (category) {
      where.category = { slug: category };
    }

    const orderBy: Prisma.ArticleOrderByWithRelationInput[] =
      wantPopular ? [{ views: "desc" }, { publishedAt: "desc" }] : [{ publishedAt: "desc" }, { createdAt: "desc" }];

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: articleInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    // Hero highlight: jika tidak ada artikel featured, fallback ke terbaru.
    let result = articles;
    if (wantFeatured && articles.length === 0) {
      result = await prisma.article.findMany({
        where: { status: "PUBLISHED", ...(category ? { category: { slug: category } } : {}) },
        include: articleInclude,
        orderBy: [{ publishedAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      });
    }

    return json({
      articles: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json().catch(() => null);
    const title = String(body?.title ?? "").trim();
    const content = String(body?.content ?? "").trim();
    const excerpt = String(body?.excerpt ?? "").trim() || undefined;
    const coverImage = String(body?.coverImage ?? "").trim() || null;
    const categoryId = String(body?.categoryId ?? "").trim() || null;
    const status = String(body?.status ?? "DRAFT");
    const featured = Boolean(body?.featured);

    if (!title) throw new ApiError("Judul wajib diisi.");
    if (!content) throw new ApiError("Isi konten wajib diisi.");
    if (!["DRAFT", "PUBLISHED", "HIDDEN"].includes(status)) throw new ApiError("Status tidak valid.");

    const user = await getSession();
    const slug = await uniqueSlug(title);

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        categoryId,
        status,
        featured,
        authorId: user!.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
      include: articleInclude,
    });

    return ok({ success: true, message: "Berita berhasil ditambahkan.", article });
  } catch (error) {
    return handleError(error);
  }
}