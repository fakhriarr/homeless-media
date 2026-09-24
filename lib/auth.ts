import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE } from "@/lib/constants";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me-in-production";
const JWT_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
};

type TokenPayload = {
  sub: string;
  role: string;
};

export function signToken(user: { id: string; role: string }): string {
  return jwt.sign({ sub: user.id, role: user.role } satisfies TokenPayload, JWT_SECRET, {
    expiresIn: JWT_MAX_AGE,
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, role: true, avatar: true },
  });
  if (!user) return null;

  return user;
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSession();
  if (!user || user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return user;
}

export function setAuthCookie(
  res: NextResponse,
  token: string
): NextResponse {
  res.cookies.set({
    name: AUTH_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: JWT_MAX_AGE,
  });
  return res;
}

export function clearAuthCookie(res: NextResponse): NextResponse {
  res.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });
  return res;
}

export function toSafeUser(user: SessionUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
  };
}