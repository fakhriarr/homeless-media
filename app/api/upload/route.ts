import path from "node:path";
import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import { ApiError, handleError, ok } from "@/lib/api-helpers";
import { requireAdmin } from "@/lib/auth";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"]);
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) throw new ApiError("File tidak ditemukan.");
    if (!ALLOWED.has(file.type)) throw new ApiError("Format gambar tidak didukung.");
    if (file.size > MAX_SIZE) throw new ApiError("Ukuran gambar maksimal 5MB.");

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}${EXT_BY_TYPE[file.type] ?? ".img"}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), buffer);

    return ok({
      success: true,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    return handleError(error);
  }
}