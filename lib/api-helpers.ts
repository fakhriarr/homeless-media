import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function ok(data: unknown = { success: true }) {
  return json(data, 200);
}

export function handleError(error: unknown): Response {
  if (error instanceof ApiError) {
    return json({ error: error.message }, error.status);
  }
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return json({ error: "Silakan login terlebih dahulu." }, 401);
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return json({ error: "Akses ditolak. Hanya admin yang diizinkan." }, 403);
  }
  console.error("[api] unhandled error:", error);
  return json({ error: "Terjadi kesalahan pada server." }, 500);
}