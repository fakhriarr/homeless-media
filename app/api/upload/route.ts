import path from "node:path";
import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
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

function cloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function uploadToCloudinary(buffer: Buffer): Promise<string> {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "homeless-media", public_id: randomUUID(), resource_type: "image" },
      (error, result) => {
        if (error) return reject(new Error("Cloudinary: " + error.message));
        if (!result?.secure_url) return reject(new Error("Cloudinary: URL tidak tersedia."));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

async function uploadLocally(buffer: Buffer, type: string): Promise<string> {
  const filename = `${randomUUID()}${EXT_BY_TYPE[type] ?? ".img"}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) throw new ApiError("File tidak ditemukan.");
    if (!ALLOWED.has(file.type)) throw new ApiError("Format gambar tidak didukung.");
    if (file.size > MAX_SIZE) throw new ApiError("Ukuran gambar maksimal 5MB.");

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = cloudinaryConfigured() ? await uploadToCloudinary(buffer) : await uploadLocally(buffer, file.type);

    return ok({ success: true, url });
  } catch (error) {
    return handleError(error);
  }
}