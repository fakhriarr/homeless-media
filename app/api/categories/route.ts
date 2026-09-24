import { prisma } from "@/lib/prisma";
import { handleError, json } from "@/lib/api-helpers";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { articles: { where: { status: "PUBLISHED" } } },
        },
      },
    });

    return json({
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        articleCount: c._count.articles,
      })),
    });
  } catch (error) {
    return handleError(error);
  }
}